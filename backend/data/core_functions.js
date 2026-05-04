import dotenv from 'dotenv';
dotenv.config();

import { exec as execCb } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(execCb);

const getConfig = () => process.env.CONFIG || '/etc/snapraid.conf';
const buildCmd = (args) => `snapraid ${args} --config=${JSON.stringify(getConfig())}`;

export const isSnapraidRunning = async () => {
  try {
    const { stdout } = await execAsync('pgrep -x snapraid');
    return stdout.trim().length > 0;
  } catch {
    return false;
  }
};

const ensureIdle = async () => {
  if (await isSnapraidRunning()) {
    throw new Error('SnapRAID is running');
  }
};

export const snapraidSync = async (prehash = false) => {
  await ensureIdle();
  const args = prehash ? 'sync --pre-hash' : 'sync';
  const { stdout } = await execAsync(buildCmd(args));
  return stdout;
};

export const snapraidScrub = async (percentage = 8, older = 10) => {
  await ensureIdle();
  const args = `scrub -p ${Number(percentage)} -o ${Number(older)}`;
  const { stdout } = await execAsync(buildCmd(args));
  return stdout;
};

export const snapraidStatus = async () => {
  await ensureIdle();
  const { stdout } = await execAsync(buildCmd('status'));
  return stdout;
};

export const snapraidCheck = async () => {
  await ensureIdle();
  const { stdout } = await execAsync(buildCmd('check'));
  return stdout;
};

export const snapraidSmart = async () => {
  await ensureIdle();
  const { stdout } = await execAsync(buildCmd('smart'));
  return stdout;
};