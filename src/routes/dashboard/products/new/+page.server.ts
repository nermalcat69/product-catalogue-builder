import { db } from '$lib/server/db';
import { product, settings } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [appSettings] = await db.select().from(settings).where(eq(settings.id, 1));
	return { settings: appSettings ?? null };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();

		const name = data.get('name')?.toString().trim();
		const description = data.get('description')?.toString().trim() || null;
		const rawCost = parseFloat(data.get('rawCost')?.toString() || '0');
		const weightG = parseFloat(data.get('weightG')?.toString() || '0');
		const logisticsReceivingCostPerKg = parseFloat(
			data.get('logisticsReceivingCostPerKg')?.toString() || '0'
		);
		const packagingManufacturingCost = parseFloat(
			data.get('packagingManufacturingCost')?.toString() || '0'
		);
		const logisticsDeliveryCost = parseFloat(
			data.get('logisticsDeliveryCost')?.toString() || '0'
		);
		const markupPercentage = parseFloat(data.get('markupPercentage')?.toString() || '0');
		const gstPercentage = parseFloat(data.get('gstPercentage')?.toString() || '18');
		const chargeDeliveryToCustomer = data.get('chargeDeliveryToCustomer') === 'true';
		const chargeGstToCustomer = data.get('chargeGstToCustomer') === 'true';

		if (!name) {
			return fail(400, { error: 'Product name is required' });
		}

		await db.insert(product).values({
			name,
			description,
			rawCost,
			weightG,
			logisticsReceivingCostPerKg,
			packagingManufacturingCost,
			logisticsDeliveryCost,
			markupPercentage,
			gstPercentage,
			chargeDeliveryToCustomer,
			chargeGstToCustomer
		});

		redirect(302, '/dashboard/products');
	}
};
