---
title: Model materials
description: Re-render an entity's own model with an effect material.
sidebar:
  order: 2
---

A `model` track draws an entity again through its own renderer, with every vertex going through Kinesis's model
material. The renderer doesn't need to know about Kinesis. Armour, held items and render layers all come along, and so
do models from other mods, GeckoLib included.

![Regeneration mid-way: bone and muscle layers behind the growth front](../../../assets/gallery/regen-muscle.jpg)

## The mask

The mask gives every pixel of the model a distance, and a front travels through those distances.

| `mode` | Distance |
|---|---|
| `point` | From `origin` |
| `plane` | Along `axis`, from `origin` |
| `bones` | Along the skeleton, from the centre of the `root` bone outward |
| `noise` | Pure noise, for an even dissolve |
| `none` | No mask |

`progress` is how far the front has travelled, in blocks. Animate it with a curve. `noise` roughens the edge.

By default, everything the front has passed is visible. `invert: true` flips that, so the model disappears as the
front passes, which turns growth into disintegration.

## Layers

Behind the front, layers stack in order. Each lasts `width` blocks behind the front; the last lasts forever.

```json
"layers": [
  { "width": 0.16, "texture": "kinesis:material/blood", "tiling": 5, "glow": 0.35 },
  { "width": 0.28, "texture": "kinesis:material/bone", "tiling": 4 },
  { "width": 0.42, "texture": "kinesis:material/muscle", "tiling": 3 },
  { "texture": "entity" }
]
```

`entity` is the model's own texture. Any other texture tiles across the model and keeps the model's transparency, so
cut-out parts stay cut out. `edge` adds a glowing rim right at the front.

## Hiding the original

`hide_original: true` stops the entity's normal rendering while the track runs, shadow included. It is how an
effect starts from nothing (regeneration) or replaces the entity (petrification).

## Snapshots and afterimages

`snapshot: true` freezes the model at the moment the track starts. The copy outlives the entity, so it works for
death dissolves and statues.

`afterimages` leaves frozen copies behind as the entity moves, each fading out:

```json
"afterimages": { "count": 7, "interval": 0.05, "life": 0.35 }
```

## Ghosts and holograms

`offset`, `scale` and `inflate` move, resize and puff out the copy. With an additive material and a fresnel fade you
get a hologram:

```json
{
  "type": "model",
  "offset": [1.3, 0, 0],
  "inflate": 0.01,
  "layers": [{ "texture": "kinesis:material/hologram", "tiling": 6 }],
  "material": { "blend": "add", "fresnel": { "power": 1.6, "strength": 1.8, "color": [0.6, 1.6, 2.2, 1], "fade": true } }
}
```

## How regeneration is built

`kinesis:regen` uses only general features:

1. A `model` track with `hide_original` hides the evaporated mob from the start. Its `bones` mask stays at 0 for the
   first part of the effect.
2. A `particles` track gathers dark remnants inward with an attractor and curl noise.
3. A single cell appears: a `mesh` sphere at `body:center`, pulsing through an expression.
4. Cells divide: a `particles` track whose particles start the `kinesis:regen_split` effect when they die.
5. Veins grow along the skeleton: a `tendrils` track with `path: bones`.
6. Organs pulse: `mesh` spheres with fresnel, scaled by `pulse(time * 9.5, 10)` for a heartbeat.
7. The body forms: the mask's `progress` sweeps out from the torso through blood, bone, muscle and skin.
8. Steam rises from the surface, a ring spreads at the feet, and the original returns.

Open `assets/kinesis/kinesis/effects/regen.json` in the Kinesis jar to read it in full.
