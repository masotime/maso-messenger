import { resolve } from 'path';

export const BUNDLE_PATHNAME = '/bundle.js';
export const BUNDLE_SOURCE = resolve(process.cwd(), 'src/client/bundle.js');
export const STATIC_PATHNAME = '/static';
export const STATIC_SOURCE = resolve(process.cwd(), 'src/static');
export const SHARED_STATE_NAME = '__MODEL__';
export const PORT = 8000;