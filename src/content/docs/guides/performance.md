---
title: Performance
description: What Kinesis does to stay fast, and how to keep your effects cheap.
sidebar:
  order: 9
---

Kinesis does the expensive parts once and skips work nobody will see. None of this needs any setup.

## What happens automatically

- **Geometry goes straight to the card.** Particles, trails and other shapes are written to native memory and
  streamed in one upload per batch. Meshes are uploaded once and only moved, coloured and deformed afterwards.
- **Off-screen work is skipped.** Particle tracks keep their bounds, and model and mesh tracks know their size, so
  anything outside the view costs almost nothing. Model re-renders are skipped entirely when the mob is off screen.
- **Particles use every core.** Particle tracks that only touch their own state are simulated in parallel on worker
  threads while the render thread waits. Each track still uses its own seed, so every client sees the same thing.
- **Big tracks move to the GPU.** With `"simulation": "auto"`, the default, large additive tracks are simulated on the
  graphics card. See [Particles](/Kinesis-Docs/guides/particles/#gpu-particles).
- **One capture per mob per frame.** Several model tracks on the same mob share one re-render of it.
- **Bloom only when something glows.** Frames whose effects have no glow skip the bloom passes.
- **Textures have mipmaps.** Detailed textures stay smooth at a distance instead of shimmering.

## Keeping effects cheap

- Prefer additive blending for large particle counts: alpha-blended particles must be sorted every frame and stay on
  the CPU.
- Collisions, trails and particle-spawned effects cost the most per particle. Use them on the tracks that need them.
- `max` is an upper bound, not a target, but it sizes buffers. Keep it near what the track can reach.
- Model tracks re-render the mob every frame. Snapshots (`"snapshot": true`) render it once.
