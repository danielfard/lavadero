import { loginSchema } from '@/lib/schemas/login.schema';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { redirect } from '@sveltejs/kit';
export const load = async ({ locals: { supabase } }) => {
    const loginForm = await superValidate(zod4(loginSchema));

    // Always return { form } in load functions
    return { loginForm };
};

export const actions = {
    login: async ({ request, locals: { supabase } }) => {
        const form = await superValidate(request, zod4(loginSchema));
        console.log(form);

        if (!form.valid) {
            // Return { form } and things will just work.
            return fail(400, { form });
        }

        // TODO: Do something with the validated form.data
        let { data, error } = await supabase.auth.signInWithPassword({
            email: form.data.email,
            password: form.data.password
        })
        console.log(data)
        if (error) {
            return fail(400, { form });
        }
        // Return the form with a status message
        return redirect(301, "/washing")
    }
};