// Copies the schema from a sibling Kinesis checkout when there is one, and publishes it under /schema.
import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const local = join('..', 'Kinesis', 'schema');
if (existsSync(local)) {
	for (const file of readdirSync(local)) cpSync(join(local, file), join('schema', file));
}
mkdirSync(join('public', 'schema'), { recursive: true });
for (const file of readdirSync('schema')) cpSync(join('schema', file), join('public', 'schema', file));
