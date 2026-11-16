// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://xaylis.github.io',
	base: '/Kinesis-Docs',
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
