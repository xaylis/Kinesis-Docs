---
title: Your first effect
description: Write an effect file and play it.
sidebar:
  order: 2
---

Effects live in your mod's resources, next to textures and models:

```
src/main/resources/assets/mymod/kinesis/effects/fire_burst.json
```

That file becomes the effect `mymod:fire_burst`.

## The file

```json
{
  "duration": 1.5,
  "params": { "color": "#ff7a1a" },
  "tracks": [
    {
      "type": "particles",
      "end": 0.1,
      "emitter": { "burst": 80, "shape": { "type": "sphere", "radius": 0.2 } },
      "particle": {
        "lifetime": [0.4, 0.9],
        "speed": [3, 7],
        "size": { "keys": [[0, 0.15], [1, 0]] },
        "color": { "gradient": [[0, [3, 2, 1, 1]], [0.4, "$color"], [1, "#30000000"]] },
        "stretch": 0.05
      },
      "forces": [{ "type": "gravity", "strength": 9 }, { "type": "drag", "strength": 1.5 }],
      "material": { "texture": "kinesis:spark", "glow": 1.2 }
    },
    {
      "type": "ring",
      "end": 0.6,
      "at": { "offset": [0, 0.05, 0], "align": "world" },
      "radius": { "keys": [[0, 0], [1, 3, "out_cubic"]] },
      "color": { "gradient": [[0, "$color"], [1, "#ff000000"]] },
      "material": { "texture": "kinesis:ring", "glow": 1 }
    }
  ],
  "events": [{ "time": 0, "sound": "minecraft:entity.blaze.shoot" }]
}
```

- `duration` is in seconds.
- Each track has a `type`. A track without `start` and `end` runs for the whole effect.
- `[0.4, 0.9]` means a random value in that range, picked once per particle.
- `{ "keys": ... }` is a curve. Inside `particle`, curves run over each particle's life.
- Colours above 1, like `[3, 2, 1, 1]`, glow.
- `"$color"` reads the `color` param, which code and commands can override.

## Play it

From a command:

```
/kinesis play mymod:fire_burst @e[type=zombie,limit=1,sort=nearest] color=#33aaff
```

From code, on the server, where every nearby player sees the same effect:

```java
Kinesis.play("mymod:fire_burst", zombie);
```

Edit the file and press F3+T to reload. Mistakes show up in chat with the file and field, such as
`effect mymod:fire_burst: tracks[0].particle: unknown field 'sise' in particle (did you mean 'size'?)`.

## Editor support

Add a schema line to get completion and checking in editors that understand JSON schema:

```json
{
  "$schema": "https://xaylis.github.io/Kinesis-Docs/schema/effect.schema.json",
  "duration": 1.5
}
```
