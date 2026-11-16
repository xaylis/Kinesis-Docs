---
title: Materials
description: Texture, blending, glow, noise, dissolve, fresnel, heat haze and custom shaders.
sidebar:
  order: 5
---

Every track draws through a material. Write it inline or save it as an asset and reuse it:

```json
"material": { "texture": "kinesis:smoke", "frames": [4, 4], "blend": "alpha", "soft": 0.5, "lit": true }
```

```json
"material": "mymod:fire"
```

```json
"material": { "parent": "mymod:fire", "glow": 2 }
```

## Textures

`mymod:spark` means `assets/mymod/textures/fx/spark.png`. `mymod:dir/name` means `textures/dir/name.png`. Ids ending
in `.png` are used as written. `frames` lays out a flipbook as columns and rows.

Kinesis ships `soft`, `spark`, `star`, `ring`, `trail`, `beam`, `smoke` and `flame` (4x4 flipbooks), `cell`,
`shard`, `scorch`, `rune` and `splat`, plus tiling surfaces in `kinesis:material/` (`blood`, `bone`, `muscle`,
`stone`, `ember`, `hologram`).

## Blending

`add` for light, `alpha` for smoke and dust, `cutout` and `opaque` for solid things.

## Glow

`glow` feeds Kinesis's bloom. Colours above 1 glow too, so a single bright core can sit inside a softer, dimmer body.

## Noise, dissolve and fresnel

```json
"noise": { "scale": 3, "scroll": [0.2, -0.6], "strength": 0.6, "distort": 0.1 },
"dissolve": { "amount": "t", "edge": 0.08, "edge_color": [3, 1.2, 0.3, 1] },
"fresnel": { "power": 2.5, "strength": 1.5, "color": [1.2, 0.7, 2.2, 1] }
```

`fresnel.fade: true` fades the centre instead of adding a rim, for ghosts and holograms.

## Gradient maps

`gradient` recolours the material by looking it up with `gradient_by`: brightness, alpha, life, u, v or fresnel.
A greyscale flame texture with a gradient becomes fire of any colour.

## Heat haze

`distortion` turns the material into a refractor: the scene behind it warps and the colour is ignored. Put it on rising
soft particles for heat, or on a ring wall for a shockwave.

## Soft edges and light

`soft` fades the material where it meets the world, so smoke never shows a hard line along the ground. `lit` darkens
it with the world's light level.

## Custom shaders

`"shader": "mymod:my_effect"` draws with `assets/mymod/shaders/core/my_effect.json`. The program gets the Kinesis
vertex format: `Position`, `Color`, `UV0`, `UV2`, `Normal` and `Data` (life, random, flipbook frame, brightness). It
writes up to three outputs: colour, glow and distortion. Kinesis fills its standard uniforms, and any you name under
`uniforms` are set every frame:

```json
"material": { "shader": "mymod:portal", "uniforms": { "Swirl": "time * 2", "Strength": "t" } }
```
