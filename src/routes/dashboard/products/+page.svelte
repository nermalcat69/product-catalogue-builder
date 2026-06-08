<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let name = $state('');
	let description = $state('');
	let rawCost = $state(0);
	let weightG = $state(0);
	let logisticsReceivingCostPerKg = $state(data.settings?.defaultLogisticsReceivingCostPerKg ?? 0);
	let packagingManufacturingCost = $state(0);
	let logisticsDeliveryCost = $state(0);
	let markupPercentage = $state(data.settings?.defaultMarkupPercentage ?? 0);
	let gstPercentage = $state(data.settings?.defaultGstPercentage ?? 18);

	let logisticsReceivingCost = $derived((weightG / 1000) * logisticsReceivingCostPerKg);
	let totalCost = $derived(
		rawCost + logisticsReceivingCost + packagingManufacturingCost + logisticsDeliveryCost
	);
	let sellingPrice = $derived(totalCost * (1 + markupPercentage / 100));
	let gstAmount = $derived(sellingPrice * (gstPercentage / 100));
	let finalPrice = $derived(sellingPrice + gstAmount);

	function fmt(n: number) {
		return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	}

	function productLogisticsReceiving(p: (typeof data.products)[number]) {
		return (p.weightG / 1000) * p.logisticsReceivingCostPerKg;
	}

	function productTotalCost(p: (typeof data.products)[number]) {
		return (
			p.rawCost +
			productLogisticsReceiving(p) +
			p.packagingManufacturingCost +
			p.logisticsDeliveryCost
		);
	}

	function resetForm() {
		name = '';
		description = '';
		rawCost = 0;
		weightG = 0;
		logisticsReceivingCostPerKg = data.settings?.defaultLogisticsReceivingCostPerKg ?? 0;
		packagingManufacturingCost = 0;
		logisticsDeliveryCost = 0;
		markupPercentage = data.settings?.defaultMarkupPercentage ?? 0;
		gstPercentage = data.settings?.defaultGstPercentage ?? 18;
	}

	$effect(() => {
		if (form?.success) resetForm();
	});
</script>

