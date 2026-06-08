<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import type { LayoutData } from './$types';

	let { children, data }: { children: import('svelte').Snippet; data: LayoutData } = $props();

	const navItems = [
		{ href: '/dashboard/products', label: 'Products' },
		{ href: '/dashboard/settings', label: 'Settings' }
	];
</script>

<div class="shell">
	<aside class="sidebar">
		<div class="sidebar-header">
			<span class="logo">Catalogue</span>
		</div>
		<nav>
			{#each navItems as item}
				<a
					href={item.href}
					class="nav-item"
					class:active={$page.url.pathname.startsWith(item.href)}
				>
					{item.label}
				</a>
			{/each}
		</nav>
		<div class="sidebar-footer">
			<div class="user-name">{data.user.name || data.user.email}</div>
			<form method="POST" action="/dashboard?/signOut" use:enhance>
				<button type="submit" class="sign-out">Sign out</button>
			</form>
		</div>
	</aside>

	<main class="content">
		{@render children()}
	</main>
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
		background: #f5f5f5 !important;
		background-image: none !important;
		color: #111;
	}

	.shell {
		display: flex;
		height: 100vh;
		overflow: hidden;
	}

	.sidebar {
		width: 220px;
		flex-shrink: 0;
		background: #18181b;
		color: #e4e4e7;
		display: flex;
		flex-direction: column;
		padding: 0;
	}

	.sidebar-header {
		padding: 20px 18px 16px;
		border-bottom: 1px solid #27272a;
	}

	.logo {
		font-size: 15px;
		font-weight: 600;
		letter-spacing: 0.02em;
		color: #fff;
	}

	nav {
		padding: 8px;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 9px 12px;
		border-radius: 6px;
		font-size: 14px;
		color: #a1a1aa;
		text-decoration: none;
		transition: background 0.1s, color 0.1s;
	}

	.nav-item:hover {
		background: #27272a;
		color: #e4e4e7;
		text-decoration: none;
	}

	.nav-item.active {
		background: #27272a;
		color: #fff;
	}

	.nav-icon {
		font-size: 16px;
		line-height: 1;
	}

	.sidebar-footer {
		margin-top: auto;
		padding: 12px 8px;
		border-top: 1px solid #27272a;
	}

	.user-name {
		font-size: 12px;
		color: #71717a;
		padding: 0 4px;
		margin-bottom: 6px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.sign-out {
		width: 100%;
		padding: 7px 12px;
		background: transparent;
		border: 1px solid #27272a;
		border-radius: 6px;
		font-size: 13px;
		color: #a1a1aa;
		cursor: pointer;
		text-align: left;
		font-family: inherit;
		transition: background 0.1s, color 0.1s;
	}

	.sign-out:hover {
		background: #27272a;
		color: #e4e4e7;
	}

	.content {
		flex: 1;
		overflow-y: auto;
		padding: 32px;
		background: #f9f9f9;
	}
</style>
