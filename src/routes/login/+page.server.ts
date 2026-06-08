import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth/api';

export const load: PageServerLoad = (event) => {
	if (event.locals.user) {
		redirect(302, '/dashboard');
	}
	return {};
};

export const actions: Actions = {
	signIn: async (event) => {
		const data = await event.request.formData();
		const email = data.get('email')?.toString() ?? '';
		const password = data.get('password')?.toString() ?? '';

		try {
			await auth.api.signInEmail({ body: { email, password } });
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { mode: 'signin', message: error.message || 'Sign in failed' });
			}
			return fail(500, { mode: 'signin', message: 'Unexpected error' });
		}

		redirect(302, '/dashboard');
	},

	signUp: async (event) => {
		const data = await event.request.formData();
		const email = data.get('email')?.toString() ?? '';
		const password = data.get('password')?.toString() ?? '';
		const name = data.get('name')?.toString() ?? '';

		try {
			await auth.api.signUpEmail({ body: { email, password, name } });
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { mode: 'signup', message: error.message || 'Sign up failed' });
			}
			return fail(500, { mode: 'signup', message: 'Unexpected error' });
		}

		redirect(302, '/dashboard');
	}
};
