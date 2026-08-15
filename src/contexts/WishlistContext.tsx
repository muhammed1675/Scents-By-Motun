import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState } from
'react';

const KEY = 'sbm.wishlist';

interface WishlistContextValue {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: {children: React.ReactNode;}) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setIds(JSON.parse(raw) as string[]);
    } catch {

      /* ignore */}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(ids));
    } catch {

      /* ignore */}
  }, [ids]);

  const value = useMemo<WishlistContextValue>(
    () => ({
      ids,
      has: (id) => ids.includes(id),
      toggle: (id) =>
      setIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      ),
      remove: (id) => setIds((prev) => prev.filter((x) => x !== id))
    }),
    [ids]
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>);

}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
}