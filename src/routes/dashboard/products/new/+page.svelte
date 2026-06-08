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
	let chargeDeliveryToCustomer = $state(false);
	let markupPercentage = $state(data.settings?.defaultMarkupPercentage ?? 0);
	let gstPercentage = $state(data.settings?.defaultGstPercentage ?? 18);
	let chargeGstToCustomer = $state(true);

	let logisticsReceivingCost = $derived((weightG / 1000) * logisticsReceivingCostPerKg);

	// Delivery is always separate — markup never applies to it
	let productionCost = $derived(rawCost + logisticsReceivingCost + packagingManufacturingCost);
	let sellingPrice = $derived(productionCost * (1 + markupPercentage / 100));
	let deliveryCharge = $derived(chargeDeliveryToCustomer ? logisticsDeliveryCost : 0);
	let gstAmount = $derived(chargeGstToCustomer ? sellingPrice * (gstPercentage / 100) : 0);
	let finalPrice = $derived(sellingPrice + deliveryCharge + gstAmount);
	// When not charging customer, delivery comes out of your pocket — reduces profit
	let profit = $derived(sellingPrice - productionCost - (chargeDeliveryToCustomer ? 0 : logisticsDeliveryCost));
	let profitMargin = $derived(sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0);

	function fmt(n: number) {
		return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	}

	let summarySubLabel = $derived(chargeGstToCustomer ? '(ex-GST)' : '');
</script>

