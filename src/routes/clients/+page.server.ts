import { createClientSchema } from '@/lib/schemas/create-client.schema';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async ({ locals: { supabase } }) => {
	const [{ data: customers }, { data: vehicles }] = await Promise.all([
		supabase.from('customers').select('id, name, document, phone, birthdate').order('name'),
		supabase.from('vehicles').select('*')
	]);

	const createForm = await superValidate(zod4(createClientSchema));

	return {
		customers: customers ?? [],
		vehicles: vehicles ?? [],
		createForm
	};
};

export const actions = {
	create: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod4(createClientSchema));
		if (!form.valid) return fail(400, { form });
		const { error } = await supabase.from('customers').insert(form.data);
		if (error) return fail(500, { form });
		return { form };
	}
};
