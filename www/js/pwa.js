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
