<script lang="ts">
	export let iconName: string;
	export let label: string;
	export let description: string;
	export let href: string;
</script>

<li class="hover:bg-green-800 hover:text-white hover:font-semibold rounded-2xl">
	<a {href} class="flex gap-3 rounded-2xl">
		<i>{iconName}</i>
		<div>
			<p class="">{label}</p>
			<p class="text-gray-400">{description}</p>
		</div>
	</a>
</li>
