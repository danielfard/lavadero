import { createEmployeeSchema, updateEmployeeSchema } from '@/lib/schemas/employee.schema';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async ({ locals: { supabase } }) => {
	const today = new Date().toISOString().split('T')[0];

	const [{ data: employees, error }, { data: todayWashings }] = await Promise.all([
		supabase.from('employees').select('*').order('name'),
		supabase
			.from('washing')
			.select('id, employee, final_price, status')
			.eq('washing_date', today)
			.eq('status', 'completado')
	]);

	if (error) console.error(error);

	const createForm = await superValidate(zod4(createEmployeeSchema));
	const updateForm = await superValidate(zod4(updateEmployeeSchema));

	return {
		employees: employees ?? [],
		todayWashings: todayWashings ?? [],
		createForm,
		updateForm
	};
};

export const actions = {
	create: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod4(createEmployeeSchema));
		if (!form.valid) return fail(400, { form });

		const { error } = await supabase.from('employees').insert(form.data);
		if (error) return fail(500, { form });

		return { form };
	},

	update: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod4(updateEmployeeSchema));
		if (!form.valid) return fail(400, { form });

		const { id, ...fields } = form.data;
		const { error } = await supabase.from('employees').update(fields).eq('id', id);
		if (error) return fail(500, { form });

		return { form };
	}
};
