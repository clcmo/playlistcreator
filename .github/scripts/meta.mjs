// Gera <saida>/version.json e exporta APP_VERSION para os próximos passos.
// Versão = major.minor do package.json + nº da execução do workflow (sempre crescente).
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, appendFileSync } from 'node:fs';

const out = process.argv[2] || 'site';
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const [major, minor] = pkg.version.split('.');
const version = `${major}.${minor}.${process.env.GITHUB_RUN_NUMBER || 0}`;

const sh = (cmd) => {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return ''; }
};
const lastTag = sh('git describe --tags --abbrev=0 --match "v*"');
const range = lastTag ? `${lastTag}..HEAD` : 'HEAD';
const changes = sh(`git log ${range} --no-merges -n 15 --pretty=format:%s`)
  .split('\n').filter(Boolean);

const meta = {
  version,
  builtAt: new Date().toISOString(),
  commit: process.env.GITHUB_SHA || sh('git rev-parse HEAD'),
  repo: process.env.GITHUB_REPOSITORY || '',
  previous: lastTag || null,
  changes
};

mkdirSync(out, { recursive: true });
writeFileSync(`${out}/version.json`, JSON.stringify(meta, null, 2));
if (process.env.GITHUB_ENV) appendFileSync(process.env.GITHUB_ENV, `APP_VERSION=${version}\n`);
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `version=${version}\n`);
console.log(`versão ${version} (${changes.length} mudanças desde ${lastTag || 'o início'})`);
