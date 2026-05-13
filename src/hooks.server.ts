import { sequence } from '@sveltejs/kit/hooks';
import { featureTogglesHandler } from './featureToggles';

export const handle = sequence(featureTogglesHandler);
