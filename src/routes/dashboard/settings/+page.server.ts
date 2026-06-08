import { db } from '$lib/server/db';
import { settings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [row] = await db.select().from(settings).where(eq(settings.id, 1));
	return { settings: row };
};

export const actions: Actions = {
	save: async ({ request }) => {
		const data = await request.formData();
		const businessName = data.get('businessName')?.toString().trim() ?? '';
		const defaultMarkupPercentage = parseFloat(
			data.get('defaultMarkupPercentage')?.toString() || '0'
		);
		const defaultLogisticsReceivingCostPerKg = parseFloat(
			data.get('defaultLogisticsReceivingCostPerKg')?.toString() || '0'
		);
		const defaultGstPercentage = parseFloat(
			data.get('defaultGstPercentage')?.toString() || '18'
		);

		await db
			.update(settings)
			.set({
				businessName,
				defaultMarkupPercentage,
				defaultLogisticsReceivingCostPerKg,
				defaultGstPercentage
			})
			.where(eq(settings.id, 1));

		return { success: true };
	}
};
