<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let businessName = $state(data.settings?.businessName ?? '');
	let defaultMarkupPercentage = $state(data.settings?.defaultMarkupPercentage ?? 0);
	let defaultLogisticsReceivingCostPerKg = $state(
		data.settings?.defaultLogisticsReceivingCostPerKg ?? 0
	);
	let defaultGstPercentage = $state(data.settings?.defaultGstPercentage ?? 18);
</script>

<div class="page">
	<div class="page-header">
		<h1>Settings</h1>
		<p class="subtitle">Configure defaults applied when creating new products.</p>
	</div>

	<div class="settings-layout">
		<form method="POST" action="?/save" use:enhance>
			<section class="card">
				<h2>Business</h2>

				<div class="field">
					<label for="businessName">Business Name</label>
					<input
						id="businessName"
						name="businessName"
						type="text"
						placeholder="e.g. Arjun's Store"
						bind:value={businessName}
					/>
				</div>
			</section>

			<section class="card">
				<h2>Product Defaults</h2>
				<p class="card-desc">
					These values pre-fill the product form so you don't re-enter them each time.
				</p>

				<div class="two-col">
					<div class="field">
						<label for="defaultMarkupPercentage">Default Markup %</label>
						<div class="input-suffix">
							<input
								id="defaultMarkupPercentage"
								name="defaultMarkupPercentage"
								type="number"
								min="0"
								step="0.1"
								bind:value={defaultMarkupPercentage}
							/>
							<span>%</span>
						</div>
					</div>

					<div class="field">
						<label for="defaultGstPercentage">Default GST %</label>
						<div class="input-suffix">
							<input
								id="defaultGstPercentage"
								name="defaultGstPercentage"
								type="number"
								min="0"
								step="0.1"
								bind:value={defaultGstPercentage}
							/>
							<span>%</span>
						</div>
						<p class="field-hint">Common slabs: 0%, 5%, 12%, 18%, 28%</p>
					</div>

					<div class="field">
						<label for="defaultLogisticsReceivingCostPerKg">Logistics Receiving Rate</label>
						<div class="input-prefix">
							<span>₹</span>
							<input
								id="defaultLogisticsReceivingCostPerKg"
								name="defaultLogisticsReceivingCostPerKg"
								type="number"
								min="0"
								step="0.01"
								bind:value={defaultLogisticsReceivingCostPerKg}
							/>
							<span class="suffix-unit">/ kg</span>
						</div>
					</div>
				</div>
			</section>

			<div class="actions">
				{#if form?.success}
					<span class="saved">Saved</span>
				{/if}
				<button type="submit" class="btn-save">Save Settings</button>
			</div>
		</form>
	</div>
</div>

<style>
	.page {
		max-width: 600px;
	}

	.page-header {
		margin-bottom: 28px;
	}

	h1 {
		font-size: 22px;
		font-weight: 600;
		color: #111;
	}

	.subtitle {
		font-size: 13px;
		color: #9ca3af;
		margin-top: 4px;
	}

	.settings-layout {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.card {
		background: #fff;
		border: 1px solid #e4e4e7;
		border-radius: 10px;
		padding: 24px;
	}

	h2 {
		font-size: 14px;
		font-weight: 600;
		color: #111;
		margin-bottom: 16px;
	}

	.card-desc {
		font-size: 13px;
		color: #9ca3af;
		margin-bottom: 18px;
		margin-top: -10px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-bottom: 16px;
	}

	.field:last-child {
		margin-bottom: 0;
	}

	label {
		font-size: 13px;
		font-weight: 500;
		color: #374151;
	}

	input[type='text'],
	input[type='number'] {
		padding: 8px 10px;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 14px;
		color: #111;
		background: #fff;
		outline: none;
		transition: border-color 0.15s;
		width: 100%;
		font-family: inherit;
	}

	input:focus {
		border-color: #6366f1;
		box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
	}

	.input-prefix,
	.input-suffix {
		display: flex;
		align-items: center;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		overflow: hidden;
		transition: border-color 0.15s;
	}

	.input-prefix:focus-within,
	.input-suffix:focus-within {
		border-color: #6366f1;
		box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
	}

	.input-prefix span,
	.input-suffix span {
		padding: 8px 10px;
		background: #f4f4f5;
		color: #6b7280;
		font-size: 13px;
		border-right: 1px solid #d1d5db;
		flex-shrink: 0;
	}

	.input-suffix span {
		border-right: none;
		border-left: 1px solid #d1d5db;
	}

	.suffix-unit {
		white-space: nowrap;
	}

	.input-prefix input,
	.input-suffix input {
		border: none;
		border-radius: 0;
		box-shadow: none;
	}

	.input-prefix input:focus,
	.input-suffix input:focus {
		border: none;
		box-shadow: none;
	}

	.two-col {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0 16px;
	}

	.field-hint {
		font-size: 11px;
		color: #9ca3af;
		margin-top: 4px;
	}

	.actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 12px;
	}

	.saved {
		font-size: 13px;
		color: #16a34a;
		font-weight: 500;
	}

	.btn-save {
		padding: 9px 20px;
		background: #18181b;
		color: #fff;
		border: none;
		border-radius: 7px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.15s;
		font-family: inherit;
	}

	.btn-save:hover {
		background: #27272a;
	}
</style>
