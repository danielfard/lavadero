<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	let { data } = $props();

	const { form: loginForm, enhance } = superForm(data.loginForm, { dataType: 'json' });
</script>

<div class="hero">
	<div class="hero-content flex-col lg:flex-row-reverse">
		<div class="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
			<div class="card-body">
				<fieldset class="fieldset">
					<label class="label">Email</label>
					<input type="email" class="input" placeholder="Email" bind:value={$loginForm.email} />
					<label class="label">Password</label>
					<input
						type="password"
						class="input"
						placeholder="Password"
						bind:value={$loginForm.password}
					/>
					<form method="post" action="?/login" use:enhance>
						<button class="btn btn-neutral mt-4">Login</button>
					</form>
				</fieldset>
			</div>
		</div>
	</div>
</div>
