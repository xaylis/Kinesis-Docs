---
title: Multiplayer
description: How effects stay in sync.
sidebar:
  order: 8
---

Play effects from server code. The server sends the effect id, its anchor, a seed, the overrides and the tick it
started on to every player who can see it. Clients don't send anything back.

- **Same randomness.** Every random choice in the effect comes from the seed: particle spawns, lightning bolts,
  tendril branches. Set `.seed(...)` to make an effect identical every time, or leave it random.
- **Same timing.** Clients measure time from the start tick, so an effect is at the same moment on every screen.
- **Late joiners.** Effects attached to an entity are remembered. A player who comes into range later gets them,
  already part-way through.
- **Live changes.** `handle.set(...)`, `stop()` and `kill()` from the server reach every client.
- **Optional on clients.** Players without Kinesis can still join. They just don't see effects.

Effects played on the client, from client code, only show for that player.
