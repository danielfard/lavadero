import { createClientSchema } from '@/lib/schemas/create-client.schema';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async ({ params, locals: { supabase } }) => {
  

  let { data: washing, error } = await supabase
    .from('washing')
    .select(`
      *,
      vehicles(id, plate),
      employees(id, name)
    `);

  if (error) {
    console.error(error)
  }
  const createClientForm = await superValidate(zod4(createClientSchema));
  return { washing, createClientForm }
};


export const actions = {
  updateStatus: async ({ request, locals: { supabase } }) => {
    const data = await request.formData();
    const id = data.get('id') as string;
    const status = data.get('status') as string;
    if (!id || !status) return fail(400, { message: 'Datos inválidos' });
    const { error } = await supabase.from('washing').update({ status }).eq('id', id);
    if (error) return fail(500, { message: error.message });
    return { success: true };
  },

  createClient: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod4(createClientSchema));
    console.log(form.data)
    if (!form.valid) {
      console.log(form.errors)
      return fail(400, { form });
    }
    const { data, error } = await supabase.from('customers').insert({
      ...form.data
    });
    if (error) {
      return fail(400, { form });
    }
    return { form };
  }
}