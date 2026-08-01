import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState } from
'react';
import { Cart, CartItem, Product } from '../types';
import {
  applyCoupon as applyCouponService,
  clearCart as clearCartService,
  getCart,
  removeCoupon as removeCouponService,
  saveCart } from
'../services';

interface CartContextValue {
  cart: Cart;
  itemCount: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<{ok: boolean;message: string;}>;
  removeCoupon: () => Promise<void>;
  clearCart: () => Promise<void>;
}

const emptyCart: Cart = { lines: [], subtotal: 0, coupon: null, total: 0 };

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: {children: React.ReactNode;}) {
  const [cart, setCart] = useState<Cart>(emptyCart);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    getCart().then(setCart);
  }, []);

  const persist = useCallback(async (items: CartItem[]) => {
    const next = await saveCart(items);
    setCart(next);
  }, []);

  const toItems = useCallback(
    (source: Cart): CartItem[] =>
    source.lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
    []
  );

  const addItem = useCallback(
    async (product: Product, quantity = 1) => {
      const items = toItems(cart);
      const existing = items.find((i) => i.productId === product.id);
      const next = existing ?
      items.map((i) =>
      i.productId === product.id ?
      { ...i, quantity: Math.min(i.quantity + quantity, product.stock) } :
      i
      ) :
      [...items, { productId: product.id, quantity }];
      await persist(next);
      setDrawerOpen(true);
    },
    [cart, persist, toItems]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      const items = toItems(cart).
      map((i) => i.productId === productId ? { ...i, quantity } : i).
      filter((i) => i.quantity > 0);
      await persist(items);
    },
    [cart, persist, toItems]
  );

  const removeItem = useCallback(
    async (productId: string) => {
      await persist(toItems(cart).filter((i) => i.productId !== productId));
    },
    [cart, persist, toItems]
  );

  const applyCoupon = useCallback(
    async (code: string) => {
      const result = await applyCouponService(code, cart.subtotal);
      if (result.ok) {
        setCart(await getCart());
      }
      return { ok: result.ok, message: result.message };
    },
    [cart.subtotal]
  );

  const removeCoupon = useCallback(async () => {
    await removeCouponService();
    setCart(await getCart());
  }, []);

  const clearCart = useCallback(async () => {
    await clearCartService();
    setCart(await getCart());
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      itemCount: cart.lines.reduce((sum, l) => sum + l.quantity, 0),
      isDrawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      addItem,
      updateQuantity,
      removeItem,
      applyCoupon,
      removeCoupon,
      clearCart
    }),
    [
    cart,
    isDrawerOpen,
    addItem,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    clearCart]

  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}