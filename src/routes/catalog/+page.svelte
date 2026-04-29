<script lang="ts">
	type ServiceType = { id: string; name: string; sedan: number; suv: number; moto: number; camioneta: number };

	let services = $state<ServiceType[]>([
		{ id: 's1', name: 'Lavado Básico',       sedan: 15000, suv: 22000, moto: 8000,  camioneta: 25000 },
		{ id: 's2', name: 'Polichado',           sedan: 50000, suv: 65000, moto: 30000, camioneta: 70000 },
		{ id: 's3', name: 'Lavado de Cojinería', sedan: 35000, suv: 45000, moto: 0,     camioneta: 50000 },
		{ id: 's4', name: 'Lavado + Polichado',  sedan: 60000, suv: 80000, moto: 35000, camioneta: 90000 }
	]);

	let showModal = $state(false);
	let form = $state({ name: '', sedan: '', suv: '', moto: '', camioneta: '' });

	const VEHICLE_TYPES = ['sedan', 'suv', 'moto', 'camioneta'] as const;
	const VEHICLE_LABELS: Record<string, string> = { sedan: 'Sedán', suv: 'SUV', moto: 'Moto', camioneta: 'Camioneta' };

	function updatePrice(id: string, type: string, value: string) {
		const idx = services.findIndex((s) => s.id === id);
		if (idx !== -1) services[idx] = { ...services[idx], [type]: parseInt(value) || 0 };
	}

	function handleCreate() {
		if (!form.name) return;
		services.push({
			id: 's' + Date.now(),
			name: form.name,
			sedan: parseInt(form.sedan) || 0,
			suv: parseInt(form.suv) || 0,
			moto: parseInt(form.moto) || 0,
			camioneta: parseInt(form.camioneta) || 0
		});
		showModal = false;
		form = { name: '', sedan: '', suv: '', moto: '', camioneta: '' };
	}

	function fmt(n: number) {
		return '$' + n.toLocaleString('es-CO');
	}
</script>

<div class="lv-card">
	<div class="lv-card-header">
		<div class="lv-card-header-left">
			<div class="lv-card-title">Catálogo de Servicios</div>
			<div class="lv-card-sub">Precios por tipo de vehículo — edita directamente en la tabla</div>
		</div>
		<button class="lv-btn lv-btn-primary" onclick={() => (showModal = true)}>
			<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M12 5v14M5 12h14" />
			</svg>
			Nuevo Servicio
		</button>
	</div>
	<div class="table-wrap">
		<table class="lv-table">
			<thead>
				<tr>
					<th>Servicio</th>
					{#each VEHICLE_TYPES as t}
						<th>{VEHICLE_LABELS[t]}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each services as svc}
					<tr>
						<td style="font-weight:600">{svc.name}</td>
						{#each VEHICLE_TYPES as t}
							<td>
								<div style="display:flex;align-items:center;gap:4px">
									<span style="color:var(--text2);font-size:13px">$</span>
									<input
										class="inline-edit"
										type="number"
										value={svc[t]}
										oninput={(e) => updatePrice(svc.id, t, (e.target as HTMLInputElement).value)}
									/>
								</div>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<div class="card-body-footer">
		Haz clic en cualquier precio para editarlo directamente. Los cambios se guardan al presionar Enter o hacer clic fuera.
	</div>
</div>

{#if showModal}
	<div class="lv-modal-overlay" role="presentation" onclick={(e) => e.target === e.currentTarget && (showModal = false)}>
		<div class="lv-modal">
			<div class="lv-modal-header">
				<div>
					<div class="lv-modal-title">Nuevo Servicio</div>
					<div class="lv-modal-sub">Agrega un servicio al catálogo</div>
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
						<label>Nombre del Servicio</label>
						<input bind:value={form.name} placeholder="Ej: Lavado Exterior" />
					</div>
					{#each VEHICLE_TYPES as t}
						<div class="lv-field">
							<label>Precio {VEHICLE_LABELS[t]}</label>
							<input type="number" bind:value={form[t]} placeholder="0" />
						</div>
					{/each}
				</div>
			</div>
			<div class="lv-modal-footer">
				<button class="lv-btn lv-btn-ghost" onclick={() => (showModal = false)}>Cancelar</button>
				<button class="lv-btn lv-btn-primary" onclick={handleCreate}>Crear Servicio</button>
			</div>
		</div>
	</div>
{/if}
