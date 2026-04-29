<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	type Customer = { id: string; name: string; document: string | null; phone: string | null; birthdate: string | null };
	type Vehicle = { id: string; plate: string; [key: string]: unknown };

	let customers: Customer[] = $derived(data.customers ?? []);
	let vehicles: Vehicle[] = $derived(data.vehicles ?? []);
	let search = $state('');
	let showModal = $state(false);

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
		return vehicles.filter((v) => (v as { customer_id?: string }).customer_id === customerId);
	}

	const { form: createForm, enhance: enhanceCreate } = superForm(data.createForm, {
		dataType: 'json',
		onResult: () => {
			showModal = false;
		}
	});
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
					<th>Cliente</th><th>Documento</th><th>Teléfono</th><th>Vehículos</th>
				</tr>
			</thead>
			<tbody>
				{#if filtered.length === 0}
					<tr><td colspan="4" class="empty-row">No hay clientes registrados</td></tr>
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
										<span style="font-size:12px"><span style="font-weight:600">{v.plate}</span></span>
									{/each}
								</div>
							{:else}
								<span style="font-size:12px;color:var(--text2)">Sin vehículos</span>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

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
				</div>
			</div>
			<div class="lv-modal-footer">
				<button class="lv-btn lv-btn-ghost" onclick={() => (showModal = false)}>Cancelar</button>
				<form method="POST" action="?/create" use:enhanceCreate>
					<button type="submit" class="lv-btn lv-btn-primary">Crear Cliente</button>
				</form>
			</div>
		</div>
	</div>
{/if}
