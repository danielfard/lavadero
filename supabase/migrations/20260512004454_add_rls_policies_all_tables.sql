-- RLS policies: full access for authenticated users on all app tables

-- customers
create policy "authenticated_select_customers" on customers for select to authenticated using (true);
create policy "authenticated_insert_customers" on customers for insert to authenticated with check (true);
create policy "authenticated_update_customers" on customers for update to authenticated using (true);
create policy "authenticated_delete_customers" on customers for delete to authenticated using (true);

-- vehicles
create policy "authenticated_select_vehicles" on vehicles for select to authenticated using (true);
create policy "authenticated_insert_vehicles" on vehicles for insert to authenticated with check (true);
create policy "authenticated_update_vehicles" on vehicles for update to authenticated using (true);
create policy "authenticated_delete_vehicles" on vehicles for delete to authenticated using (true);

-- washing
create policy "authenticated_select_washing" on washing for select to authenticated using (true);
create policy "authenticated_insert_washing" on washing for insert to authenticated with check (true);
create policy "authenticated_update_washing" on washing for update to authenticated using (true);
create policy "authenticated_delete_washing" on washing for delete to authenticated using (true);

-- employees
create policy "authenticated_select_employees" on employees for select to authenticated using (true);
create policy "authenticated_insert_employees" on employees for insert to authenticated with check (true);
create policy "authenticated_update_employees" on employees for update to authenticated using (true);
create policy "authenticated_delete_employees" on employees for delete to authenticated using (true);
