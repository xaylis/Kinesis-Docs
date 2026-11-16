// Builds the effect format reference from the schema Kinesis generates from its own parser.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE = '/Kinesis-Docs';
const schema = JSON.parse(readFileSync('schema/effect.schema.json', 'utf8'));
const defs = schema.definitions;
const out = join('src', 'content', 'docs', 'reference');
rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'tracks'), { recursive: true });

const valueLinks = {
	number: 'values/#numbers',
	curve: 'values/#curves',
	vector: 'values/#vectors',
	color: 'values/#colours',
	easing: 'values/#easings',
	attach: 'attach/',
	material: 'material/',
	params: 'effect/#params',
	param_overrides: 'values/#numbers',
	uniforms: 'material/#uniforms',
	bones: 'attach/#bones',
	burst: 'tracks/particles/#emitter',
	points: 'tracks/tendrils/',
};

const pageOf = {};
const tracks = Object.keys(defs).filter((k) => k.startsWith('track_'));
for (const t of tracks) pageOf[t] = `tracks/${t.slice(6)}/`;
for (const k of ['emitter', 'particle', 'particle_spawn']) pageOf[k] = 'tracks/particles/';
for (const k of Object.keys(defs).filter((k) => k.startsWith('shape_') || k.startsWith('force_'))) pageOf[k] = 'tracks/particles/';
for (const k of ['model_mask', 'model_layer', 'model_edge', 'model_afterimages']) pageOf[k] = 'tracks/model/';
for (const k of ['material_object', 'material_noise', 'material_dissolve', 'material_fresnel']) pageOf[k] = 'material/';
pageOf.effect = 'effect/';
pageOf.event = 'effect/';
pageOf.attach_object = 'attach/';

const link = (name) => {
	const path = valueLinks[name] ?? (pageOf[name] ? `${pageOf[name]}#${anchor(name)}` : null);
	return path ? `[${label(name)}](${BASE}/reference/${path})` : label(name);
};
const anchor = (name) => label(name).toLowerCase().replace(/[^a-z0-9]+/g, '-');
const label = (name) => name.replace(/^track_|^shape_|^force_|^material_|^model_/, '').replace(/_/g, ' ');
const refName = (r) => r.replace('#/definitions/', '');

function type(p) {
	if (p.$ref) return link(refName(p.$ref));
	if (p.enum) return p.enum.map((v) => `\`${JSON.stringify(v)}\``).join(' | ');
	if (p.oneOf) return p.oneOf.map(type).join(' or ');
	if (p.type === 'array' && p.items) {
		if (p.items.oneOf) return 'list of ' + p.items.oneOf.map(type).join(', ');
		return 'list of ' + type(p.items);
	}
	return p.type ?? 'any';
}

const esc = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');

function table(def) {
	const rows = Object.entries(def.properties ?? {}).filter(([k]) => k !== '$schema');
	if (!rows.length) return '_No fields besides `type`._\n';
	let s = '| Field | Type | Default | Description |\n|---|---|---|---|\n';
	for (const [key, p] of rows) {
		const req = (def.required ?? []).includes(key);
		const dflt = req ? '**required**' : p.default !== undefined ? `\`${esc(JSON.stringify(p.default))}\`` : '';
		s += `| \`${key}\` | ${esc(type(p))} | ${dflt} | ${esc(p.description)} |\n`;
	}
	return s;
}

function section(name, level = 2) {
	const def = defs[name];
	return `${'#'.repeat(level)} ${label(name)}\n\n${def.description ?? ''}\n\n${table(def)}\n`;
}

function page(file, title, description, body) {
	writeFileSync(join(out, file), `---\ntitle: ${title}\ndescription: ${description}\n---\n\n<!-- Generated from the Kinesis schema by scripts/gen-reference.mjs. Do not edit. -->\n\n${body}`);
}

page('effect.md', 'Effect file', 'The top level of an effect file.',
	'Effect files live at `assets/<namespace>/kinesis/effects/<path>.json` and are played by the id `<namespace>:<path>`.\n\n' +
	section('effect') +
	'### params\n\nAn object of param names to defaults. Numbers and booleans are numbers; strings are colours such as `"#ff3b1f"`. ' +
	'Expressions read params by name, and colour fields read them as `"$name"`. `EffectBuilder.param(...)`, `/kinesis play ... name=value` and ' +
	'`EffectHandle.set(...)` change them.\n\n' + section('event'));

