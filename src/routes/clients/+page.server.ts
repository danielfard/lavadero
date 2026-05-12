import { createClientSchema, updateClientSchema } from '@/lib/schemas/create-client.schema';
import { addVehicleSchema, updateVehicleSchema, removeVehicleSchema } from '@/lib/schemas/vehicle.schema';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async ({ locals: { supabase } }) => {
	const [{ data: customers }, { data: vehicles }] = await Promise.all([
		supabase.from('customers').select('id, name, document, phone, birthdate, email').order('name'),
		supabase.from('vehicles').select('id, plate, customer_id, active').eq('active', true)
	]);

	const [createForm, updateForm, addVehicleForm, updateVehicleForm, removeVehicleForm] = await Promise.all([
		superValidate(zod4(createClientSchema)),
		superValidate(zod4(updateClientSchema)),
		superValidate(zod4(addVehicleSchema)),
		superValidate(zod4(updateVehicleSchema)),
		superValidate(zod4(removeVehicleSchema))
	]);

	return {
		customers: customers ?? [],
		vehicles: vehicles ?? [],
		createForm,
		updateForm,
		addVehicleForm,
		updateVehicleForm,
		removeVehicleForm
	};
};

export const actions = {
	create: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod4(createClientSchema));
		if (!form.valid) return fail(400, { form });
		const { error } = await supabase.from('customers').insert(form.data);
		if (error) {
			console.error('Error creando cliente:', error);
			return message(form, 'Error al crear el cliente. Intenta de nuevo.', { status: 500 });
		}
		return { form };
	},

	update: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod4(updateClientSchema));
		if (!form.valid) return fail(400, { form });
		const { id, ...fields } = form.data;
		const { error } = await supabase.from('customers').update(fields).eq('id', id);
		if (error) {
			console.error('Error actualizando cliente:', error);
			return message(form, 'Error al actualizar el cliente. Intenta de nuevo.', { status: 500 });
		}
		return { form };
	},

	addVehicle: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod4(addVehicleSchema));
		if (!form.valid) return fail(400, { form });
		const { error } = await supabase.from('vehicles').insert(form.data);
		if (error) {
			console.error('Error agregando vehículo:', error);
			return message(form, 'Error al agregar el vehículo. Intenta de nuevo.', { status: 500 });
		}
		return { form };
	},

	updateVehicle: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod4(updateVehicleSchema));
		if (!form.valid) return fail(400, { form });
		const { id, plate } = form.data;
		const { error } = await supabase.from('vehicles').update({ plate }).eq('id', id);
		if (error) {
			console.error('Error actualizando vehículo:', error);
			return message(form, 'Error al actualizar la placa. Intenta de nuevo.', { status: 500 });
		}
		return { form };
	},

	removeVehicle: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod4(removeVehicleSchema));
		if (!form.valid) return fail(400, { form });
		const { error } = await supabase.from('vehicles').update({ active: false }).eq('id', form.data.id);
		if (error) {
			console.error('Error desactivando vehículo:', error);
			return message(form, 'Error al quitar el vehículo. Intenta de nuevo.', { status: 500 });
		}
		return { form };
	}
};
