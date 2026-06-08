<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let mode = $state<'signin' | 'signup'>('signin');

	$effect(() => {
		if (form?.mode) mode = form.mode as 'signin' | 'signup';
	});
</script>

<div class="shell">
	<div class="card">
		<div class="brand">Catalogue</div>
		<p class="tagline">Product cost & pricing builder</p>

		<div class="tabs">
			<button class="tab" class:active={mode === 'signin'} onclick={() => (mode = 'signin')}>
				Sign in
			</button>
			<button class="tab" class:active={mode === 'signup'} onclick={() => (mode = 'signup')}>
				Create account
			</button>
		</div>

		{#if form?.message}
			<p class="error">{form.message}</p>
		{/if}

		{#if mode === 'signin'}
			<form method="POST" action="?/signIn" use:enhance>
				<div class="field">
					<label for="si-email">Email</label>
					<input id="si-email" name="email" type="email" placeholder="you@example.com" required />
				</div>
				<div class="field">
					<label for="si-password">Password</label>
					<input id="si-password" name="password" type="password" placeholder="••••••••" required />
				</div>
				<button type="submit" class="btn-primary">Sign in</button>
			</form>
			<p class="switch">
				Don't have an account?
				<button class="link" onclick={() => (mode = 'signup')}>Create one</button>
			</p>
		{:else}
			<form method="POST" action="?/signUp" use:enhance>
				<div class="field">
					<label for="su-name">Name</label>
					<input id="su-name" name="name" type="text" placeholder="Your name" required />
				</div>
				<div class="field">
					<label for="su-email">Email</label>
					<input id="su-email" name="email" type="email" placeholder="you@example.com" required />
				</div>
				<div class="field">
					<label for="su-password">Password</label>
					<input id="su-password" name="password" type="password" placeholder="••••••••" required />
				</div>
				<button type="submit" class="btn-primary">Create account</button>
			</form>
			<p class="switch">
				Already have an account?
				<button class="link" onclick={() => (mode = 'signin')}>Sign in</button>
			</p>
		{/if}
	</div>
</div>

<style>
	:global(*, *::before, *::after) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:global(body) {
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		background: #f5f5f5;
		min-height: 100vh;
	}

	.shell {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px;
		background: #f5f5f5;
	}

	.card {
		background: #fff;
		border: 1px solid #e4e4e7;
		border-radius: 12px;
		padding: 36px 32px;
		width: 100%;
		max-width: 400px;
	}

	.brand {
		font-size: 20px;
		font-weight: 700;
		color: #18181b;
		letter-spacing: -0.01em;
	}

	.tagline {
		font-size: 13px;
		color: #9ca3af;
		margin-top: 4px;
		margin-bottom: 28px;
	}

	.tabs {
		display: flex;
		background: #f4f4f5;
		border-radius: 8px;
		padding: 3px;
		margin-bottom: 24px;
		gap: 2px;
	}

	.tab {
		flex: 1;
		padding: 7px 12px;
		border: none;
		border-radius: 6px;
		background: transparent;
		font-size: 13px;
		font-weight: 500;
		color: #6b7280;
		cursor: pointer;
		transition: background 0.15s, color 0.15s;
	}

	.tab.active {
		background: #fff;
		color: #111;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 5px;
		margin-bottom: 14px;
	}

	label {
		font-size: 13px;
		font-weight: 500;
		color: #374151;
	}

	input {
		padding: 9px 11px;
		border: 1px solid #d1d5db;
		border-radius: 7px;
		font-size: 14px;
		color: #111;
		outline: none;
		transition: border-color 0.15s, box-shadow 0.15s;
		font-family: inherit;
	}

	input:focus {
		border-color: #6366f1;
		box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
	}

	.btn-primary {
		width: 100%;
		padding: 10px;
		background: #18181b;
		color: #fff;
		border: none;
		border-radius: 7px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		margin-top: 6px;
		transition: background 0.15s;
		font-family: inherit;
	}

	.btn-primary:hover {
		background: #27272a;
	}

	.error {
		font-size: 13px;
		color: #dc2626;
		background: #fef2f2;
		border: 1px solid #fecaca;
		border-radius: 7px;
		padding: 9px 12px;
		margin-bottom: 16px;
	}

	.switch {
		font-size: 13px;
		color: #9ca3af;
		text-align: center;
		margin-top: 18px;
	}

	.link {
		background: none;
		border: none;
		color: #4338ca;
		font-size: 13px;
		font-weight: 500;
		cursor: pointer;
		padding: 0;
		font-family: inherit;
	}

	.link:hover {
		text-decoration: underline;
	}
</style>
