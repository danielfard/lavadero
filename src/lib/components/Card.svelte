<script lang="ts">
	export let title: string = 'Card Title';
	export let description: string = 'Description';
	export let iconName: string = 'icon';
</script>

<div class="card bg-base-100 w-full shadow-xl border-1 border-gray-300">
	<div class="card-body">
		<div class="flex gap-4 items-center">
			<div class="flex flex-col ">
				<h2 class="text-sm text-gray-500">{title}</h2>
				<p class="text-xl text-gray-900 font-bold">
					{description}
				</p>
			</div>
			<div class="">
				{iconName}
			</div>
		</div>
	</div>
</div>
