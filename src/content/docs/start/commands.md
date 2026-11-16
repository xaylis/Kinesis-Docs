---
title: Commands
description: Play and stop effects in game.
sidebar:
  order: 3
---

All commands need permission level 2.

```
/kinesis play <effect>
/kinesis play <effect> <entities> [options]
/kinesis play <effect> at <x y z> [options]
/kinesis stop [<entities>]
/kinesis clear
```

Options are `key=value` pairs separated by spaces:

| Option | Meaning |
|---|---|
| `color=#ff0000` | Sets the `color` param, or tints the effect if it has none |
| `scale=2` | Spatial scale |
| `speed=0.5` | Timeline speed |
| `seed=7` | Fixed randomness |
| `name=value` | Any param the effect declares; colours as `#rrggbb` |

`stop` lets running particles finish. `clear` stops every effect in the level.

Effect ids autocomplete from the effects your client has loaded.

## Tools for building effects

```
/kinesis seek <time>
/kinesis freeze
/kinesis resume
/kinesis filmstrip <effect> [options]
/kinesis sweep <effect> <field> <from> <to> [options]
/kinesis profile [seconds]
/kinesis watch on|off
```

See [Building effects](/Kinesis-Docs/guides/dev-tools/) for what each does.
