<script>
	import { goto } from '$app/navigation';
</script>

<button
	class="card bg-base-100 w-96 shadow-sm hover:shadow-2xl cursor-pointer"
	onclick={() => {
		goto('/washing');
	}}
>
	<figure>
		<img
			src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
			alt="Shoes"
		/>
	</figure>
	<div class="card-body">
		<h2 class="card-title">Lavadero</h2>
		<p>Este modulo es el encargado del manejo del lavadero de autos</p>
	</div>
</button>
