---
title: Particles
description: Emitters, per-particle values, forces and sub-emitters.
sidebar:
  order: 3
---

A `particles` track has an emitter, per-particle settings, forces and optional sub-effects.

```json
{
  "type": "particles",
  "emitter": { "rate": 60, "burst": 20, "shape": { "type": "sphere", "radius": 0.5, "surface": true } },
  "particle": {
    "lifetime": [0.6, 1.2],
    "speed": [1, 3],
    "size": { "keys": [[0, 0], [0.2, 0.12], [1, 0]] },
    "color": { "gradient": ["#ffffff", "$color", "#00000000"] },
    "spin": [-90, 90]
  },
  "forces": [{ "type": "curl", "strength": 2, "scale": 1.5 }],
  "material": { "texture": "kinesis:soft", "glow": 1 }
}
```

## Emitting

`rate` is particles per second and can be a curve over the track. `burst` fires a count at the start, or a list of
`[time, count]`. `per_block` spawns along the path the emitter travels, which is handy for trails behind a moving
entity.

## Shapes

`point`, `sphere`, `box`, `disc`, `cone` and `line` work in the track's frame. Three more read the anchored entity:

- `surface` spawns on the model's rendered surface. Each particle takes the texture colour where it spawned, which is
  how `kinesis:disintegrate` turns a mob into its own coloured dust.
- `bones` spawns along the skeleton.
- `aabb` spawns inside the bounding box.

## Values over life

Inside `particle`, `t` is the particle's life from 0 to 1, and `rand` is a random number of its own. A size curve
over `t` grows and shrinks each particle. A gradient over `t` fades its colour.

## Forces

`gravity`, `drag`, `wind`, `vortex`, `orbit`, `attractor` (with an optional kill radius, or `target: true` to pull
toward the target) and `curl` for smooth turbulence. Force strengths are numbers too, so they can ramp over the track.

## Collisions

`collide` makes particles `bounce`, `stick` or `die` on blocks. `spawn.collide` starts an effect where they hit, such
as a splash.

## Particles that spawn particles

```json
"spawn": { "death": "mymod:spark_split", "chance": 0.4 }
```

Each particle that dies has a 40% chance to start `mymod:spark_split` where it died. That effect can have its own
particles, which can spawn more. Kinesis caps how many sub-effects can start each frame, so chains can't run away.

## The same on every client

Particles are simulated at a fixed 60 Hz. Every random choice comes from the effect seed and the particle's spawn
number, so all players see the same particles in the same places, whatever their frame rate.
