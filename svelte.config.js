import adapter from '@sveltejs/adapter-netlify';  // Wechsel zu Netlify-Adapter

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()  // Setze den Netlify-Adapter
	}
};

export default config;
