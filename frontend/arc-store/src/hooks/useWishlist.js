import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'arc_wishlist_v1';
const listeners = new Set();

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStore(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  listeners.forEach((fn) => fn(ids));
}

export function useWishlist() {
  const [ids, setIds] = useState(readStore);

  useEffect(() => {
    listeners.add(setIds);
    return () => listeners.delete(setIds);
  }, []);

  const toggle = useCallback((id) => {
    const current = readStore();
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    writeStore(next);
  }, []);

  const isWishlisted = useCallback((id) => ids.includes(id), [ids]);

  return { wishlistIds: ids, isWishlisted, toggle };
}
