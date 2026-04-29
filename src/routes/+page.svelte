<script lang="ts">
	let { data } = $props();

	type Washing = {
		id: string;
		status: string | null;
		final_price: number | null;
		service: string | null;
		washing_date: string | null;
		employee: string | null;
		vehicles: { plate: string } | null;
		employees: { id: string; name: string } | null;
	};

	type Employee = { id: string; name: string; commission: number | null };

	let washings: Washing[] = $derived(data.washings ?? []);
	let employees: Employee[] = $derived(data.employees ?? []);

	let completados = $derived(washings.filter((w) => w.status === 'completado'));
	let enProceso = $derived(washings.filter((w) => w.status === 'en_proceso'));
	let ingresos = $derived(completados.reduce((s, w) => s + (w.final_price ?? 0), 0));

	function fmt(n: number) {
		return '$' + n.toLocaleString('es-CO');
	}

	function fmtDate(d: string | null) {
		if (!d) return '—';
		return d.length > 10 ? d.slice(11, 16) : d;
	}

	function getEmpWashings(empId: string) {
		return washings.filter((w) => w.employee === empId && w.status === 'completado');
	}

	const STATUS_MAP: Record<string, { label: string; cls: string }> = {
		completado: { label: 'Completado', cls: 'lv-badge-green' },
		en_proceso: { label: 'En Proceso', cls: 'lv-badge-blue' },
		pendiente: { label: 'Pendiente', cls: 'lv-badge-yellow' }
	};

	const INVENTORY_ALERTS = [
		{ name: 'Cera Líquida Premium', category: 'Limpieza', stock: 4, unit: 'litro', min: 5 },
		{ name: 'Batería 90Ah', category: 'Baterías', stock: 1, unit: 'unidad', min: 2 },
		{ name: 'Aromatizante Gel', category: 'Perfumería', stock: 3, unit: 'unidad', min: 5 }
	];

	const today = new Date().toLocaleDateString('es-CO', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
</script>

<div class="stat-grid">
	<div class="stat-card">
		<div class="stat-icon" style="background:rgba(14,165,233,.15)">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M5 17H3v-5l2.5-5h11L19 12v5h-2" /><path d="M7 17h10" />
				<path d="M7 17a2 2 0 100-4 2 2 0 000 4z" /><path d="M17 17a2 2 0 100-4 2 2 0 000 4z" />
			</svg>
		</div>
		<div class="stat-label">Servicios Hoy</div>
		<div class="stat-value">{washings.length}</div>
		<div class="stat-sub">{completados.length} completados</div>
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
		<div class="stat-sub">activos ahora</div>
	</div>
	<div class="stat-card">
		<div class="stat-icon" style="background:rgba(34,197,94,.15)">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M20 6L9 17l-5-5" />
			</svg>
		</div>
		<div class="stat-label">Completados</div>
		<div class="stat-value">{completados.length}</div>
		<div class="stat-sub">
			{washings.length > 0 ? Math.round((completados.length / washings.length) * 100) : 0}% del total
		</div>
	</div>
	<div class="stat-card">
		<div class="stat-icon" style="background:rgba(124,58,237,.15)">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M12 1v22" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
			</svg>
		</div>
		<div class="stat-label">Ingresos Hoy</div>
		<div class="stat-value">{fmt(ingresos)}</div>
		<div class="stat-sub">servicios pagados</div>
	</div>
</div>

<div class="lv-card">
	<div class="lv-card-header">
		<div class="lv-card-header-left">
			<div class="lv-card-title">Servicios del Día</div>
			<div class="lv-card-sub">{today}</div>
		</div>
		<a href="/washing" class="lv-btn lv-btn-primary lv-btn-sm">
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M12 5v14M5 12h14" />
			</svg>
			Nuevo Servicio
		</a>
	</div>
	<div class="table-wrap">
		<table class="lv-table">
			<thead>
				<tr>
					<th>Empleado</th><th>Placa</th><th>Servicio</th><th>Precio</th><th>Estado</th><th>Fecha</th>
				</tr>
			</thead>
			<tbody>
				{#if washings.length === 0}
					<tr><td colspan="6" class="empty-row">No hay servicios registrados hoy</td></tr>
				{/if}
				{#each washings as w}
					{@const s = STATUS_MAP[w.status ?? ''] ?? { label: w.status ?? '—', cls: 'lv-badge-gray' }}
					<tr>
						<td style="font-weight:500">{w.employees?.name ?? '—'}</td>
						<td style="font-weight:600">{w.vehicles?.plate ?? '—'}</td>
						<td class="muted">{w.service ?? '—'}</td>
						<td style="font-weight:700">{fmt(w.final_price ?? 0)}</td>
						<td><span class="lv-badge {s.cls}">{s.label}</span></td>
						<td class="muted">{fmtDate(w.washing_date)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<div class="grid-2col">
	<div class="lv-card">
		<div class="lv-card-header">
			<div class="lv-card-header-left">
				<div class="lv-card-title">Empleados Activos</div>
				<div class="lv-card-sub">Comisiones del día</div>
			</div>
		</div>
		<div class="card-body-plain">
			{#if employees.length === 0}
				<div style="padding:24px;text-align:center;color:var(--text2);font-size:13px">Sin empleados activos</div>
			{/if}
			{#each employees as emp}
				{@const empW = getEmpWashings(emp.id)}
				{@const earned = empW.reduce((s, w) => s + (w.final_price ?? 0), 0)}
				{@const commission = Math.round((earned * (emp.commission ?? 30)) / 100)}
				{@const pct = earned > 0 ? Math.min(100, Math.round((earned / 80000) * 100)) : 0}
				<div class="card-body-row" style="flex-direction:column;align-items:stretch;gap:8px">
					<div style="display:flex;justify-content:space-between">
						<div>
							<div style="font-weight:600;font-size:13px">{emp.name}</div>
							<div style="font-size:11px;color:var(--text2)">
								{empW.length} servicio{empW.length !== 1 ? 's' : ''} · {emp.commission ?? 30}% comisión
							</div>
						</div>
						<div style="text-align:right">
							<div style="font-weight:700;font-size:14px;color:var(--success)">{fmt(commission)}</div>
							<div style="font-size:11px;color:var(--text2)">de {fmt(earned)}</div>
						</div>
					</div>
					<div class="progress-wrap"><div class="progress-bar" style="width:{pct}%"></div></div>
				</div>
			{/each}
		</div>
	</div>

	<div class="lv-card">
		<div class="lv-card-header">
			<div class="lv-card-header-left">
				<div class="lv-card-title">Alertas de Inventario</div>
				<div class="lv-card-sub">Stock bajo</div>
			</div>
		</div>
		<div class="card-body-plain">
			{#each INVENTORY_ALERTS as item}
				<div class="card-body-row">
					<div>
						<div style="font-weight:600;font-size:13px">{item.name}</div>
						<div style="font-size:11px;margin-top:2px">
							<span class="lv-badge lv-badge-blue" style="font-size:10px;padding:2px 7px">{item.category}</span>
						</div>
					</div>
					<div style="text-align:right">
						<div style="font-weight:700;font-size:14px;color:var(--danger)">{item.stock} {item.unit}{item.stock !== 1 ? 's' : ''}</div>
						<div style="font-size:11px;color:var(--text2)">mín. {item.min}</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