<div class="page">
	<div class="page-header">
		<h1>Products</h1>
	</div>

	<div class="layout">
		<section class="form-card">
			<h2>New Product</h2>

			{#if form?.error}
				<p class="error">{form.error}</p>
			{/if}

			<form method="POST" action="?/create" use:enhance>
				<div class="field">
					<label for="name">Product Name</label>
					<input
						id="name"
						name="name"
						type="text"
						placeholder="e.g. Artisan Candle"
						bind:value={name}
						required
					/>
				</div>

				<div class="field">
					<label for="description">Description</label>
					<textarea
						id="description"
						name="description"
						placeholder="Brief product description..."
						rows="3"
						bind:value={description}
					></textarea>
				</div>

				<div class="section-label">Cost Breakdown</div>

				<div class="cost-fields">
					<div class="field">
						<label for="rawCost">Raw Cost</label>
						<div class="input-prefix">
							<span>₹</span>
							<input
								id="rawCost"
								name="rawCost"
								type="number"
								min="0"
								step="0.01"
								bind:value={rawCost}
							/>
						</div>
					</div>

					<div class="field">
						<label for="packagingManufacturingCost">Packaging / Manufacturing</label>
						<div class="input-prefix">
							<span>₹</span>
							<input
								id="packagingManufacturingCost"
								name="packagingManufacturingCost"
								type="number"
								min="0"
								step="0.01"
								bind:value={packagingManufacturingCost}
							/>
						</div>
					</div>

					<div class="field">
						<label for="logisticsDeliveryCost">Delivery to Customer</label>
						<div class="input-prefix">
							<span>₹</span>
							<input
								id="logisticsDeliveryCost"
								name="logisticsDeliveryCost"
								type="number"
								min="0"
								step="0.01"
								bind:value={logisticsDeliveryCost}
							/>
						</div>
					</div>
				</div>

				<div class="receiving-block">
					<div class="receiving-header">
						<span class="receiving-title">Logistics Receiving</span>
						<span class="receiving-result">₹{fmt(logisticsReceivingCost)}</span>
					</div>
					<div class="receiving-inputs">
						<div class="field">
							<label for="weightG">Product Weight</label>
							<div class="input-suffix">
								<input
									id="weightG"
									name="weightG"
									type="number"
									min="0"
									step="1"
									bind:value={weightG}
								/>
								<span>g</span>
							</div>
						</div>
						<div class="receiving-divider">×</div>
						<div class="field">
							<label for="logisticsReceivingCostPerKg">Rate per kg</label>
							<div class="input-prefix">
								<span>₹</span>
								<input
									id="logisticsReceivingCostPerKg"
									name="logisticsReceivingCostPerKg"
									type="number"
									min="0"
									step="0.01"
									bind:value={logisticsReceivingCostPerKg}
								/>
							</div>
						</div>
					</div>
					<p class="receiving-formula">
						{weightG}g ÷ 1000 × ₹{fmt(logisticsReceivingCostPerKg)}/kg = ₹{fmt(
							logisticsReceivingCost
						)}
					</p>
				</div>

				<div class="totals-row">
					<span class="total-label">Total Cost</span>
					<span class="total-value">₹{fmt(totalCost)}</span>
				</div>

				<div class="section-label">Pricing</div>

				<div class="pricing-row">
					<div class="field">
						<label for="markupPercentage">Markup %</label>
						<div class="input-suffix">
							<input
								id="markupPercentage"
								name="markupPercentage"
								type="number"
								min="0"
								step="0.1"
								bind:value={markupPercentage}
							/>
							<span>%</span>
						</div>
					</div>

					<div class="field">
						<label for="gstPercentage">GST %</label>
						<div class="input-suffix">
							<input
								id="gstPercentage"
								name="gstPercentage"
								type="number"
								min="0"
								step="0.1"
								bind:value={gstPercentage}
							/>
							<span>%</span>
						</div>
					</div>
				</div>

				<div class="price-breakdown">
					<div class="pb-row">
						<span class="pb-label">Selling Price <span class="pb-sub">(ex-GST)</span></span>
						<span class="pb-val">₹{fmt(sellingPrice)}</span>
					</div>
					<div class="pb-row pb-gst">
						<span class="pb-label">GST ({gstPercentage}%)</span>
						<span class="pb-val">+ ₹{fmt(gstAmount)}</span>
					</div>
					<div class="pb-row pb-final">
						<span class="pb-label">Final Price <span class="pb-sub">(inc-GST)</span></span>
						<span class="pb-val-final">₹{fmt(finalPrice)}</span>
					</div>
				</div>

				<button type="submit" class="btn-create">Create Product</button>
			</form>
		</section>

		<section class="list-card">
			<h2>All Products <span class="count">{data.products.length}</span></h2>

			{#if data.products.length === 0}
				<p class="empty">No products yet. Create one to get started.</p>
			{:else}
				<div class="product-list">
					{#each data.products as p}
						<div class="product-row">
							<div class="product-info">
								<span class="product-name">{p.name}</span>
								{#if p.description}
									<span class="product-desc">{p.description}</span>
								{/if}
							</div>
							<div class="product-prices">
								<div class="price-chip cost">Cost ₹{fmt(productTotalCost(p))}</div>
								<div class="price-chip sell">
									Sell ₹{fmt(productTotalCost(p) * (1 + p.markupPercentage / 100))}
								</div>
								<div class="price-chip gst">
									+GST ₹{fmt(
										productTotalCost(p) *
											(1 + p.markupPercentage / 100) *
											(p.gstPercentage / 100)
									)}
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</section>
	</div>
</div>

<style>
	.page {
		max-width: 1100px;
	}

	.page-header {
		margin-bottom: 28px;
	}

	h1 {
		font-size: 22px;
		font-weight: 600;
		color: #111;
	}

	h2 {
		font-size: 15px;
		font-weight: 600;
		color: #111;
		margin-bottom: 20px;
	}

	.layout {
		display: grid;
		grid-template-columns: 440px 1fr;
		gap: 24px;
		align-items: start;
	}

	.form-card,
	.list-card {
		background: #fff;
		border: 1px solid #e4e4e7;
		border-radius: 10px;
		padding: 24px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-bottom: 16px;
	}

	label {
		font-size: 13px;
		font-weight: 500;
		color: #374151;
	}

	input[type='text'],
	input[type='number'],
	textarea {
		padding: 8px 10px;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 14px;
		color: #111;
		background: #fff;
		outline: none;
		transition: border-color 0.15s;
		width: 100%;
	}

	input:focus,
	textarea:focus {
		border-color: #6366f1;
		box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
	}

	textarea {
		resize: vertical;
		font-family: inherit;
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

	.section-label {
		font-size: 11px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #9ca3af;
		margin-bottom: 12px;
		margin-top: 4px;
	}

	.cost-fields {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 0 14px;
	}

	.receiving-block {
		background: #f9f9fb;
		border: 1px solid #e4e4e7;
		border-radius: 8px;
		padding: 14px;
		margin-bottom: 16px;
	}

	.receiving-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
	}

	.receiving-title {
		font-size: 13px;
		font-weight: 500;
		color: #374151;
	}

	.receiving-result {
		font-size: 14px;
		font-weight: 600;
		color: #111;
	}

	.receiving-inputs {
		display: flex;
		align-items: flex-end;
		gap: 8px;
	}

	.receiving-inputs .field {
		flex: 1;
		margin-bottom: 0;
	}

	.receiving-divider {
		font-size: 18px;
		color: #9ca3af;
		padding-bottom: 9px;
		flex-shrink: 0;
	}

	.receiving-formula {
		font-size: 11px;
		color: #9ca3af;
		margin-top: 8px;
		font-variant-numeric: tabular-nums;
	}

	.totals-row {
		background: #f4f4f5;
		border-radius: 7px;
		padding: 12px 14px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20px;
	}

	.total-label {
		font-size: 13px;
		color: #6b7280;
	}

	.total-value {
		font-size: 15px;
		font-weight: 600;
		color: #111;
	}

	.pricing-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0 16px;
	}

	.price-breakdown {
		background: #f9f9fb;
		border: 1px solid #e4e4e7;
		border-radius: 8px;
		overflow: hidden;
		margin-bottom: 20px;
		margin-top: 4px;
	}

	.pb-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 14px;
		font-size: 13px;
		border-bottom: 1px solid #f0f0f0;
	}

	.pb-row:last-child {
		border-bottom: none;
	}

	.pb-gst {
		color: #6b7280;
	}

	.pb-final {
		background: #eef2ff;
	}

	.pb-label {
		color: #374151;
		font-weight: 500;
	}

	.pb-sub {
		font-size: 11px;
		font-weight: 400;
		color: #9ca3af;
	}

	.pb-val {
		font-size: 13px;
		font-weight: 600;
		color: #111;
	}

	.pb-val-final {
		font-size: 16px;
		font-weight: 700;
		color: #4338ca;
	}

	.btn-create {
		width: 100%;
		padding: 10px;
		background: #18181b;
		color: #fff;
		border: none;
		border-radius: 7px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.15s;
	}

	.btn-create:hover {
		background: #27272a;
	}

	.error {
		color: #dc2626;
		font-size: 13px;
		margin-bottom: 12px;
		padding: 8px 10px;
		background: #fef2f2;
		border-radius: 6px;
	}

	.count {
		font-size: 12px;
		font-weight: 500;
		color: #9ca3af;
		background: #f4f4f5;
		border-radius: 20px;
		padding: 2px 8px;
		margin-left: 6px;
	}

	.empty {
		font-size: 14px;
		color: #9ca3af;
		text-align: center;
		padding: 32px 0;
	}

	.product-list {
		display: flex;
		flex-direction: column;
		gap: 1px;
		background: #f4f4f5;
		border-radius: 8px;
		overflow: hidden;
	}

	.product-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 14px;
		background: #fff;
		gap: 12px;
	}

	.product-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.product-name {
		font-size: 14px;
		font-weight: 500;
		color: #111;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.product-desc {
		font-size: 12px;
		color: #9ca3af;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.product-prices {
		display: flex;
		gap: 6px;
		flex-shrink: 0;
	}

	.price-chip {
		font-size: 12px;
		font-weight: 500;
		padding: 3px 9px;
		border-radius: 20px;
	}

	.price-chip.cost {
		background: #f4f4f5;
		color: #6b7280;
	}

	.price-chip.sell {
		background: #eef2ff;
		color: #4338ca;
	}

	.price-chip.gst {
		background: #f0fdf4;
		color: #16a34a;
	}
</style>
