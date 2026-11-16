---
title: Installation
description: Add Kinesis to a mod or a modpack.
sidebar:
  order: 1
---

Kinesis is a Forge 1.20.1 mod. Players install it like any other mod. It has no dependencies beyond Forge.

## In a modpack

Drop the Kinesis jar into `mods`. Every mod that uses Kinesis shares it. Servers need it too, so effects played by
server code reach players. Players who join without it can still play; they just don't see the effects.

## In your mod

Add the jar as a dependency. With ForgeGradle or Architectury Loom:

```groovy
repositories {
    maven { url = "https://api.modrinth.com/maven" }
}

dependencies {
    implementation fg.deobf("maven.modrinth:kinesis-lib:1.0.0")
}
```

With Architectury Loom, use `modImplementation` instead of `implementation fg.deobf(...)`.

Then declare it in `mods.toml`:

```toml
[[dependencies.yourmod]]
modId = "kinesis"
mandatory = true
versionRange = "[1.0,)"
ordering = "AFTER"
side = "BOTH"
```

Kinesis ships its own effects, such as `kinesis:regen` and `kinesis:shockwave`, so you can try it before writing
any. Run `/kinesis play kinesis:regen @e[type=husk,limit=1,sort=nearest]` in a world.
