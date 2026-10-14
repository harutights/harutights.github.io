document.addEventListener('DOMContentLoaded', () => {
	const wall = document.querySelector('.card');
	if (!wall) return;

	const TOTAL_IMAGES = 868;
	const SELECTION_SIZE = 50;
	const IMAGE_DIR = './images/';

	function shuffle(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const randomValues = new Uint32Array(1);
			let j;

			if (window.crypto?.getRandomValues) {
				const range = 0x100000000;
				const limit = range - (range % (i + 1));

				do {
					crypto.getRandomValues(randomValues);
				} while (randomValues[0] >= limit);

				j = randomValues[0] % (i + 1);
			} else {
				j = Math.floor(Math.random() * (i + 1));
			}

			[array[i], array[j]] = [array[j], array[i]];
		}

		return array;
	}

	const filenames = Array.from({
			length: TOTAL_IMAGES
		},
		(_, index) =>
		`img00${String(index + 1).padStart(3, '0')}.jpg`
	);

	const selection = shuffle(filenames).slice(0, SELECTION_SIZE);

	const fragment = document.createDocumentFragment();

	selection.forEach((filename, index) => {
		const img = document.createElement('img');

		img.src = `${IMAGE_DIR}${filename}`;
		img.loading = index < 8 ? 'eager' : 'lazy';
		img.decoding = 'async';

		img.addEventListener('load', () => {
			if (img.naturalWidth > img.naturalHeight) {
				img.classList.add('landscape');
			}
		}, {
			once: true
		});

		img.addEventListener('error', () => {
			console.warn(`Could not load image: ${filename}`);
			img.remove();
		}, {
			once: true
		});

		fragment.appendChild(img);
	});

	wall.replaceChildren(fragment);
});