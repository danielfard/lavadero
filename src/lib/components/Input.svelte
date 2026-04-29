<script lang="ts">
	export let label: string;
	export let placeholder: string;
	export let type: 'text' | 'number' | 'date' = 'text';
	export let value: string | number | Date | null = null;
</script>

<div class="flex flex-col w-full">
	<h1 class="text-xs font-semibold">{label}</h1>
	<input {type} {placeholder} class="input w-full" bind:value />
</div>
