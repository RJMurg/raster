import type { Handle } from '@sveltejs/kit/hooks';

export type FeatureFlags = Record<string, never>;

export const featureTogglesHandler: Handle = async ({ event, resolve }) => {
	event.locals.flags = {};

	return resolve(event);
};
