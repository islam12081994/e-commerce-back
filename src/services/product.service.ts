import Product, { IProduct } from '../models/Product';
import Category from '../models/Category';
import { AppError, AppErrorCode } from '../middleware/errorHandler';
import { createAuditLog } from '../utils/auditLogger';
import { SecurityEventType } from '../models/SecurityEvent';

interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface ProductResult {
  products: IProduct[];
  total: number;
  page: number;
  totalPages: number;
}

export const listProducts = async (filters: ProductFilters): Promise<ProductResult> => {
  const query: any = { isActive: true };
  const page = filters.page || 1;
  const limit = filters.limit || 20;

  if (filters.search) {
    query.$text = { $search: filters.search };
  }
  if (filters.category) {
    query.category = filters.category;
  }
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.price = {};
    if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
    if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
  }
  if (filters.inStock !== undefined) {
    query.stock = filters.inStock ? { $gt: 0 } : { $eq: 0 };
  }

  let sort: any = { createdAt: -1 };
  switch (filters.sort) {
    case 'price_asc':
      sort = { price: 1 };
      break;
    case 'price_desc':
      sort = { price: -1 };
      break;
    case 'date_desc':
      sort = { createdAt: -1 };
      break;
    case 'date_asc':
      sort = { createdAt: 1 };
      break;
    case 'rating_desc':
      sort = { rating: -1 };
      break;
  }

  const [products, total] = await Promise.all([
    Product.find(query).sort(sort).populate('category', 'name slug').skip((page - 1) * limit).limit(limit),
    Product.countDocuments(query),
  ]);

  return {
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getProductById = async (id: string): Promise<IProduct> => {
  const product = await Product.findById(id).populate('category', 'name slug');
  if (!product) {
    throw new AppError('Product not found', 404, AppErrorCode.NOT_FOUND);
  }
  return product;
};

export const createProduct = async (data: any, adminUserId: string, req?: any): Promise<IProduct> => {
  const categoryExists = await Category.findById(data.category);
  if (!categoryExists) {
    throw new AppError('Category not found', 400, AppErrorCode.BAD_REQUEST);
  }

  const product = await Product.create({
    name: data.name,
    description: data.description,
    price: data.price,
    category: data.category,
    stock: data.stock,
    image: data.image || '',
    rating: data.rating ?? 3,
    isActive: data.isActive ?? true,
  });

  await createAuditLog({
    event: SecurityEventType.PRODUCT_CREATED,
    req,
    userId: adminUserId,
    details: { productId: product.id, name: product.name },
    severity: 'LOW',
  });

  return product;
};

export const updateProduct = async (
  id: string,
  data: any,
  adminUserId: string,
  req?: any
): Promise<IProduct> => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError('Product not found', 404, AppErrorCode.NOT_FOUND);
  }

  if (data.category) {
    const categoryExists = await Category.findById(data.category);
    if (!categoryExists) {
      throw new AppError('Category not found', 400, AppErrorCode.BAD_REQUEST);
    }
  }

  Object.assign(product, data);
  await product.save();

  await createAuditLog({
    event: SecurityEventType.PRODUCT_UPDATED,
    req,
    userId: adminUserId,
    details: { productId: product.id, name: product.name, fieldsUpdated: Object.keys(data) },
    severity: 'LOW',
  });

  return product;
};

export const deleteProduct = async (id: string, adminUserId: string, req?: any): Promise<void> => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError('Product not found', 404, AppErrorCode.NOT_FOUND);
  }

  await product.deleteOne();

  await createAuditLog({
    event: SecurityEventType.PRODUCT_DELETED,
    req,
    userId: adminUserId,
    details: { productId: id, name: product.name },
    severity: 'MEDIUM',
  });
};

export const listCategories = async () => {
  return Category.find().sort({ name: 1 });
};