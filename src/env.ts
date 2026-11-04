import { defineEnvVars } from '@sveltejs/kit/env';

const flag = (value: string | undefined) => value?.toLowerCase() === 'true';

export const variables = defineEnvVars({
	PUBLIC_ENABLE_ANALYTICS: { public: true, schema: flag },
	PUBLIC_ANALYTICS_LINK: { public: true, schema: (value) => value },
	PUBLIC_ANALYTICS_ID: { public: true, schema: (value) => value },
	BADGE_HOSTS: {
		description: 'Comma-separated hostnames to allow badges from, on top of the built-in list',
		schema: (value) =>
			value
				?.split(',')
				.map((host) => host.trim().toLowerCase())
				.filter(Boolean) ?? []
	}
});
