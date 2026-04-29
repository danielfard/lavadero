<script lang="ts">
	let { data } = $props();

	type Washing = {
		id: string;
		status: string | null;
		final_price: number | null;
		service: string | null;
		washing_date: string | null;
		employee: string | null;
		employees: { id: string; name: string; commission: number | null } | null;
		vehicles: { plate: string } | null;
	};

	type Employee = { id: string; name: string; commission: number | null };

	let washings: Washing[] = $derived(data.washings ?? []);
	let employees: Employee[] = $derived(data.employees ?? []);
	let closed = $state(false);

	let completados = $derived(washings.filter((w) => w.status === 'completado'));
	let totalIngresos = $derived(completados.reduce((s, w) => s + (w.final_price ?? 0), 0));

	let empSummary = $derived(
		employees
			.map((emp) => {
				const empW = completados.filter((w) => w.employee === emp.id);
				const earned = empW.reduce((s, w) => s + (w.final_price ?? 0), 0);
				const toPay = Math.round((earned * (emp.commission ?? 30)) / 100);
				return { ...emp, services: empW.length, earned, toPay };
			})
			.filter((e) => e.services > 0)
	);

	let totalComisiones = $derived(empSummary.reduce((s, e) => s + e.toPay, 0));
	let neto = $derived(totalIngresos - totalComisiones);

	function fmt(n: number) {
		return '$' + n.toLocaleString('es-CO');
	}

	function fmtDate(d: string | null) {
		if (!d) return '—';
		return d.length > 10 ? d.slice(11, 16) : d;
	}

	const today = new Date().toLocaleDateString('es-CO', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
</script>

{#if closed}
	<div class="success-screen">
		<div class="success-icon">
			<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M20 6L9 17l-5-5" />
			</svg>
		</div>
		<h2 style="font-size:22px;font-weight:700;color:var(--text);margin-bottom:8px">Día Cerrado</h2>
		<p style="color:var(--text2);font-size:14px">El cierre del {today} fue registrado exitosamente.</p>
		<button class="lv-btn lv-btn-ghost" style="margin-top:20px" onclick={() => (closed = false)}>
			Ver Resumen
		</button>
	</div>
{:else}
	<div class="stat-grid">
		<div class="stat-card">
			<div class="stat-icon" style="background:rgba(14,165,233,.15)">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M5 17H3v-5l2.5-5h11L19 12v5h-2" /><path d="M7 17h10" />
					<path d="M7 17a2 2 0 100-4 2 2 0 000 4z" /><path d="M17 17a2 2 0 100-4 2 2 0 000 4z" />
				</svg>
			</div>
			<div class="stat-label">Total Servicios</div>
			<div class="stat-value">{completados.length}</div>
			<div class="stat-sub">completados hoy</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon" style="background:rgba(34,197,94,.15)">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M12 1v22" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
				</svg>
			</div>
			<div class="stat-label">Ingresos Brutos</div>
			<div class="stat-value">{fmt(totalIngresos)}</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon" style="background:rgba(245,158,11,.15)">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><path d="M9 3a4 4 0 100 8 4 4 0 000-8z" />
				</svg>
			</div>
			<div class="stat-label">Total Comisiones</div>
			<div class="stat-value">{fmt(totalComisiones)}</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon" style="background:rgba(124,58,237,.15)">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M12 1v22" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
				</svg>
			</div>
			<div class="stat-label">Ingreso Neto</div>
			<div class="stat-value">{fmt(neto)}</div>
			<div class="stat-sub">descontadas comisiones</div>
		</div>
	</div>

	<div class="lv-card">
		<div class="lv-card-header">
			<div class="lv-card-header-left">
				<div class="lv-card-title">Pago a Empleados</div>
				<div class="lv-card-sub">Resumen de comisiones del día — {today}</div>
			</div>
		</div>
		<div class="table-wrap">
			<table class="lv-table">
				<thead>
					<tr>
						<th>Empleado</th><th>Servicios</th><th>Total Facturado</th><th>Comisión</th><th>A Pagar</th>
					</tr>
				</thead>
				<tbody>
					{#if empSummary.length === 0}
						<tr><td colspan="5" class="empty-row">No hay servicios completados</td></tr>
					{/if}
					{#each empSummary as emp}
						<tr>
							<td>
								<div style="display:flex;align-items:center;gap:10px">
									<div style="width:32px;height:32px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff">
										{emp.name.charAt(0).toUpperCase()}
									</div>
									<span style="font-weight:600">{emp.name}</span>
								</div>
							</td>
							<td style="font-weight:600">{emp.services}</td>
							<td>{fmt(emp.earned)}</td>
							<td><span style="font-weight:600;color:var(--accent)">{emp.commission ?? 30}%</span></td>
							<td><span style="font-weight:700;font-size:16px;color:var(--success)">{fmt(emp.toPay)}</span></td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<div class="card-footer" style="display:flex;align-items:center;justify-content:space-between">
			<div>
				<div style="font-size:13px;color:var(--text2)">Total a pagar a empleados</div>
				<div style="font-size:22px;font-weight:700;color:var(--text)">{fmt(totalComisiones)}</div>
			</div>
			<button
				class="lv-btn lv-btn-primary"
				style="padding:12px 28px;font-size:14px"
				onclick={() => (closed = true)}
			>
				Confirmar Cierre del Día
			</button>
		</div>
	</div>

	<div class="lv-card">
		<div class="lv-card-header">
			<div class="lv-card-header-left">
				<div class="lv-card-title">Detalle de Servicios Completados</div>
			</div>
		</div>
		<div class="table-wrap">
			<table class="lv-table">
				<thead>
					<tr>
						<th>Empleado</th><th>Placa</th><th>Servicio</th><th>Precio</th><th>Hora</th>
					</tr>
				</thead>
				<tbody>
					{#if completados.length === 0}
						<tr><td colspan="5" class="empty-row">No hay servicios completados hoy</td></tr>
					{/if}
					{#each completados as w}
						<tr>
							<td style="font-weight:500">{w.employees?.name ?? '—'}</td>
							<td style="font-weight:600">{w.vehicles?.plate ?? '—'}</td>
							<td class="muted">{w.service ?? '—'}</td>
							<td style="font-weight:700">{fmt(w.final_price ?? 0)}</td>
							<td class="muted">{fmtDate(w.washing_date)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/if}
