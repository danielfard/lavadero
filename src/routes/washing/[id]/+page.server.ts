export const load = async ({ params, locals: { supabase } }) => {

  let { data: washing, error } = await supabase
    .from('washing')
    .select(`
      id,
      washing_date,
      final_price,
      vehicles(id, plate),
      employees(id, name)
    `).eq("id", params.id).single();

  if (error) {
    console.error(error)
  }
  console.log(params.id)
  let { data: services, error: servicesError } = await supabase
    .from('services')
    .select(`
      *,
      washing(id)
    `).eq("washing_id", params.id)
  if (servicesError) {
    console.error(servicesError)
  }
  console.log(washing)
  console.log(services)
  return { washing, services }
};