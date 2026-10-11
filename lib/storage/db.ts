const DB_NAME = "little-outside";
const DB_VERSION = 2;

export const SESSIONS_STORE = "sessions";
export const WORDS_STORE = "words";
export const DRAFT_STORE = "drafts";

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is not available in this environment."));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(SESSIONS_STORE)) {
        const store = db.createObjectStore(SESSIONS_STORE, { keyPath: "id" });
        store.createIndex("createdAt", "createdAt");
      }
      if (!db.objectStoreNames.contains(WORDS_STORE)) {
        const store = db.createObjectStore(WORDS_STORE, { keyPath: "id" });
        store.createIndex("createdAt", "createdAt");
      }
      if (!db.objectStoreNames.contains(DRAFT_STORE)) {
        db.createObjectStore(DRAFT_STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      const error = request.error;
      if (error && error.name === "VersionError") {
        const fallbackRequest = indexedDB.open(DB_NAME);
        fallbackRequest.onsuccess = () => resolve(fallbackRequest.result);
        fallbackRequest.onerror = () => reject(error);
        return;
      }
      reject(error ?? new Error("Could not open IndexedDB."));
    };
  });

  return dbPromise;
}

export async function putOne<T extends { id: string }>(
  storeName: string,
  value: T,
): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    tx.objectStore(storeName).put(value);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("IndexedDB write failed."));
  });
}

export async function getAll<T>(
  storeName: string,
  descendingByCreatedAt = true,
): Promise<T[]> {
  const db = await openDb();
  return new Promise<T[]>((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const request = tx.objectStore(storeName).getAll();
    request.onsuccess = () => {
      const items = (request.result ?? []) as (T & { createdAt?: number })[];
      if (descendingByCreatedAt) {
        items.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
      }
      resolve(items as T[]);
    };
    request.onerror = () => {
      reject(request.error ?? new Error("IndexedDB read failed."));
    };
  });
}

export async function deleteOne(storeName: string, id: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    tx.objectStore(storeName).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("IndexedDB delete failed."));
  });
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}
