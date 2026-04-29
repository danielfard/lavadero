<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	onMount(() => {
		const { data: authData } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => authData.subscription.unsubscribe();
	});

	const NAV = [
		{
			href: '/',
			label: 'Dashboard',
			section: 'principal',
			paths: ['M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z', 'M9 22V12h6v10']
		},
		{
			href: '/washing',
			label: 'Servicios de Lavado',
			section: 'principal',
			paths: [
				'M5 17H3v-5l2.5-5h11L19 12v5h-2',
				'M7 17h10',
				'M7 17a2 2 0 100-4 2 2 0 000 4z',
				'M17 17a2 2 0 100-4 2 2 0 000 4z'
			]
		},
		{
			href: '/clients',
			label: 'Clientes',
			section: 'gestion',
			paths: [
				'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2',
				'M9 3a4 4 0 100 8 4 4 0 000-8z',
				'M23 21v-2a4 4 0 00-3-3.87',
				'M16 3.13a4 4 0 010 7.75'
			]
		},
		{
			href: '/employees',
			label: 'Empleados',
			section: 'gestion',
			paths: [
				'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2',
				'M12 3a4 4 0 100 8 4 4 0 000-8z'
			]
		},
		{
			href: '/inventory',
			label: 'Inventario',
			section: 'gestion',
			paths: [
				'M22 12H2',
				'M5 12V5a2 2 0 012-2h10a2 2 0 012 2v7',
				'M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7'
			]
		},
		{
			href: '/catalog',
			label: 'Catálogo de Servicios',
			section: 'gestion',
			paths: [
				'M4 19.5A2.5 2.5 0 016.5 17H20',
				'M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z'
			]
		},
		{
			href: '/closing',
			label: 'Cierre del Día',
			section: 'operaciones',
			paths: ['M12 1v22', 'M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6']
		}
	];

	const SCREEN_TITLES: Record<string, [string, string]> = {
		'/': ['Principal', 'Dashboard'],
		'/washing': ['Lavados', 'Servicios de Lavado'],
		'/clients': ['Gestión', 'Clientes y Vehículos'],
		'/employees': ['Gestión', 'Empleados'],
		'/inventory': ['Gestión', 'Inventario'],
		'/catalog': ['Gestión', 'Catálogo de Servicios'],
		'/closing': ['Operaciones', 'Cierre del Día']
	};

	let currentPath = $derived($page.url.pathname);
	let screenSection = $derived((SCREEN_TITLES[currentPath] ?? ['', currentPath])[0]);
	let screenTitle = $derived((SCREEN_TITLES[currentPath] ?? ['', currentPath])[1]);

	function isActive(href: string): boolean {
		if (href === '/') return currentPath === '/';
		return currentPath.startsWith(href);
	}

	let userInitial = $derived(session?.user?.email?.charAt(0).toUpperCase() ?? 'A');
	let userName = $derived(session?.user?.email?.split('@')[0] ?? 'Admin');

	const today = new Date().toLocaleDateString('es-CO', {
		weekday: 'short',
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
	<link
		href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

{#if session}
	<div class="app">
		<aside class="sidebar">
			<div class="sidebar-logo">
				<h1>🚗 Lavadero</h1>
				<p>Sistema de Gestión</p>
			</div>

			<nav class="sidebar-nav">
				<div class="sidebar-section-label">Principal</div>
				{#each NAV.filter((n) => n.section === 'principal') as n}
					<a href={n.href} class="nav-item" class:active={isActive(n.href)}>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							{#each n.paths as d}
								<path {d} />
							{/each}
						</svg>
						{n.label}
					</a>
				{/each}

				<div class="sidebar-section-label" style="margin-top:12px">Gestión</div>
				{#each NAV.filter((n) => n.section === 'gestion') as n}
					<a href={n.href} class="nav-item" class:active={isActive(n.href)}>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							{#each n.paths as d}
								<path {d} />
							{/each}
						</svg>
						{n.label}
					</a>
				{/each}

				<div class="sidebar-section-label" style="margin-top:12px">Operaciones</div>
				{#each NAV.filter((n) => n.section === 'operaciones') as n}
					<a href={n.href} class="nav-item" class:active={isActive(n.href)}>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							{#each n.paths as d}
								<path {d} />
							{/each}
						</svg>
						{n.label}
					</a>
				{/each}
			</nav>

			<div class="sidebar-footer">
				<div class="user-row">
					<div class="user-avatar-box">{userInitial}</div>
					<div class="user-info">
						<h3>{userName}</h3>
						<p>Propietario</p>
					</div>
				</div>
			</div>
		</aside>

		<div class="main">
			<div class="topbar">
				<div class="topbar-left">
					<div class="topbar-breadcrumb">{screenSection}</div>
					<div class="topbar-title">{screenTitle}</div>
				</div>
				<div class="topbar-actions">{today}</div>
			</div>
			<div class="content">
				{@render children()}
			</div>
		</div>
	</div>
{:else}
	{@render children()}
{/if}
