/**
 * Service Worker script for caching and offline support.
 *
 * @constant {string} VERSION - The version of the cache.
 * @constant {string} BASE - The base URL of the site.
 * @constant {Array<string>} CACHED_FILES - List of files to cache during installation.
 *
 * @event fetch - Intercepts fetch requests to serve cached files or fetch from the network.
 * @param {FetchEvent} event - The fetch event.
 *
 * @event install - Handles the service worker installation and caches specified files.
 * @param {ExtendableEvent} event - The install event.
 *
 * @event activate - Handles the service worker activation and cleans up old caches.
 * @param {ExtendableEvent} event - The activate event.
 */

const VERSION = 'V1';

const BASE = location.protocol + '//' + location.host;

const CACHED_FILES = [
	`${BASE}/`,
	`${BASE}/index.html`,
	`${BASE}/offline.html`,
	`${BASE}/www/icons/favicon.ico`,
	`${BASE}/www/fontawesome/css/all.min.css`,
	`${BASE}/www/js/pwa.js`,
	'https://unpkg.com/tone',
];

self.addEventListener('fetch', event => {
	if (event.request.mode != 'navigate') return;

	event.respondWith(
		(async () => {
			try {
				const cachedResponse = await caches.match(event.request);
				if (cachedResponse) {
					console.log('Serving from cache:', event.request.url);
					return cached;
				}

				console.log('Fetching from network:', event.request.url);
				return await fetch(event.request);
			} catch (error) {
				console.log('Fetch failed; returning offline page instead.', error);
				const cache = await caches.open(VERSION);
				return await cache.match('offline.html');
			}
		})(),
	);
});

self.addEventListener('install', event => {
	self.skipWaiting();
	event.waitUntil(
		(async () => {
			const cache = await caches.open(VERSION);
			try {
				await cache.addAll(CACHED_FILES);
			} catch (error) {
				console.log('Caching failed:', error);
			}
		})(),
	);
});

self.addEventListener('activate', event => {
	self.clients.claim();
	event.waitUntil(
		(async () => {
			const keys = await caches.keys();
			await Promise.all(
				keys.map(key => {
					if (key !== VERSION) {
						return caches.delete(key);
					}
				}),
			);
		})(),
	);
});
