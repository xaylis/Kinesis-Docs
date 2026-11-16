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

## Shading

`shading` lights a surface per pixel from its normals, like a studio light, so meshes, ribbons and model layers read as
solid, wet or translucent things instead of flat colour:

```json
"shading": {
  "diffuse": 1, "ambient": 0.3, "specular": 1.3, "gloss": 80,
  "subsurface": 0.6, "subsurface_color": "#ff1a10", "bump": 2.5, "light": [0.4, 0.85, 0.35]
}
```

- `specular` and `gloss` set the highlight: low gloss is satin, high is wet. Above 1 the highlight glows.
- `subsurface` lets light bleed through: it wraps round to the dark side and glows at the rim in `subsurface_color`.
  Use it for flesh, wax, leaves and jelly.
- `bump` takes relief from the texture's brightness, so pores, fibres and veins catch the light.
- `light` is the direction the key light comes from, in world axes.

On a model track, each layer's `shine` scales the highlight, so wet muscle and dry skin can share one material.
Shading applies to layers with their own texture; the entity's own skin keeps its usual look.

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
