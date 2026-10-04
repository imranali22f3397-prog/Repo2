import {getStore} from '@netlify/blobs';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'fs';
import {join} from 'path';

export type Experience = {
  date: string;
  recipientName: string;
  password: string;
  messages: string[];
  letter: string;
  wishes: string[];
  photos: {id: string; ext: string}[];
  createdAt: string;
};

const EXPERIENCES_DIR = join(process.cwd(), 'public', 'experiences');
const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads');

function isMissingBlobsEnvironment(error: unknown) {
  return error instanceof Error && error.name === 'MissingBlobsEnvironmentError';
}

function ensureDir(path: string) {
  if (!existsSync(path)) mkdirSync(path, {recursive: true});
}

export async function saveExperience(id: string, data: Experience) {
  try {
    await getStore('experiences').setJSON(`${id}.json`, data);
  } catch (error) {
    if (!isMissingBlobsEnvironment(error)) throw error;
    ensureDir(EXPERIENCES_DIR);
    writeFileSync(join(EXPERIENCES_DIR, `${id}.json`), JSON.stringify(data));
  }
}

export async function getExperience(id: string): Promise<Experience | null> {
  try {
    const data = (await getStore('experiences').get(`${id}.json`, {type: 'json'})) as Experience | null;
    if (data) return data;
  } catch (error) {
    if (!isMissingBlobsEnvironment(error)) throw error;
  }

  const filePath = join(EXPERIENCES_DIR, `${id}.json`);
  if (!existsSync(filePath)) return null;
  return JSON.parse(readFileSync(filePath, 'utf-8')) as Experience;
}

export async function savePhoto(key: string, buffer: ArrayBuffer) {
  try {
    await getStore('photos').set(key, buffer);
  } catch (error) {
    if (!isMissingBlobsEnvironment(error)) throw error;
    ensureDir(UPLOADS_DIR);
    writeFileSync(join(UPLOADS_DIR, key), Buffer.from(buffer));
  }
}

export async function getPhoto(key: string): Promise<ArrayBuffer | null> {
  try {
    const data = (await getStore('photos').get(key, {type: 'arrayBuffer'})) as ArrayBuffer | null;
    if (data) return data;
  } catch (error) {
    if (!isMissingBlobsEnvironment(error)) throw error;
  }

  const filePath = join(UPLOADS_DIR, key);
  if (!existsSync(filePath)) return null;
  const buffer = readFileSync(filePath);
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}
