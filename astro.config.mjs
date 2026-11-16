// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const base = '/Kinesis-Docs';

/** In dev, sends the server root and the browser's /favicon.ico request to their places under the base path. */
const rootRedirects = {
	name: 'root-redirects',
	configureServer(server) {
		const targets = { '/': `${base}/`, '/favicon.ico': `${base}/favicon.png` };
		server.middlewares.use((req, res, next) => {
			const target = targets[req.url ?? ''];
			if (!target) {
				next();
				return;
			}
			res.statusCode = 302;
			res.setHeader('Location', target);
			res.end();
		});
	},
};

export default defineConfig({
	site: 'https://xaylis.github.io',
	base,
	vite: { plugins: [rootRedirects] },
	integrations: [
		starlight({
			title: 'Kinesis',
			description: 'A data-driven visual effects engine for Minecraft mods.',
			logo: { src: './src/assets/logo.png' },
			favicon: '/favicon.png',
			customCss: ['./src/styles/theme.css'],
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/xaylis/Kinesis' }],
			sidebar: [
				{ label: 'Start here', items: [{ autogenerate: { directory: 'start' } }] },
				{ label: 'Guides', items: [{ autogenerate: { directory: 'guides' } }] },
				{ label: 'API', items: [{ autogenerate: { directory: 'api' } }] },
				{
					label: 'Reference',
					items: [
						{ label: 'Overview', slug: 'reference' },
						{ label: 'Effect file', slug: 'reference/effect' },
						{ label: 'Values', slug: 'reference/values' },
						{ label: 'Attachment', slug: 'reference/attach' },
						{ label: 'Material', slug: 'reference/material' },
						{ label: 'Tracks', items: [{ autogenerate: { directory: 'reference/tracks' } }] },
					],
				},
				{ label: 'Gallery', slug: 'gallery' },
			],
		}),
	],
});
