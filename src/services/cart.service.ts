import Product from '../models/Product';
import { AppError, AppErrorCode } from '../middleware/errorHandler';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
}

const carts = new Map<string, Cart>();

const SHIPPING_THRESHOLD = 50;
const SHIPPING_FEE = 5.99;

const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  return { subtotal, shipping, total: subtotal + shipping };
};

export const getCart = (userId: string) => {
  const cart = carts.get(userId) || { userId, items: [] };
  const totals = calculateTotals(cart.items);
  return { ...cart, ...totals, freeShipping: totals.shipping === 0 };
};

const getOrCreateCart = (userId: string): Cart => {
  if (!carts.has(userId)) {
    carts.set(userId, { userId, items: [] });
  }
  return carts.get(userId)!;
};

export const addItemToCart = async (userId: string, productId: string, quantity: number) => {
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    throw new AppError('Product not found', 404, AppErrorCode.NOT_FOUND);
  }

  const cart = getOrCreateCart(userId);
  const existing = cart.items.find((item) => item.productId === productId);

  const requestedQuantity = (existing?.quantity || 0) + quantity;
  if (product.stock < requestedQuantity) {
    throw new AppError(`Only ${product.stock} units available in stock`, 400, AppErrorCode.BAD_REQUEST);
  }

  if (existing) {
    existing.quantity = requestedQuantity;
  } else {
    cart.items.push({
      productId,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
      stock: product.stock,
    });
  }

  return getCart(userId);
};

export const updateCartItemQuantity = async (userId: string, productId: string, quantity: number) => {
  const cart = getOrCreateCart(userId);
  const existing = cart.items.find((item) => item.productId === productId);
  if (!existing) {
    throw new AppError('Item not found in cart', 404, AppErrorCode.NOT_FOUND);
  }

  const product = await Product.findById(productId);
  if (product && quantity > product.stock) {
    throw new AppError(`Only ${product.stock} units available in stock`, 400, AppErrorCode.BAD_REQUEST);
  }

  existing.quantity = quantity;
  return getCart(userId);
};

export const removeItemFromCart = (userId: string, productId: string) => {
  const cart = getOrCreateCart(userId);
  cart.items = cart.items.filter((item) => item.productId !== productId);
  return getCart(userId);
};

export const clearCart = (userId: string) => {
  cartRef(userId).items = [];
  return getCart(userId);
};

const cartRef = (userId: string): Cart => {
  if (!carts.has(userId)) {
    carts.set(userId, { userId, items: [] });
  }
  return carts.get(userId)!;
};

export const getCartItems = async (userId: string): Promise<CartItem[]> => {
  const cart = getOrCreateCart(userId);
  return cart.items;
};

export const commitCartThenClear = (userId: string): CartItem[] => {
  const cart = carts.get(userId);
  if (!cart) return [];
  const items = [...cart.items];
  cart.items = [];
  return items;
};