import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

export interface FeatureFlags {}

const isEnabled = (value: string | undefined): boolean => value?.toLowerCase() === 'true';

export const featureTogglesHandler: Handle = async ({ event, resolve }) => {
	event.locals.flags = {};

	return resolve(event);
};