<div class="page">
	<div class="page-header">
		<a href="/dashboard/products" class="back">← Products</a>
		<h1>New Product</h1>
	</div>

	<form method="POST" action="?/create" use:enhance>
		<div class="layout">
			<div class="form-col">
				{#if form?.error}
					<p class="error">{form.error}</p>
				{/if}

				<section class="card">
					<h2>Details</h2>
					<div class="field">
						<label for="name">Product Name</label>
						<input id="name" name="name" type="text" placeholder="e.g. Artisan Candle" bind:value={name} required />
					</div>
					<div class="field mb0">
						<label for="description">Description</label>
						<textarea id="description" name="description" placeholder="Brief product description..." rows="3" bind:value={description}></textarea>
					</div>
				</section>

				<section class="card">
					<h2>Cost Breakdown</h2>
					<div class="two-col">
						<div class="field">
							<label for="rawCost">Raw Cost</label>
							<div class="input-prefix">
								<span>₹</span>
								<input id="rawCost" name="rawCost" type="number" min="0" step="0.01" bind:value={rawCost} />
							</div>
						</div>
						<div class="field">
							<label for="packagingManufacturingCost">Packaging / Mfg</label>
							<div class="input-prefix">
								<span>₹</span>
								<input id="packagingManufacturingCost" name="packagingManufacturingCost" type="number" min="0" step="0.01" bind:value={packagingManufacturingCost} />
							</div>
						</div>
					</div>

					<div class="receiving-block">
						<div class="receiving-header">
							<span class="receiving-title">Logistics Receiving</span>
							<span class="receiving-result">₹{fmt(logisticsReceivingCost)}</span>
						</div>
						<div class="receiving-inputs">
							<div class="field mb0">
								<label for="weightG">Product Weight</label>
								<div class="input-suffix">
									<input id="weightG" name="weightG" type="number" min="0" step="1" bind:value={weightG} />
									<span>g</span>
								</div>
							</div>
							<div class="receiving-divider">×</div>
							<div class="field mb0">
								<label for="logisticsReceivingCostPerKg">Rate per kg</label>
								<div class="input-prefix">
									<span>₹</span>
									<input id="logisticsReceivingCostPerKg" name="logisticsReceivingCostPerKg" type="number" min="0" step="0.01" bind:value={logisticsReceivingCostPerKg} />
								</div>
							</div>
						</div>
						<p class="receiving-formula">
							{weightG}g ÷ 1000 × ₹{fmt(logisticsReceivingCostPerKg)}/kg = ₹{fmt(logisticsReceivingCost)}
						</p>
					</div>

					<div class="total-cost-row">
						<span class="tc-label">Production Cost</span>
						<span class="tc-val">₹{fmt(productionCost)}</span>
					</div>
				</section>

				<section class="card">
					<h2>Delivery</h2>
					<div class="field" style="max-width: 180px">
						<label for="logisticsDeliveryCost">Delivery Cost</label>
						<div class="input-prefix">
							<span>₹</span>
							<input id="logisticsDeliveryCost" name="logisticsDeliveryCost" type="number" min="0" step="0.01" bind:value={logisticsDeliveryCost} />
						</div>
					</div>

					<div class="toggle-row">
						<label class="toggle-label" for="chargeDeliveryToggle">
							<input
								id="chargeDeliveryToggle"
								type="checkbox"
								bind:checked={chargeDeliveryToCustomer}
							/>
							Charge delivery to customer
						</label>
						{#if chargeDeliveryToCustomer}
							<p class="toggle-hint">Added as a separate line on top of selling price</p>
						{:else}
							<p class="toggle-hint">Delivery folded into production cost</p>
						{/if}
					</div>

					<input type="hidden" name="chargeDeliveryToCustomer" value={chargeDeliveryToCustomer} />
				</section>

				<section class="card">
					<h2>Pricing</h2>
					<div class="field" style="max-width: 180px">
						<label for="markupPercentage">Markup %</label>
						<div class="input-suffix">
							<input id="markupPercentage" name="markupPercentage" type="number" min="0" step="0.1" bind:value={markupPercentage} />
							<span>%</span>
						</div>
					</div>
					<div class="toggle-row">
						<label class="toggle-label" for="chargeGstToggle">
							<input id="chargeGstToggle" type="checkbox" bind:checked={chargeGstToCustomer} />
							Charge GST to customer
						</label>
						{#if chargeGstToCustomer}
							<div class="input-suffix rate-input">
								<input name="gstPercentage" type="number" min="0" step="0.1" bind:value={gstPercentage} />
								<span>%</span>
							</div>
						{:else}
							<input type="hidden" name="gstPercentage" value={gstPercentage} />
						{/if}
					</div>
					<input type="hidden" name="chargeGstToCustomer" value={chargeGstToCustomer} />
				</section>
			</div>

			<!-- Right: pricing summary panel -->
			<div class="summary-col">
				<div class="summary-card">
					<h2>Price Summary</h2>

					<div class="summary-item">
						<span class="s-label">Selling Price <span class="s-sub">{summarySubLabel}</span></span>
						<span class="s-val">₹{fmt(sellingPrice)}</span>
					</div>

					{#if chargeDeliveryToCustomer}
						<div class="summary-divider"></div>
						<div class="summary-item s-delivery">
							<span class="s-label">Delivery</span>
							<span class="s-val">+ ₹{fmt(deliveryCharge)}</span>
						</div>
					{/if}

					{#if chargeGstToCustomer}
						<div class="summary-divider"></div>
						<div class="summary-item s-gst">
							<span class="s-label">GST ({gstPercentage}%)</span>
							<span class="s-val">+ ₹{fmt(gstAmount)}</span>
						</div>
					{/if}

					{#if chargeDeliveryToCustomer || chargeGstToCustomer}
						<div class="summary-divider"></div>
						<div class="summary-item s-final">
							<span class="s-label">Final Price</span>
							<span class="s-val-final">₹{fmt(finalPrice)}</span>
						</div>
					{/if}

					{#if !chargeDeliveryToCustomer && logisticsDeliveryCost > 0}
						<div class="summary-divider"></div>
						<div class="summary-item s-delivery-bearer">
							<span class="s-label">Delivery <span class="s-sub">(you bear)</span></span>
							<span class="s-val-bearer">− ₹{fmt(logisticsDeliveryCost)}</span>
						</div>
					{/if}

					<div class="summary-divider"></div>

					<div class="summary-item s-profit">
						<span class="s-label">Profit</span>
						<div class="s-profit-vals">
							<span class="s-val-profit">₹{fmt(profit)}</span>
							<span class="s-margin">({profitMargin.toFixed(1)}% margin)</span>
						</div>
					</div>

					<button type="submit" class="btn-create">Create Product</button>
				</div>
			</div>
		</div>
	</form>
</div>

<style>
	.page { max-width: 1000px; }

	.page-header { margin-bottom: 24px; }

	.back {
		font-size: 13px;
		color: #9ca3af;
		text-decoration: none;
		display: inline-block;
		margin-bottom: 8px;
		transition: color 0.1s;
	}
	.back:hover { color: #374151; text-decoration: none; }

	h1 { font-size: 22px; font-weight: 600; color: #111; }

	h2 {
		font-size: 13px;
		font-weight: 600;
		color: #6b7280;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		margin-bottom: 16px;
	}

	.layout {
		display: grid;
		grid-template-columns: 1fr 280px;
		gap: 20px;
		align-items: start;
	}

	.form-col { display: flex; flex-direction: column; gap: 16px; }

	.card {
		background: #fff;
		border: 1px solid #e4e4e7;
		border-radius: 10px;
		padding: 20px;
	}

	.field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
	.mb0 { margin-bottom: 0; }

	label { font-size: 13px; font-weight: 500; color: #374151; }

	input[type='text'], input[type='number'], textarea {
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
	input:focus, textarea:focus {
		border-color: #6366f1;
		box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
	}
	textarea { resize: vertical; font-family: inherit; }

	.input-prefix, .input-suffix {
		display: flex;
		align-items: center;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		overflow: hidden;
		transition: border-color 0.15s;
	}
	.input-prefix:focus-within, .input-suffix:focus-within {
		border-color: #6366f1;
		box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
	}
	.input-prefix span, .input-suffix span {
		padding: 8px 10px;
		background: #f4f4f5;
		color: #6b7280;
		font-size: 13px;
		border-right: 1px solid #d1d5db;
		flex-shrink: 0;
	}
	.input-suffix span { border-right: none; border-left: 1px solid #d1d5db; }
	.input-prefix input, .input-suffix input { border: none; border-radius: 0; box-shadow: none; }
	.input-prefix input:focus, .input-suffix input:focus { border: none; box-shadow: none; }

	.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 0 14px; }

	.toggle-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

	.toggle-label {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 13px;
		font-weight: 500;
		color: #374151;
		cursor: pointer;
		user-select: none;
	}
	.toggle-label input[type='checkbox'] {
		width: 15px;
		height: 15px;
		accent-color: #6366f1;
		cursor: pointer;
		flex-shrink: 0;
	}

	.toggle-hint {
		font-size: 11px;
		color: #9ca3af;
		width: 100%;
		margin-top: 4px;
	}

	.rate-input { width: 100px; flex-shrink: 0; }

	.receiving-block {
		background: #f9f9fb;
		border: 1px solid #e4e4e7;
		border-radius: 8px;
		padding: 14px;
		margin-bottom: 14px;
	}
	.receiving-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
	.receiving-title { font-size: 13px; font-weight: 500; color: #374151; }
	.receiving-result { font-size: 14px; font-weight: 600; color: #111; }
	.receiving-inputs { display: flex; align-items: flex-end; gap: 8px; }
	.receiving-inputs .field { flex: 1; }
	.receiving-divider { font-size: 18px; color: #9ca3af; padding-bottom: 9px; flex-shrink: 0; }
	.receiving-formula { font-size: 11px; color: #9ca3af; margin-top: 8px; }

	.total-cost-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #f4f4f5;
		border-radius: 7px;
		padding: 10px 14px;
	}
	.tc-label { font-size: 13px; color: #6b7280; }
	.tc-val { font-size: 14px; font-weight: 600; color: #111; }

	/* Summary panel */
	.summary-col { position: sticky; top: 24px; }

	.summary-card {
		background: #fff;
		border: 1px solid #e4e4e7;
		border-radius: 10px;
		padding: 20px;
	}

	.summary-item { padding: 12px 0; }
	.summary-divider { height: 1px; background: #f0f0f0; }

	.s-label { display: block; font-size: 12px; font-weight: 500; color: #6b7280; margin-bottom: 4px; }
	.s-sub { font-size: 11px; font-weight: 400; color: #9ca3af; }
	.s-val { font-size: 16px; font-weight: 600; color: #111; }

	.s-delivery .s-label, .s-gst .s-label { color: #9ca3af; }
	.s-delivery .s-val, .s-gst .s-val { font-size: 14px; color: #6b7280; }

	.s-delivery-bearer .s-label { color: #9ca3af; }
	.s-val-bearer { font-size: 14px; font-weight: 600; color: #dc2626; }

	.s-final .s-val-final { font-size: 22px; font-weight: 700; color: #4338ca; }

	.s-profit-vals { display: flex; flex-direction: column; gap: 2px; }
	.s-val-profit { font-size: 16px; font-weight: 700; color: #a16207; }
	.s-margin { font-size: 12px; color: #ca8a04; }

	.btn-create {
		width: 100%;
		margin-top: 20px;
		padding: 11px;
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
	.btn-create:hover { background: #27272a; }

	.error {
		color: #dc2626;
		font-size: 13px;
		padding: 9px 12px;
		background: #fef2f2;
		border: 1px solid #fecaca;
		border-radius: 7px;
	}
</style>
