import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const execFileAsync = promisify(execFile);

export async function runTrivy(args) {
  const outFile = path.join(os.tmpdir(), `trivy-${Date.now()}.json`);

  await execFileAsync(
    'trivy',
    [...args, '--format', 'json', '--output', '--enable-ai', outFile],
    { maxBuffer: 20 * 1024 * 1024 }
  );

  const raw = await fs.readFile(outFile, 'utf8');
  await fs.unlink(outFile).catch(() => {});
  return JSON.parse(raw);
}

export async function scanProject(projectPath) {
  return runTrivy([
    'fs',
    '--scanners', 'vuln,secret,misconfig',
    projectPath
  ]);
}