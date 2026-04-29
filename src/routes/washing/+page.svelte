<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { enhance } from '$app/forms';

	let { data } = $props();

	type Washing = {
		id: string;
		status: string | null;
		final_price: number | null;
		service: string | null;
		washing_date: string | null;
		employee: string | null;
		vehicles: { id: string; plate: string } | null;
		employees: { id: string; name: string } | null;
	};

	let washingList: Washing[] = $derived(data.washing ?? []);
	let activeTab = $state('todos');
	let search = $state('');
	let showClientModal = $state(false);
	let showServiceModal = $state(false);

	let filtered = $derived(
		washingList.filter((w) => {
			const matchTab = activeTab === 'todos' || w.status === activeTab;
			const q = search.toLowerCase();
			const matchSearch =
				!q ||
				(w.vehicles?.plate ?? '').toLowerCase().includes(q) ||
				(w.employees?.name ?? '').toLowerCase().includes(q) ||
				(w.service ?? '').toLowerCase().includes(q);
			return matchTab && matchSearch;
		})
	);

	let completados = $derived(washingList.filter((w) => w.status === 'completado'));
	let enProceso = $derived(washingList.filter((w) => w.status === 'en_proceso'));
	let totalIngresos = $derived(completados.reduce((s, w) => s + (w.final_price ?? 0), 0));

	const { form: createClientForm, enhance: enhanceCreateClient } = superForm(
		data.createClientForm,
		{
			dataType: 'json',
			onResult: () => {
				showClientModal = false;
			}
		}
	);

	function fmt(n: number) {
		return '$' + n.toLocaleString('es-CO');
	}

	function fmtDate(d: string | null) {
		if (!d) return '—';
		return d.length > 10 ? d.slice(11, 16) : d;
	}

	const STATUS_MAP: Record<string, { label: string; cls: string }> = {
		completado: { label: 'Completado', cls: 'lv-badge-green' },
		en_proceso: { label: 'En Proceso', cls: 'lv-badge-blue' },
		pendiente: { label: 'Pendiente', cls: 'lv-badge-yellow' }
	};

	const TABS = [
		{ id: 'todos', label: 'Todos' },
		{ id: 'pendiente', label: 'Pendiente' },
		{ id: 'en_proceso', label: 'En Proceso' },
		{ id: 'completado', label: 'Completado' }
	];
</script>

<div class="stat-grid">
	<div class="stat-card">
		<div class="stat-icon" style="background:rgba(14,165,233,.15)">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M5 17H3v-5l2.5-5h11L19 12v5h-2" /><path d="M7 17h10" />
				<path d="M7 17a2 2 0 100-4 2 2 0 000 4z" /><path d="M17 17a2 2 0 100-4 2 2 0 000 4z" />
			</svg>
		</div>
		<div class="stat-label">Total Hoy</div>
		<div class="stat-value">{washingList.length}</div>
	</div>
	<div class="stat-card">
		<div class="stat-icon" style="background:rgba(34,197,94,.15)">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M20 6L9 17l-5-5" />
			</svg>
		</div>
		<div class="stat-label">Completados</div>
		<div class="stat-value">{completados.length}</div>
	</div>
	<div class="stat-card">
		<div class="stat-icon" style="background:rgba(245,158,11,.15)">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M5 17H3v-5l2.5-5h11L19 12v5h-2" /><path d="M7 17h10" />
				<path d="M7 17a2 2 0 100-4 2 2 0 000 4z" /><path d="M17 17a2 2 0 100-4 2 2 0 000 4z" />
			</svg>
		</div>
		<div class="stat-label">En Proceso</div>
		<div class="stat-value">{enProceso.length}</div>
	</div>
	<div class="stat-card">
		<div class="stat-icon" style="background:rgba(124,58,237,.15)">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M12 1v22" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
			</svg>
		</div>
		<div class="stat-label">Ingresos</div>
		<div class="stat-value">{fmt(totalIngresos)}</div>
	</div>
</div>

