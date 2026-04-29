<script lang="ts">
	export let isOpen: boolean = false;
</script>

<!-- Open the modal using ID.showModal() method -->
<dialog class="modal" open={isOpen}>
	<div class="modal-box">
		<div class="flex justify-between">
			<slot name="header" />
			<button class="h-3"
				onclick={() => {
					isOpen = false;
				}}>x</button
			>
		</div>
		
		<br>
		<slot name="content" />
		<br>
		<slot name="footer" />
	</div>
</dialog>
