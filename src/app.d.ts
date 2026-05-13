// See https://svelte.dev/docs/kit/types#app.d.ts

import type { FeatureFlags } from './featureToggles';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			flags: FeatureFlags;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
