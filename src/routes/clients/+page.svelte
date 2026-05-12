<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	type Customer = { id: string; name: string; document: string | null; phone: string | null; birthdate: string | null; email: string | null };
	type Vehicle = { id: string; plate: string; customer_id?: string; active?: boolean };

	let customers: Customer[] = $derived(data.customers ?? []);
	let vehicles: Vehicle[] = $derived(data.vehicles ?? []);
	let search = $state('');
	let showModal = $state(false);
	let showEditModal = $state(false);
	let showVehicleModal = $state(false);
	let selectedClient = $state<Customer | null>(null);
	let editingVehicleId = $state<string | null>(null);
	let editingPlate = $state('');

	let filtered = $derived(
		customers.filter((c) => {
			if (!search) return true;
			const q = search.toLowerCase();
			return (
				c.name.toLowerCase().includes(q) ||
				(c.document ?? '').includes(q) ||
				(c.phone ?? '').includes(q)
			);
		})
	);

	function getVehicles(customerId: string) {
		return vehicles.filter((v) => v.customer_id === customerId);
	}

	const { form: createForm, enhance: enhanceCreate, message: createMessage } = superForm(data.createForm, {
		dataType: 'json',
		onResult: ({ result }) => { if (result.type === 'success') showModal = false; },
		invalidateAll: true
	});

	const { form: updateForm, enhance: enhanceUpdate, message: updateMessage } = superForm(data.updateForm, {
		dataType: 'json',
		onResult: ({ result }) => { if (result.type === 'success') showEditModal = false; },
		invalidateAll: true
	});

	const { form: addVehicleForm, enhance: enhanceAddVehicle, message: vehicleMessage } = superForm(data.addVehicleForm, {
		dataType: 'json',
		onResult: ({ result }) => { if (result.type === 'success') $addVehicleForm.plate = ''; },
		invalidateAll: true
	});

	const { form: updateVehicleForm, enhance: enhanceUpdateVehicle } = superForm(data.updateVehicleForm, {
		dataType: 'json',
		onResult: ({ result }) => { if (result.type === 'success') editingVehicleId = null; },
		invalidateAll: true
	});

	const { form: removeVehicleForm, enhance: enhanceRemoveVehicle } = superForm(data.removeVehicleForm, {
		dataType: 'json',
		invalidateAll: true
	});

	function openEdit(c: Customer) {
		$updateForm.id = c.id;
		$updateForm.name = c.name;
		$updateForm.document = c.document ?? '';
		$updateForm.phone = c.phone ?? '';
		$updateForm.birthdate = c.birthdate ?? '';
		$updateForm.email = c.email ?? '';
		selectedClient = c;
		showEditModal = true;
	}

	function openVehicleModal(c: Customer) {
		$addVehicleForm.customer_id = c.id;
		$addVehicleForm.plate = '';
		editingVehicleId = null;
		selectedClient = c;
		showVehicleModal = true;
	}

	function startEditVehicle(v: Vehicle) {
		$updateVehicleForm.id = v.id;
		editingPlate = v.plate;
		editingVehicleId = v.id;
	}

	function cancelEditVehicle() {
		editingVehicleId = null;
	}
</script>

