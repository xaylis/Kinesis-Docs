---
title: Timelines
description: Tracks, timing, params, events and loops.
sidebar:
  order: 1
---

An effect is a list of tracks laid out on a timeline, plus events at moments in time.

```json
{
  "duration": 4,
  "loop": false,
  "params": { "color": "#ff3b1f", "radius": 2 },
  "tracks": [ ... ],
  "events": [ ... ]
}
```

## Tracks

Every track has these fields:

| Field | Meaning |
|---|---|
| `type` | What it draws: `particles`, `trail`, `tendrils`, `beam`, `lightning`, `ring`, `mesh`, `decal`, `model`, `screen` or `effect` |
| `start`, `end` | When it runs, in seconds. `end` defaults to the end of the effect |
| `at` | Where it sits: an [attachment](/Kinesis-Docs/reference/attach/) |
| `material` | How it is shaded: a [material](/Kinesis-Docs/reference/material/) |
| `name` | Optional, shows up in error messages |

Inside a track, `t` runs from 0 to 1 between `start` and `end`, so a curve over `t` stretches with the track.
Particles get their own `t` over their life.

## Attachments

```json
"at": { "bone": ["right_arm:tip", "right_arm"], "offset": [0, 0.1, 0.2], "align": "head", "follow": true }
```

Offsets are in blocks, in the anchor's frame: x to the right, y up, z forward. `align` picks the frame: the entity's
body, its head (where it looks), the world axes or the camera. `follow: false` leaves the track where it started.
`"at": "target"` uses the second anchor set with `.to(...)`.

## Params

Params are the knobs an effect exposes. Declare them with defaults, then use them anywhere:

```json
"params": { "color": "#ff3b1f", "radius": 2, "angry": false },
"radius": "radius * (angry ? 1.5 : 1)",
"color": "$color"
```

Code sets them with `.param("radius", 4)`, commands with `radius=4`, and running effects can change them with
`handle.set("radius", 6)`. `.color(0xFF0000)` sets the `color` param, or tints the whole effect if there is none.

## Events

```json
"events": [
  { "time": 0, "sound": "minecraft:entity.generic.explode", "volume": 1.2, "pitch": 0.8 },
  { "time": 0.4, "play": "mymod:debris", "at": { "offset": [0, 0.5, 0] } },
  { "time": 0.4, "event": "impact" }
]
```

`play` starts another effect. `event` fires a named event that code can listen to:

```java
handle.on("impact", e -> spawnDebris(e.position()));
```

## Sub-effects

An `effect` track plays another effect as part of this one, optionally on repeat:

```json
{ "type": "effect", "effect": "mymod:spark_burst", "start": 0.5, "end": 3, "every": 0.25, "params": { "color": "#88ccff" } }
```

## Loops

`"loop": true` repeats the timeline until the effect is stopped. Tracks restart each time round; particles that are
already alive keep going. `handle.stop()` lets everything finish; `handle.kill()` removes it at once.
