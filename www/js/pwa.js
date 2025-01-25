/**
 * Checks if the current URL indicates that the app is in PWA mode.
 * If in PWA mode, removes the install element from the DOM.
 */
function PWAmode() {
	const url = new URL(window.location.href);
	const isPWA = url.searchParams.get('home') === 'true';

	console.log('PWA mode:', isPWA);

	if (isPWA) document.getElementById('install').remove();
}

PWAmode();

/**
 * Handles the installation prompt for a Progressive Web App (PWA).
 *
 * This function sets up event listeners to manage the installation prompt
 * for a PWA. It listens for the `beforeinstallprompt` event to capture the
 * install prompt event and shows the install button. When the install button
 * is clicked, it triggers the install prompt and handles the user's response.
 *
 * @function handleInstallPrompt
 */
function handleInstallPrompt() {
	let installPromptEvent;

	var installBTN = document.getElementById('install');

	window.addEventListener('beforeinstallprompt', e => {
		e.preventDefault();
		installPromptEvent = e;
		installBTN.classList.remove('hidden');
	});

	installBTN.addEventListener('click', async e => {
		if (!installPromptEvent) return;

		const { outcome } = await installPromptEvent.prompt();
		console.log(outcome);

		installPromptEvent = null;
		installBTN.classList.add('hidden');
	});
}

handleInstallPrompt();

/**
 * Registers a service worker if the browser supports it.
 * Logs a message to the console indicating whether the registration was successful or failed.
 *
 * @async
 * @function handleServiceWorker
 * @returns {Promise<void>} A promise that resolves when the service worker is registered or fails to register.
 */
async function handleServiceWorker() {
	if ('serviceWorker' in navigator) {
		try {
			await navigator.serviceWorker.register('/www/js/service-worker.js');
			console.log('Service worker registered');
		} catch (error) {
			console.log('Service worker registration failed', error);
		}
	}
}

handleServiceWorker();
