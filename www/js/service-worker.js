const VERSION = 'V1';

const BASE = location.protocol + '//' + location.host;

const CACHED_FILES = [
	`${BASE}/`,
	`${BASE}/index.html`,
	`${BASE}/offline.html`,
	`${BASE}/www/icons/favicon.ico`,
	'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
];

self.addEventListener('fetch', event => {
	if (event.request.mode == 'navigate') {
		event.respondWith(
			(async () => {
				try {
					const preloadResponse = await event.preloadResponse;
					if (preloadResponse) {
						return preloadResponse;
					}
					return await fetch(event.request);
				} catch (error) {
					console.log('Fetch failed; returning offline page instead.', error);
					const cache = await caches.open(VERSION);
					return await cache.match('offline.html');
				}
			})(),
		);
	} else if (CACHED_FILES.includes(event.request.url)) {
		event.respondWith(caches.match(event.request));
	}
});

self.addEventListener('install', event => {
	self.skipWaiting();
	event.waitUntil(
		(async () => {
			const cache = await caches.open(VERSION);
			await Promise.all(
				CACHED_FILES.map(file => {
					cache.add(new Request(file));
				}),
			);
		})(),
	);
});

self.addEventListener('activate', event => {
	clients.claim();
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
