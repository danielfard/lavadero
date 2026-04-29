<script lang="ts">
	type Item = {
		id: string;
		name: string;
		category: 'limpieza' | 'bateria' | 'perfumeria';
		stock: number;
		price: number;
		unit: string;
		minStock: number;
	};

	let inventory = $state<Item[]>([
		{ id: 'i1', name: 'Shampoo para Auto',    category: 'limpieza',   stock: 12, price: 28000,  unit: 'unidad',  minStock: 5 },
		{ id: 'i2', name: 'Cera Líquida Premium', category: 'limpieza',   stock: 4,  price: 45000,  unit: 'litro',   minStock: 5 },
		{ id: 'i3', name: 'Microfibra x10',       category: 'limpieza',   stock: 8,  price: 35000,  unit: 'paquete', minStock: 3 },
		{ id: 'i4', name: 'Batería 60Ah',         category: 'bateria',    stock: 3,  price: 450000, unit: 'unidad',  minStock: 2 },
		{ id: 'i5', name: 'Batería 90Ah',         category: 'bateria',    stock: 1,  price: 650000, unit: 'unidad',  minStock: 2 },
		{ id: 'i6', name: 'Perfume Lavanda',      category: 'perfumeria', stock: 20, price: 18000,  unit: 'unidad',  minStock: 5 },
		{ id: 'i7', name: 'Perfume Nuevo Car',    category: 'perfumeria', stock: 15, price: 22000,  unit: 'unidad',  minStock: 5 },
		{ id: 'i8', name: 'Aromatizante Gel',     category: 'perfumeria', stock: 3,  price: 12000,  unit: 'unidad',  minStock: 5 }
	]);

	let activeTab = $state('todos');
	let search = $state('');
	let showModal = $state(false);
	let form = $state({ name: '', category: 'limpieza' as Item['category'], stock: '', price: '', unit: 'unidad', minStock: '5' });

	let filtered = $derived(
		inventory.filter((i) => {
			const matchCat = activeTab === 'todos' || i.category === activeTab;
			const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase());
			return matchCat && matchSearch;
		})
	);

	const CAT_MAP: Record<string, { label: string; cls: string }> = {
		limpieza:   { label: 'Limpieza',   cls: 'lv-badge-blue' },
		bateria:    { label: 'Baterías',   cls: 'lv-badge-yellow' },
		perfumeria: { label: 'Perfumería', cls: 'lv-badge-green' }
	};

	const TABS = [
		{ id: 'todos', label: 'Todos' },
		{ id: 'limpieza', label: 'Limpieza' },
		{ id: 'bateria', label: 'Baterías' },
		{ id: 'perfumeria', label: 'Perfumería' }
	];

	function fmt(n: number) {
		return '$' + n.toLocaleString('es-CO');
	}

	function handleAdd() {
		if (!form.name || !form.stock || !form.price) return;
		inventory.push({
			id: 'i' + Date.now(),
			name: form.name,
			category: form.category,
			stock: parseInt(form.stock),
			price: parseInt(form.price),
			unit: form.unit,
			minStock: parseInt(form.minStock)
		});
		showModal = false;
		form = { name: '', category: 'limpieza', stock: '', price: '', unit: 'unidad', minStock: '5' };
	}
</script>

<div class="lv-card">
	<div class="lv-card-header">
		<div class="lv-card-header-left">
			<div class="lv-card-title">Inventario de Productos</div>
			<div class="lv-card-sub">{inventory.length} productos registrados</div>
		</div>
		<button class="lv-btn lv-btn-primary" onclick={() => (showModal = true)}>
			<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M12 5v14M5 12h14" />
			</svg>
			Agregar Producto
		</button>
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
			<input bind:value={search} placeholder="Buscar producto..." />
		</div>
	</div>

	<div class="table-wrap">
		<table class="lv-table">
			<thead>
				<tr>
					<th>Producto</th><th>Categoría</th><th>Stock</th><th>Precio Unitario</th><th>Estado</th>
				</tr>
			</thead>
			<tbody>
				{#if filtered.length === 0}
					<tr><td colspan="5" class="empty-row">No hay productos</td></tr>
				{/if}
				{#each filtered as item}
					{@const low = item.stock <= item.minStock}
					{@const cat = CAT_MAP[item.category] ?? { label: item.category, cls: 'lv-badge-gray' }}
					<tr>
						<td style="font-weight:600">{item.name}</td>
						<td><span class="lv-badge {cat.cls}">{cat.label}</span></td>
						<td>
							<div style="display:flex;align-items:center;gap:8px">
								<span style="font-weight:700;color:{low ? 'var(--danger)' : 'var(--text)'}">{item.stock}</span>
								<span style="font-size:12px;color:var(--text2)">{item.unit}{item.stock !== 1 ? 's' : ''}</span>
							</div>
						</td>
						<td style="font-weight:600">{fmt(item.price)}</td>
						<td>
							{#if low}
								<span class="lv-badge lv-badge-red">
									<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
										<path d="M12 9v4M12 17h.01" />
									</svg>
									Stock bajo
								</span>
							{:else}
								<span class="lv-badge lv-badge-green">Normal</span>
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
					<div class="lv-modal-title">Agregar Producto</div>
					<div class="lv-modal-sub">Registra un nuevo producto al inventario</div>
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
						<label>Nombre del Producto</label>
						<input bind:value={form.name} placeholder="Ej: Shampoo para auto" />
					</div>
					<div class="lv-field">
						<label>Categoría</label>
						<select bind:value={form.category}>
							<option value="limpieza">Limpieza</option>
							<option value="bateria">Baterías</option>
							<option value="perfumeria">Perfumería</option>
						</select>
					</div>
					<div class="lv-field">
						<label>Unidad</label>
						<select bind:value={form.unit}>
							<option>unidad</option><option>litro</option><option>paquete</option><option>caja</option>
						</select>
					</div>
					<div class="lv-field">
						<label>Stock inicial</label>
						<input type="number" bind:value={form.stock} placeholder="0" />
					</div>
					<div class="lv-field">
						<label>Stock mínimo</label>
						<input type="number" bind:value={form.minStock} />
					</div>
					<div class="lv-field span-2">
						<label>Precio de Venta</label>
						<input type="number" bind:value={form.price} placeholder="0" />
					</div>
				</div>
			</div>
			<div class="lv-modal-footer">
				<button class="lv-btn lv-btn-ghost" onclick={() => (showModal = false)}>Cancelar</button>
				<button class="lv-btn lv-btn-primary" onclick={handleAdd}>Agregar</button>
			</div>
		</div>
	</div>
{/if}
