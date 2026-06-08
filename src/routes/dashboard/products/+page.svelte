<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function fmt(n: number) {
		return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	}

	function logisticsReceiving(p: (typeof data.products)[number]) {
		return (p.weightG / 1000) * p.logisticsReceivingCostPerKg;
	}

	function productionCost(p: (typeof data.products)[number]) {
		return p.rawCost + logisticsReceiving(p) + p.packagingManufacturingCost;
	}

	function sellingPrice(p: (typeof data.products)[number]) {
		return productionCost(p) * (1 + p.markupPercentage / 100);
	}

	function deliveryCharge(p: (typeof data.products)[number]) {
		return p.chargeDeliveryToCustomer ? p.logisticsDeliveryCost : 0;
	}

	function gstAmount(p: (typeof data.products)[number]) {
		return p.chargeGstToCustomer ? sellingPrice(p) * (p.gstPercentage / 100) : 0;
	}

	function profit(p: (typeof data.products)[number]) {
		return sellingPrice(p) - productionCost(p) - (p.chargeDeliveryToCustomer ? 0 : p.logisticsDeliveryCost);
	}

	function finalPrice(p: (typeof data.products)[number]) {
		return sellingPrice(p) + deliveryCharge(p) + gstAmount(p);
	}
</script>

<div class="page">
	<div class="page-header">
		<h1>Products</h1>
		<a href="/dashboard/products/new" class="btn-new">+ New Product</a>
	</div>

	{#if data.products.length === 0}
		<div class="empty-state">
			<p class="empty-title">No products yet</p>
			<p class="empty-sub">Create your first product to get started.</p>
			<a href="/dashboard/products/new" class="btn-new">+ New Product</a>
		</div>
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
					<div class="product-metrics">
						<div class="metric">
							<span class="metric-label">Cost</span>
							<span class="metric-val">₹{fmt(productionCost(p))}</span>
						</div>
						<div class="metric">
							<span class="metric-label">Sell (ex-GST)</span>
							<span class="metric-val">₹{fmt(sellingPrice(p))}</span>
						</div>
						<div class="metric profit">
							<span class="metric-label">Profit</span>
							<span class="metric-val">₹{fmt(profit(p))}</span>
						</div>
						{#if p.chargeGstToCustomer}
							<div class="metric gst">
								<span class="metric-label">GST</span>
								<span class="metric-val">₹{fmt(gstAmount(p))}</span>
							</div>
							<div class="metric final">
								<span class="metric-label">Final (inc-GST)</span>
								<span class="metric-val">₹{fmt(finalPrice(p))}</span>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.page {
		max-width: 960px;
	}

	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 24px;
	}

	h1 {
		font-size: 22px;
		font-weight: 600;
		color: #111;
	}

	.btn-new {
		padding: 8px 16px;
		background: #18181b;
		color: #fff;
		border-radius: 7px;
		font-size: 13px;
		font-weight: 500;
		text-decoration: none;
		transition: background 0.15s;
	}

	.btn-new:hover {
		background: #27272a;
		text-decoration: none;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 80px 0;
		gap: 8px;
	}

	.empty-title {
		font-size: 15px;
		font-weight: 500;
		color: #374151;
	}

	.empty-sub {
		font-size: 13px;
		color: #9ca3af;
		margin-bottom: 8px;
	}

	.product-list {
		display: flex;
		flex-direction: column;
		gap: 1px;
		background: #e4e4e7;
		border: 1px solid #e4e4e7;
		border-radius: 10px;
		overflow: hidden;
	}

	.product-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 14px 18px;
		background: #fff;
		gap: 16px;
	}

	.product-info {
		display: flex;
		flex-direction: column;
		gap: 3px;
		min-width: 0;
		flex: 1;
	}

	.product-name {
		font-size: 14px;
		font-weight: 500;
		color: #111;
	}

	.product-desc {
		font-size: 12px;
		color: #9ca3af;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.product-metrics {
		display: flex;
		gap: 24px;
		flex-shrink: 0;
	}

	.metric {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 2px;
	}

	.metric-label {
		font-size: 11px;
		color: #9ca3af;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.metric-val {
		font-size: 13px;
		font-weight: 600;
		color: #374151;
	}

	.metric.profit .metric-val {
		color: #a16207;
	}

	.metric.gst .metric-val {
		color: #16a34a;
	}

	.metric.final .metric-val {
		color: #4338ca;
	}
</style>
