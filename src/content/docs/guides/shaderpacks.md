---
title: Shaderpacks
description: How Kinesis works with Oculus.
sidebar:
  order: 7
---

Kinesis works with Oculus and shaderpacks without any setup.

Shaderpacks replace Minecraft's rendering with their own passes. Effects drawn the usual way get lit, shadowed and
post-processed by the pack, and often come out invisible, black or smeared. Kinesis sidesteps all of that: it draws
every effect in its own pass, after the shaderpack has finished the frame. It depth-tests against the scene, then
runs its own bloom, heat haze and screen effects.

![Regeneration under Complementary Reimagined](../../../assets/gallery/oculus-regen.jpg)

What that means in practice:

- Effects look the same with and without a pack.
- Effects are hidden behind terrain and entities as you'd expect.
- The pack doesn't light or shadow effects. Nearly all visual effects glow anyway. Model materials do their own
  lighting from the world's light levels.
- Bloom and heat haze come from Kinesis, not the pack, so they behave the same under any pack.
