---
title: Building effects
description: Reload on save, freeze and seek, filmstrips, parameter sweeps and profiling.
sidebar:
  order: 10
---

Kinesis has tools for working on an effect without restarting the game. They run on the client of the player who
uses the command, and need permission level 2.

## Reload on save

In a development environment (`runClient` from your mod's workspace), Kinesis watches your mod's
`src/main/resources` folders and its resource packs. Saving a file applies it straight away:

- effects and materials are parsed again, and running effects pick up the new definition;
- textures, gradients and `.obj` models are reloaded;
- shaders are recompiled. If one fails, the old one keeps running and the error is shown in chat with the file
  and line it points at, including files pulled in with `#moj_import`.

Your source resources are mounted above the built ones, so there is no build step. `/kinesis watch off` and
`/kinesis watch on` stop and start the watcher; outside development it is off until you turn it on.

## Freeze and seek

```
/kinesis seek 1.25
/kinesis freeze
/kinesis resume
```

`seek` moves every running effect to a time in seconds and holds it there; `freeze` holds them where they are;
`resume` lets them run again. Seeking replays the effect from the start in fixed steps with the same seed, so the
same time always looks the same: what you see at 1.25 is what players see at 1.25. Sounds and child effects are
not played while it catches up.

## Filmstrips

```
/kinesis filmstrip kinesis:regen times=0:5:0.5 angles=front,side
```

Plays the effect on the entity you are looking at (or 3 blocks ahead of you), films it at each time from each angle,
and saves a labelled contact sheet to `screenshots/kinesis/`. The chat message links to the file. The camera frames
the entity on its own; your hand, the HUD and your own player are hidden while it films.

| Option | Meaning |
|---|---|
| `times=0:2:0.25` | From, to and step, in seconds. Also a list: `times=0,0.5,1.2`. Defaults to eight times across the effect |
| `time=1.2` | A single time |
| `angles=front,side` | Any of `front`, `side`, `back`, `top` and `orbit`. `orbit` turns a step for every column |
| `size=320x180` | Size of each frame on the sheet |
| `dist=4` | Camera distance in blocks, instead of fitting the entity |
| `ref=refs/concept.png` | An image to show at the start of every row, from the game folder, to compare against |
| `name=fireball` | File name of the sheet |
| `scale=`, `speed=`, `seed=`, `color=` | As for `/kinesis play` (the seed defaults to 1); any other key sets a number param. Colour params can't be set here |

## Parameter sweeps

```
/kinesis sweep kinesis:aura tracks.1.emitter.rate 20 200 steps=5 time=1.2
```

Films the effect several times with one value changed from the first number to the second, one row per value. The
field can be:

- `scale` or `speed`;
- a param the effect declares, such as `color_strength`;
- any number in the effect file, by its path: `tracks.1.material.glow`, or a track by its `name`:
  `tracks.core.particle.size`. Quote a path that uses brackets: `"tracks[1].material.glow"`.

`steps` sets how many rows (2 to 12, default 5). The other options are the same as for filmstrips; sweeps default to
one time, the middle of the effect.

## Profiling

```
/kinesis profile 5
```

Measures every running effect for a few seconds (default 5), then writes a table to the log and to
`logs/kinesis-profile-<time>.txt`, and lists the heaviest tracks in chat. For each track it gives the CPU time, the
GPU time and the particle count, plus the update step, post-processing (bloom, haze and screen effects) and the
frame time. GPU times come from timer queries read a few frames later, so profiling does not slow the game down.
