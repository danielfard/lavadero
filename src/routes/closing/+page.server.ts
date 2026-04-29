export const load = async ({ locals: { supabase } }) => {
	const today = new Date().toISOString().split('T')[0];

	const [{ data: washings }, { data: employees }] = await Promise.all([
		supabase
			.from('washing')
			.select('id, status, final_price, service, washing_date, employee, employees(id, name, commission), vehicles(plate)')
			.eq('washing_date', today),
		supabase.from('employees').select('id, name, commission').eq('state', true)
	]);

	return {
		washings: washings ?? [],
		employees: employees ?? []
	};
};
