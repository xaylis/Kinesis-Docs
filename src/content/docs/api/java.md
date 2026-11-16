---
title: Java API
description: Kinesis, EffectBuilder and EffectHandle.
---

Everything public lives in `dev.xaylis.kinesis.api`.

## Kinesis

```java
Kinesis.play("mymod:regen", entity);          // at an entity
Kinesis.play("mymod:shockwave", level, pos);  // at a position
Kinesis.effect("mymod:beam")                  // a builder for overrides
Kinesis.stop(entity);                         // stop everything on an entity
```

Call these on either side. On the server, the effect goes to every player who can see it. On the client, it plays
locally.

## EffectBuilder

| Method | Meaning |
|---|---|
| `at(Entity)` | Attach to an entity |
| `at(Entity, String bone)` | Attach to a bone, falling back to the entity |
| `at(Level, Vec3)` | Place at a position |
| `facing(Vec3)`, `rotation(yaw, pitch)` | Orient a position effect |
| `to(Entity)`, `to(Entity, bone)`, `to(Vec3)` | The target for beams, lightning and attractors |
| `color(int rgb)` | Set the `color` param, or tint the effect |
| `scale(float)` | Spatial scale |
| `speed(float)` | Timeline speed |
| `seed(long)` | Fixed randomness |
| `param(String, double)`, `paramColor(String, int)` | Override a declared param |
| `play()` | Start it and return an `EffectHandle` |

```java
EffectHandle beam = Kinesis.effect("mymod:fire_beam")
        .at(player, "right_arm:tip")
        .to(target)
        .color(0xFF6A00)
        .param("length", 24)
        .play();
```

## EffectHandle

| Method | Meaning |
|---|---|
| `stop()` | Stop spawning and let what is alive finish |
| `kill()` | Remove at once |
| `set(String, double)`, `setColor(String, int)` | Change a param while it runs |
| `isAlive()` | Whether it is still running |
| `on(String event, Consumer<EffectEvent>)` | Listen for a timeline event (client side) |

```java
EffectHandle charge = Kinesis.play("mymod:charge", player);
// later
charge.set("power", 0.8);
charge.stop();
```

`EffectEvent` carries the event name, the position it happened at and the handle.