page('attach.md', 'Attachment', 'Where a track, event or shape point sits.',
	'Anywhere an attachment is expected you can write `"self"`, `"target"` or an object.\n\n' + section('attach_object') +
	'## Bones\n\nBone names come from the model. Vanilla and anything baked from layer definitions use the part names, such as ' +
	'`head`, `body`, `right_arm` and `left_leg`. GeckoLib models use their bone names. Add `:tip` for the far end of the part or `:center` for its middle, ' +
	'for example `right_arm:tip` for a hand. A list is tried in order, so `["chest", "body:center"]` works across models.\n');

page('material.md', 'Material', 'How geometry is shaded.',
	'Materials can be written inline on a track or saved as assets in `assets/<namespace>/kinesis/materials/<path>.json` and referenced by id.\n\n' +
	section('material_object') + section('material_noise') + section('material_dissolve') + section('material_fresnel') +
	'## Uniforms\n\nWith a custom `shader`, Kinesis fills the same uniforms as its own effect program (`Tint`, `MatParams`, `Frames`, `NoiseA`, `NoiseB`, ' +
	'`DissolveA`, `DissolveColor`, `FresnelA`, `FresnelColor`, `GradientMode`, `Depth`) plus any named under `uniforms`.\n');

const trackDocs = {
	particles: ['emitter', 'particle', 'particle_spawn'],
	model: ['model_mask', 'model_layer', 'model_edge', 'model_afterimages'],
};
for (const t of tracks) {
	const name = t.slice(6);
	let body = `${defs[t].description}\n\n` + table(defs[t]) + '\n';
	for (const part of trackDocs[name] ?? []) body += section(part);
	if (name === 'particles') {
		body += '## Spawn shapes\n\n';
		for (const k of Object.keys(defs).filter((k) => k.startsWith('shape_'))) body += section(k, 3);
		body += '## Forces\n\n';
		for (const k of Object.keys(defs).filter((k) => k.startsWith('force_'))) body += section(k, 3);
	}
	page(`tracks/${name}.md`, name, defs[t].description.replace(/\.$/, ''), body);
}

const easings = defs.easing.enum.map((e) => `\`${e}\``).join(', ');
page('values.md', 'Values', 'Numbers, vectors, colours, curves and expressions.',
	`## Numbers\n\n${defs.number.description}\n\n` +
	'- `2`: a constant.\n- `[1, 3]`: random between 1 and 3, picked once per particle or effect.\n' +
	'- `"radius * 2 + sin(time * 4)"`: an expression, evaluated every frame.\n- `{ "keys": [[0, 0], [0.3, 1, "out_back"], [1, 0]] }`: a curve.\n\n' +
	'### Expression variables\n\n| Name | Meaning |\n|---|---|\n| `t` / `life` | 0 to 1 over the track, or over the particle\'s life inside `particle` |\n' +
	'| `time` | Seconds since the effect started |\n| `age` | Seconds since the track or particle started |\n| `rand` | A stable random number of the particle or instance, 0 to 1 |\n' +
	'| `index` | Particle index |\n| `scale` | The effect\'s scale |\n| `pi`, `tau` | Constants |\n| any param | Its current value |\n\n' +
	'### Functions\n\n`sin cos tan asin acos atan atan2 abs sign floor ceil round fract sqrt exp log pow min max clamp lerp mix step smoothstep saturate hash noise pulse`, ' +
	'and every easing name as a one-argument function. Operators: `+ - * / % ^`, comparisons, `&& || !` and `cond ? a : b`.\n\n' +
	`## Curves\n\n${defs.curve.description} \`over\` picks the input: \`t\` (default), \`time\` or \`age\`. A key may carry its own easing as a third item.\n\n` +
	`## Vectors\n\n${defs.vector.description}\n\n` +
	`## Colours\n\n${defs.color.description}\n\nGradients take stops spread evenly (\`["#fff", "#f80", "#3000"]\`) or at positions (\`[[0, "#fff"], [0.2, "#f80"], [1, "#3000"]]\`). ` +
	'Colour channels above 1 feed bloom.\n\n' + `## Easings\n\n${easings}\n`);

const trackList = tracks.map((t) => `- [${t.slice(6)}](${BASE}/reference/tracks/${t.slice(6)}/): ${defs[t].description}`).join('\n');
page('index.md', 'Reference', 'Every field of the effect format.',
	'This reference is generated from the schema Kinesis writes from its own parser, so it always matches the code. ' +
	`Point your editor at [effect.schema.json](${BASE}/schema/effect.schema.json) for completion and checking.\n\n` +
	`- [Effect file](${BASE}/reference/effect/)\n- [Values](${BASE}/reference/values/)\n- [Attachment](${BASE}/reference/attach/)\n- [Material](${BASE}/reference/material/)\n\n## Track types\n\n${trackList}\n`);
