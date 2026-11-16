---
title: Trails, beams and other shapes
description: Ribbons, tendrils, beams, lightning, rings, meshes and decals.
sidebar:
  order: 4
---

## Trails

A `trail` records where its point has been and draws a fading ribbon through it. Give it an `edge` and it sweeps the
surface between two points instead, like a blade's arc:

```json
{ "type": "trail", "at": { "bone": "right_arm:tip" }, "edge": { "bone": "right_arm" }, "length": 0.2 }
```

## Tendrils

`tendrils` grow branching curves over time: veins, roots, cracks and nerves. `path` picks the route:

- `random` wanders outward;
- `target` reaches for the target;
- `points` follows the points you list;
- `bones` runs along the anchored entity's skeleton, from the torso out to the limbs.

`grow` is how much has grown, 0 to 1, and defaults to the track's `t`. `branch` and `depth` control branching.
`pulse` sends waves of light along the strands.

## Beams

A `beam` runs from its `at` to its `to`, to the effect's target, or `length` blocks forward. It has a bright core, a
`wobble`, a scrolling texture and `grow` for firing outward. `raycast: true` stops it at the first block.

## Lightning

`lightning` builds branching bolts by repeated midpoint displacement and rebuilds them `rate` times a second from the
effect seed, so every client sees the same strikes. Without an end point, bolts strike random points within
`radius`.

## Rings

A `ring` lies flat, faces the camera or faces forward. Give it `height` and it becomes a wall, which makes a good
shockwave with a `distortion` material.

## Meshes

A `mesh` draws `sphere`, `cube`, `cylinder`, `cone`, `torus` or `plane`, or an OBJ model by id, such as
`mymod:models/fx/horn.obj`. `scale`, `rotation` and `spin` are vectors.

Meshes are uploaded to the graphics card once and placed with a matrix every frame, so a detailed model costs about as
much as a cube.

`reveal` grows a mesh into view along an axis behind a glowing front, like a crystal pushing out of the ground:

```json
"reveal": { "axis": [0, -1, 0], "progress": "smoothstep(0, 0.6, age)", "edge": 0.05, "edge_color": [3.2, 1.6, 0.9, 1], "noise": 0.03 }
```

`displace` makes the surface swell and ripple along its normals, for tissue that breathes and pulses:

```json
"displace": { "amount": 0.004, "scale": 6, "speed": 3 }
```

Both work with the built-in programs. A material with a custom `shader` draws the mesh the slow way, vertex by vertex,
without them.

## Decals

A `decal` projects a texture onto whatever lies under it: grass, slabs, slopes, the edges of blocks. It reads the
scene depth, so it never floats or clips. `project: forward` throws it onto walls instead.
