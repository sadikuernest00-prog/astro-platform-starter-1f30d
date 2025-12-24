import { getStore } from "@netlify/blobs";

const blobStore = getStore("amicbridge");

export async function getJSON<T>(key: string, fallback: T): Promise<T> {
  const v = await blobStore.get(key);
  if (!v) return fallback;
  return JSON.parse(v);
}

export async function setJSON<T>(key: string, value: T): Promise<void> {
  await blobStore.set(key, JSON.stringify(value));
}