<div class="lv-card">
	<div class="lv-card-header">
		<div class="lv-card-header-left">
			<div class="lv-card-title">Clientes</div>
			<div class="lv-card-sub">{customers.length} clientes registrados</div>
		</div>
		<div style="display:flex;gap:8px">
			<div class="lv-search">
				<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M21 21l-4.35-4.35" /><path d="M17 11A6 6 0 105 11a6 6 0 0012 0z" />
				</svg>
				<input bind:value={search} placeholder="Buscar cliente..." />
			</div>
			<button class="lv-btn lv-btn-primary" onclick={() => (showModal = true)}>
				<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M12 5v14M5 12h14" />
				</svg>
				Nuevo Cliente
			</button>
		</div>
	</div>
	<div class="table-wrap">
		<table class="lv-table">
			<thead>
				<tr>
					<th>Cliente</th><th>Documento</th><th>Teléfono</th><th>Vehículos</th><th></th>
				</tr>
			</thead>
			<tbody>
				{#if filtered.length === 0}
					<tr><td colspan="5" class="empty-row">No hay clientes registrados</td></tr>
				{/if}
				{#each filtered as c}
					{@const cvehicles = getVehicles(c.id)}
					<tr>
						<td>
							<div style="display:flex;align-items:center;gap:10px">
								<div style="width:32px;height:32px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0">
									{c.name.charAt(0).toUpperCase()}
								</div>
								<span style="font-weight:600">{c.name}</span>
							</div>
						</td>
						<td class="muted">{c.document ?? '—'}</td>
						<td class="muted">{c.phone ?? '—'}</td>
						<td>
							{#if cvehicles.length > 0}
								<div style="display:flex;flex-wrap:wrap;gap:6px">
									{#each cvehicles as v}
										<span style="font-size:12px;font-weight:600">{v.plate}</span>
									{/each}
								</div>
							{:else}
								<span style="font-size:12px;color:var(--text2)">Sin vehículos</span>
							{/if}
						</td>
						<td>
							<div style="display:flex;gap:6px;justify-content:flex-end">
								<button class="lv-btn lv-btn-ghost" style="padding:6px 8px" title="Gestionar vehículos" onclick={() => openVehicleModal(c)}>
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h5l2 4v4h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
									</svg>
								</button>
								<button class="lv-btn lv-btn-ghost" style="padding:6px 8px" title="Editar cliente" onclick={() => openEdit(c)}>
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
									</svg>
								</button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<!-- Modal: Nuevo Cliente -->
{#if showModal}
	<div class="lv-modal-overlay" role="presentation" onclick={(e) => e.target === e.currentTarget && (showModal = false)}>
		<div class="lv-modal">
			<div class="lv-modal-header">
				<div>
					<div class="lv-modal-title">Nuevo Cliente</div>
					<div class="lv-modal-sub">Registra un nuevo cliente</div>
				</div>
				<button class="lv-modal-close" aria-label="Cerrar" onclick={() => (showModal = false)}>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				</button>
			</div>
			<div class="lv-modal-body">
				<div class="form-grid">
					<div class="lv-field span-2">
						<label for="c-name">Nombre completo</label>
						<input id="c-name" bind:value={$createForm.name} placeholder="Nombre del cliente" />
					</div>
					<div class="lv-field">
						<label for="c-doc">Documento</label>
						<input id="c-doc" bind:value={$createForm.document} placeholder="CC / NIT" />
					</div>
					<div class="lv-field">
						<label for="c-phone">Teléfono</label>
						<input id="c-phone" bind:value={$createForm.phone} placeholder="300-000-0000" />
					</div>
					<div class="lv-field span-2">
						<label for="c-birth">Fecha de nacimiento</label>
						<input id="c-birth" type="date" bind:value={$createForm.birthdate} />
					</div>
					<div class="lv-field span-2">
						<label for="c-email">Correo electrónico <span style="color:var(--text2);font-weight:400">(opcional)</span></label>
						<input id="c-email" type="email" bind:value={$createForm.email} placeholder="correo@ejemplo.com" />
					</div>
				</div>
			</div>
			<div class="lv-modal-footer">
				{#if $createMessage}
					<span style="color:var(--error,#ef4444);font-size:13px">{$createMessage}</span>
				{/if}
				<button class="lv-btn lv-btn-ghost" onclick={() => (showModal = false)}>Cancelar</button>
				<form method="POST" action="?/create" use:enhanceCreate>
					<button type="submit" class="lv-btn lv-btn-primary">Crear Cliente</button>
				</form>
			</div>
		</div>
	</div>
{/if}

<!-- Modal: Editar Cliente -->
{#if showEditModal && selectedClient}
	<div class="lv-modal-overlay" role="presentation" onclick={(e) => e.target === e.currentTarget && (showEditModal = false)}>
		<div class="lv-modal">
			<div class="lv-modal-header">
				<div>
					<div class="lv-modal-title">Editar Cliente</div>
					<div class="lv-modal-sub">{selectedClient.name}</div>
				</div>
				<button class="lv-modal-close" aria-label="Cerrar" onclick={() => (showEditModal = false)}>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				</button>
			</div>
			<div class="lv-modal-body">
				<div class="form-grid">
					<div class="lv-field span-2">
						<label for="e-name">Nombre completo</label>
						<input id="e-name" bind:value={$updateForm.name} placeholder="Nombre del cliente" />
					</div>
					<div class="lv-field">
						<label for="e-doc">Documento</label>
						<input id="e-doc" bind:value={$updateForm.document} placeholder="CC / NIT" />
					</div>
					<div class="lv-field">
						<label for="e-phone">Teléfono</label>
						<input id="e-phone" bind:value={$updateForm.phone} placeholder="300-000-0000" />
					</div>
					<div class="lv-field span-2">
						<label for="e-birth">Fecha de nacimiento</label>
						<input id="e-birth" type="date" bind:value={$updateForm.birthdate} />
					</div>
					<div class="lv-field span-2">
						<label for="e-email">Correo electrónico <span style="color:var(--text2);font-weight:400">(opcional)</span></label>
						<input id="e-email" type="email" bind:value={$updateForm.email} placeholder="correo@ejemplo.com" />
					</div>
				</div>
			</div>
			<div class="lv-modal-footer">
				{#if $updateMessage}
					<span style="color:var(--error,#ef4444);font-size:13px">{$updateMessage}</span>
				{/if}
				<button class="lv-btn lv-btn-ghost" onclick={() => (showEditModal = false)}>Cancelar</button>
				<form method="POST" action="?/update" use:enhanceUpdate>
					<input type="hidden" name="id" value={$updateForm.id} />
					<button type="submit" class="lv-btn lv-btn-primary">Guardar Cambios</button>
				</form>
			</div>
		</div>
	</div>
{/if}

<!-- Modal: Gestionar Vehículos -->
{#if showVehicleModal && selectedClient}
	<div class="lv-modal-overlay" role="presentation" onclick={(e) => e.target === e.currentTarget && (showVehicleModal = false)}>
		<div class="lv-modal" style="max-width:460px">
			<div class="lv-modal-header">
				<div>
					<div class="lv-modal-title">Vehículos</div>
					<div class="lv-modal-sub">{selectedClient.name}</div>
				</div>
				<button class="lv-modal-close" aria-label="Cerrar" onclick={() => (showVehicleModal = false)}>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				</button>
			</div>
			<div class="lv-modal-body" style="display:flex;flex-direction:column;gap:12px">

				<!-- Lista de vehículos existentes -->
				{#each getVehicles(selectedClient.id) as v}
					<div style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;background:var(--surface2,#f8fafc)">
						{#if editingVehicleId === v.id}
							<input
								bind:value={editingPlate}
								style="flex:1;font-weight:600;font-size:14px;text-transform:uppercase"
								placeholder="Placa"
							/>
							<form method="POST" action="?/updateVehicle" use:enhanceUpdateVehicle
								onsubmit={() => { $updateVehicleForm.id = v.id; $updateVehicleForm.plate = editingPlate; }}>
								<button type="submit" class="lv-btn lv-btn-primary" style="padding:4px 10px;font-size:12px">Guardar</button>
							</form>
							<button class="lv-btn lv-btn-ghost" style="padding:4px 8px" onclick={cancelEditVehicle}>
								<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M18 6L6 18M6 6l12 12" />
								</svg>
							</button>
						{:else}
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0">
								<rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h5l2 4v4h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
							</svg>
							<span style="flex:1;font-weight:600;font-size:14px">{v.plate}</span>
							<button class="lv-btn lv-btn-ghost" style="padding:4px 8px" title="Editar placa" onclick={() => startEditVehicle(v)}>
								<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
								</svg>
							</button>
							<form method="POST" action="?/removeVehicle" use:enhanceRemoveVehicle
								onsubmit={() => { $removeVehicleForm.id = v.id; }}>
								<button type="submit" class="lv-btn lv-btn-ghost" style="padding:4px 8px;color:var(--error,#ef4444)" title="Quitar vehículo">
									<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M18 6L6 18M6 6l12 12" />
									</svg>
								</button>
							</form>
						{/if}
					</div>
				{:else}
					<div style="text-align:center;padding:12px 0;font-size:13px;color:var(--text2)">Sin vehículos registrados</div>
				{/each}

				<!-- Agregar nuevo vehículo -->
				<div style="border-top:1px solid var(--border,#e2e8f0);padding-top:12px;margin-top:4px">
					<div style="font-size:12px;color:var(--text2);margin-bottom:8px;font-weight:500">Agregar nuevo vehículo</div>
					<div style="display:flex;gap:8px;align-items:flex-end">
						<div class="lv-field" style="flex:1;margin:0">
							<input id="v-plate" bind:value={$addVehicleForm.plate} placeholder="Ej: ABC123" style="text-transform:uppercase" />
						</div>
						<form method="POST" action="?/addVehicle" use:enhanceAddVehicle>
							<button type="submit" class="lv-btn lv-btn-primary">Agregar</button>
						</form>
					</div>
					{#if $vehicleMessage}
						<span style="color:var(--error,#ef4444);font-size:12px;margin-top:6px;display:block">{$vehicleMessage}</span>
					{/if}
				</div>

			</div>
			<div class="lv-modal-footer">
				<button class="lv-btn lv-btn-ghost" onclick={() => (showVehicleModal = false)}>Cerrar</button>
			</div>
		</div>
	</div>
{/if}
