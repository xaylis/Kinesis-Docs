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
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/xaylis/Kinesis' }],
			sidebar: [
				{ label: 'Start here', items: [{ autogenerate: { directory: 'start' } }] },
				{ label: 'Guides', items: [{ autogenerate: { directory: 'guides' } }] },
				{ label: 'Reference', items: [{ autogenerate: { directory: 'reference' } }] },
			],
		}),
	],
});