<div class="lv-card">
	<div class="lv-card-header">
		<div class="lv-card-header-left">
			<div class="lv-card-title">Servicios de Lavado</div>
			<div class="lv-card-sub">Lista de todos los servicios del día</div>
		</div>
		<div style="display:flex;gap:8px">
			<button class="lv-btn lv-btn-ghost lv-btn-sm" onclick={() => (showClientModal = true)}>
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M12 5v14M5 12h14" />
				</svg>
				Nuevo Cliente
			</button>
			<button class="lv-btn lv-btn-primary lv-btn-sm" onclick={() => (showServiceModal = true)}>
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M12 5v14M5 12h14" />
				</svg>
				Nuevo Servicio
			</button>
		</div>
	</div>

	<div class="card-filter-row">
		<div class="lv-tabs">
			{#each TABS as t}
				<button class="lv-tab" class:active={activeTab === t.id} onclick={() => (activeTab = t.id)}>
					{t.label}
				</button>
			{/each}
		</div>
		<div class="lv-search">
			<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M21 21l-4.35-4.35" /><path d="M17 11A6 6 0 105 11a6 6 0 0012 0z" />
			</svg>
			<input bind:value={search} placeholder="Buscar servicio, placa..." />
		</div>
	</div>

	<div class="table-wrap">
		<table class="lv-table">
			<thead>
				<tr>
					<th>Empleado</th><th>Placa</th><th>Servicio</th><th>Precio</th><th>Estado</th><th>Fecha</th><th>Cambiar Estado</th>
				</tr>
			</thead>
			<tbody>
				{#if filtered.length === 0}
					<tr><td colspan="7" class="empty-row">No hay servicios</td></tr>
				{/if}
				{#each filtered as w}
					{@const s = STATUS_MAP[w.status ?? ''] ?? { label: w.status ?? '—', cls: 'lv-badge-gray' }}
					<tr>
						<td style="font-weight:500">{w.employees?.name ?? '—'}</td>
						<td style="font-weight:600">{w.vehicles?.plate ?? '—'}</td>
						<td class="muted">{w.service ?? '—'}</td>
						<td style="font-weight:700">{fmt(w.final_price ?? 0)}</td>
						<td><span class="lv-badge {s.cls}">{s.label}</span></td>
						<td class="muted">{fmtDate(w.washing_date)}</td>
						<td>
							<form method="POST" action="?/updateStatus" use:enhance>
								<input type="hidden" name="id" value={w.id} />
								<select
									name="status"
									class="status-select"
									value={w.status ?? 'pendiente'}
									onchange={(e) => e.currentTarget.form?.requestSubmit()}
								>
									<option value="pendiente">Pendiente</option>
									<option value="en_proceso">En Proceso</option>
									<option value="completado">Completado</option>
								</select>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<!-- Modal: Nuevo Cliente -->
{#if showClientModal}
	<div class="lv-modal-overlay" role="presentation" onclick={(e) => e.target === e.currentTarget && (showClientModal = false)}>
		<div class="lv-modal">
			<div class="lv-modal-header">
				<div>
					<div class="lv-modal-title">Nuevo Cliente</div>
					<div class="lv-modal-sub">Registra un nuevo cliente en el sistema</div>
				</div>
				<button class="lv-modal-close" aria-label="Cerrar" onclick={() => (showClientModal = false)}>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				</button>
			</div>
			<div class="lv-modal-body">
				<div class="form-grid">
					<div class="lv-field span-2">
						<label for="client-name">Nombre completo</label>
						<input id="client-name" bind:value={$createClientForm.name} placeholder="Nombre del cliente" />
					</div>
					<div class="lv-field">
						<label for="client-doc">Documento</label>
						<input id="client-doc" bind:value={$createClientForm.document} placeholder="CC / NIT" />
					</div>
					<div class="lv-field">
						<label for="client-phone">Teléfono</label>
						<input id="client-phone" bind:value={$createClientForm.phone} placeholder="300-000-0000" />
					</div>
					<div class="lv-field span-2">
						<label for="client-birth">Fecha de nacimiento</label>
						<input id="client-birth" type="date" bind:value={$createClientForm.birthdate} />
					</div>
				</div>
			</div>
			<div class="lv-modal-footer">
				<button class="lv-btn lv-btn-ghost" onclick={() => (showClientModal = false)}>Cancelar</button>
				<form method="POST" action="?/createClient" use:enhanceCreateClient>
					<button type="submit" class="lv-btn lv-btn-primary">Crear Cliente</button>
				</form>
			</div>
		</div>
	</div>
{/if}

<!-- Modal: Nuevo Servicio -->
{#if showServiceModal}
	<div class="lv-modal-overlay" role="presentation" onclick={(e) => e.target === e.currentTarget && (showServiceModal = false)}>
		<div class="lv-modal">
			<div class="lv-modal-header">
				<div>
					<div class="lv-modal-title">Nuevo Servicio de Lavado</div>
					<div class="lv-modal-sub">Registra un nuevo servicio</div>
				</div>
				<button class="lv-modal-close" aria-label="Cerrar" onclick={() => (showServiceModal = false)}>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				</button>
			</div>
			<div class="lv-modal-body">
				<div class="form-grid">
					<div class="lv-field">
						<label for="svc-plate">Placa</label>
						<input id="svc-plate" name="plate" placeholder="Ej: ABC-123" />
					</div>
					<div class="lv-field">
						<label for="svc-service">Servicio</label>
						<input id="svc-service" name="service" placeholder="Ej: Lavado Básico" />
					</div>
					<div class="lv-field">
						<label for="svc-price">Precio</label>
						<input id="svc-price" type="number" name="price" placeholder="0" />
					</div>
					<div class="lv-field">
						<label for="svc-notes">Observaciones</label>
						<input id="svc-notes" name="observations" placeholder="Notas adicionales..." />
					</div>
				</div>
			</div>
			<div class="lv-modal-footer">
				<button class="lv-btn lv-btn-ghost" onclick={() => (showServiceModal = false)}>Cancelar</button>
				<button class="lv-btn lv-btn-primary" onclick={() => (showServiceModal = false)}>Registrar</button>
			</div>
		</div>
	</div>
{/if}
