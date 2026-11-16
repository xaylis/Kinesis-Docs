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

## GPU particles

For very large counts, simulate on the graphics card:

```json
"emitter": { "simulation": "gpu", "max": 131072, "rate": 24000, "shape": { "type": "disc", "radius": 5 } }
```

Spawning still runs on the CPU, so every shape works, `surface` and `bones` included. After that the card ages and
moves the particles and draws them in one call. `kinesis:nebula` keeps around 100,000 particles in the air.

A CPU track holds up to 20,000 particles; a GPU track holds up to 262,144. When a GPU track is full, the oldest particle
makes room for the new one.

Most of a CPU track carries over. A few things don't:

- No `collide`, `trail` or `spawn`. Kinesis reports these as errors so they are never silently ignored.
- Up to 8 forces. `gravity`, `drag` and `wind` are free; `vortex`, `orbit`, `attractor` and `curl` each count once.
- `size`, `stretch` and `color` are read from a small table over life (`t`) and 16 steps of `rand`, rebuilt every
  frame, so they can still follow params and time. Curves `over` the particle's `age` use its average lifetime.
- Alpha-blended GPU particles are not sorted back to front. Additive particles, the default, look the same either way.
- Materials work as they do on the CPU, apart from custom `shader` programs.

If the graphics driver can't run the simulation, the track falls back to the CPU and is capped at 20,000.

## The same on every client

Particles are simulated at a fixed 60 Hz. Every random choice comes from the effect seed and the particle's spawn
number, so all players see the same particles in the same places, whatever their frame rate. GPU particles spawn the
same way; their motion can differ by rounding between graphics cards, which is invisible at the scale they are used.
