<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	let isOpenCreate = $state(false);
	let isOpenEdit = $state(false);

	const { form: createForm, enhance: enhanceCreate } = superForm(data.createForm, {
		dataType: 'json',
		onResult: () => {
			isOpenCreate = false;
		}
	});

	const { form: updateForm, enhance: enhanceUpdate } = superForm(data.updateForm, {
		dataType: 'json',
		onResult: () => {
			isOpenEdit = false;
		}
	});

	function openEdit(emp: (typeof data.employees)[number]) {
		$updateForm.id = emp.id;
		$updateForm.name = emp.name;
		$updateForm.phone = emp.phone;
		$updateForm.commission = emp.commission ?? 30;
		$updateForm.state = emp.state ?? true;
		isOpenEdit = true;
	}

	type Washing = {
		id: string;
		employee: string | null;
		final_price: number | null;
		status: string | null;
	};

	function getEmpStats(empId: string) {
		const empWashings = data.todayWashings.filter((w: Washing) => w.employee === empId);
		const earned = empWashings.reduce((s: number, w: Washing) => s + (w.final_price ?? 0), 0);
		return { count: empWashings.length, earned };
	}

	function fmt(n: number) {
		return '$' + n.toLocaleString('es-CO');
	}
</script>

<div class="lv-card">
	<div class="lv-card-header">
		<div class="lv-card-header-left">
			<div class="lv-card-title">Empleados</div>
			<div class="lv-card-sub">Gestión de empleados y comisiones</div>
		</div>
		<button class="lv-btn lv-btn-primary" onclick={() => (isOpenCreate = true)}>
			<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M12 5v14M5 12h14" />
			</svg>
			Nuevo Empleado
		</button>
	</div>
	<div class="table-wrap">
		<table class="lv-table">
			<thead>
				<tr>
					<th>Empleado</th>
					<th>Teléfono</th>
					<th>Comisión</th>
					<th>Servicios Hoy</th>
					<th>Ganado Hoy</th>
					<th>A Pagar</th>
					<th>Estado</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each data.employees as emp (emp.id)}
					{@const stats = getEmpStats(emp.id)}
					{@const toPay = Math.round((stats.earned * (emp.commission ?? 30)) / 100)}
					<tr>
						<td>
							<div style="display:flex;align-items:center;gap:10px">
								<div style="width:32px;height:32px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0">
									{emp.name.charAt(0).toUpperCase()}
								</div>
								<span style="font-weight:600">{emp.name}</span>
							</div>
						</td>
						<td class="muted">{emp.phone}</td>
						<td><span style="font-weight:700;color:var(--accent)">{emp.commission ?? 30}%</span></td>
						<td style="font-weight:600">{stats.count}</td>
						<td style="font-weight:600">{fmt(stats.earned)}</td>
						<td style="font-weight:700;color:var(--success)">{fmt(toPay)}</td>
						<td>
							<span class="lv-badge {emp.state ? 'lv-badge-green' : 'lv-badge-gray'}">
								{emp.state ? 'Activo' : 'Inactivo'}
							</span>
						</td>
						<td>
							<button class="lv-btn lv-btn-ghost lv-btn-sm" onclick={() => openEdit(emp)}>Editar</button>
						</td>
					</tr>
				{:else}
					<tr><td colspan="8" class="empty-row">No hay empleados registrados</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<!-- Modal: Crear Empleado -->
{#if isOpenCreate}
	<div class="lv-modal-overlay" role="presentation" onclick={(e) => e.target === e.currentTarget && (isOpenCreate = false)}>
		<div class="lv-modal">
			<div class="lv-modal-header">
				<div>
					<div class="lv-modal-title">Nuevo Empleado</div>
					<div class="lv-modal-sub">Registra un empleado en el sistema</div>
				</div>
				<button class="lv-modal-close" aria-label="Cerrar" onclick={() => (isOpenCreate = false)}>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				</button>
			</div>
			<div class="lv-modal-body">
				<div class="form-grid">
					<div class="lv-field span-2">
						<label for="create-name">Nombre completo</label>
						<input id="create-name" bind:value={$createForm.name} placeholder="Nombre del empleado" />
					</div>
					<div class="lv-field">
						<label for="create-phone">Teléfono</label>
						<input id="create-phone" bind:value={$createForm.phone} placeholder="300-000-0000" />
					</div>
					<div class="lv-field">
						<label for="create-commission">Comisión (%)</label>
						<input id="create-commission" type="number" min="0" max="100" bind:value={$createForm.commission} />
					</div>
					<div class="lv-field span-2" style="flex-direction:row;align-items:center;gap:10px;padding-top:4px">
						<input type="checkbox" bind:checked={$createForm.state} style="width:auto" />
						<span style="font-size:13px;font-weight:500;color:var(--text)">{$createForm.state ? 'Activo' : 'Inactivo'}</span>
					</div>
				</div>
			</div>
			<div class="lv-modal-footer">
				<button class="lv-btn lv-btn-ghost" onclick={() => (isOpenCreate = false)}>Cancelar</button>
				<form method="POST" action="?/create" use:enhanceCreate>
					<button type="submit" class="lv-btn lv-btn-primary">Crear Empleado</button>
				</form>
			</div>
		</div>
	</div>
{/if}

<!-- Modal: Editar Empleado -->
{#if isOpenEdit}
	<div class="lv-modal-overlay" role="presentation" onclick={(e) => e.target === e.currentTarget && (isOpenEdit = false)}>
		<div class="lv-modal">
			<div class="lv-modal-header">
				<div>
					<div class="lv-modal-title">Editar Empleado</div>
					<div class="lv-modal-sub">Modifica los datos del empleado</div>
				</div>
				<button class="lv-modal-close" aria-label="Cerrar" onclick={() => (isOpenEdit = false)}>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				</button>
			</div>
			<div class="lv-modal-body">
				<div class="form-grid">
					<div class="lv-field span-2">
						<label for="edit-name">Nombre completo</label>
						<input id="edit-name" bind:value={$updateForm.name} placeholder="Nombre del empleado" />
					</div>
					<div class="lv-field">
						<label for="edit-phone">Teléfono</label>
						<input id="edit-phone" bind:value={$updateForm.phone} placeholder="300-000-0000" />
					</div>
					<div class="lv-field">
						<label for="edit-commission">Comisión (%)</label>
						<input id="edit-commission" type="number" min="0" max="100" bind:value={$updateForm.commission} />
					</div>
					<div class="lv-field span-2" style="flex-direction:row;align-items:center;gap:10px;padding-top:4px">
						<input type="checkbox" bind:checked={$updateForm.state} style="width:auto" />
						<span style="font-size:13px;font-weight:500;color:var(--text)">{$updateForm.state ? 'Activo' : 'Inactivo'}</span>
					</div>
				</div>
			</div>
			<div class="lv-modal-footer">
				<button class="lv-btn lv-btn-ghost" onclick={() => (isOpenEdit = false)}>Cancelar</button>
				<form method="POST" action="?/update" use:enhanceUpdate>
					<input type="hidden" name="id" bind:value={$updateForm.id} />
					<button type="submit" class="lv-btn lv-btn-primary">Guardar Cambios</button>
				</form>
			</div>
		</div>
	</div>
{/if}
