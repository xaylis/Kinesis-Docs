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

Add the jar as a dependency through [CurseMaven](https://www.cursemaven.com/), which serves files straight from
CurseForge. With ForgeGradle:

```groovy
repositories {
    exclusiveContent {
        forRepository { maven { url = "https://cursemaven.com" } }
        filter { includeGroup "curse.maven" }
    }
}

dependencies {
    implementation fg.deobf("curse.maven:kinesis-lib-1811182:9657319")
}
```

With Architectury Loom, use `modImplementation "curse.maven:kinesis-lib-1811182:9657319"` instead.

`1811182` is the Kinesis project on CurseForge and `9657319` is the file for 1.0.0. Each release has its own file ID,
shown in the file's page address on CurseForge.

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
