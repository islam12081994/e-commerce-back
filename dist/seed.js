"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config"));
const User_1 = __importDefault(require("./models/User"));
const Product_1 = __importDefault(require("./models/Product"));
const Category_1 = __importDefault(require("./models/Category"));
const Order_1 = __importDefault(require("./models/Order"));
const Payment_1 = __importDefault(require("./models/Payment"));
const SecurityEvent_1 = __importStar(require("./models/SecurityEvent"));
const helpers_1 = require("./utils/helpers");
const logger_1 = __importDefault(require("./utils/logger"));
const SHIPPING_THRESHOLD = 50;
const SHIPPING_FEE = 5.99;
const categoriesData = [
    { name: 'Electronics', slug: 'electronics', description: 'General electronic devices and gadgets' },
    { name: 'Computers', slug: 'computers', description: 'Laptops, desktops and computer components' },
    { name: 'Phones', slug: 'phones', description: 'Smartphones and mobile devices' },
    { name: 'Accessories', slug: 'accessories', description: 'Peripherals and device accessories' },
    { name: 'Gaming', slug: 'gaming', description: 'Gaming consoles, controllers and gear' },
    { name: 'Home', slug: 'home', description: 'Smart home and home office equipment' },
];
const productsData = [
    { name: 'UltraBook Pro 14', category: 'Computers', price: 1299.99, stock: 15, rating: 4.6, description: '14-inch ultraportable laptop with 16GB RAM and 512GB SSD, ideal for professionals on the go.' },
    { name: 'Gaming PC Tower X9', category: 'Computers', price: 1899.99, stock: 8, rating: 4.8, description: 'High-performance gaming desktop with RTX 4070, 32GB DDR5 RAM and liquid cooling.' },
    { name: '4K Monitor 27"', category: 'Computers', price: 429.99, stock: 25, rating: 4.5, description: '27-inch 4K UHD IPS monitor with 99% sRGB color accuracy and adjustable stand.' },
    { name: 'Mechanical Keyboard', category: 'Accessories', price: 89.99, stock: 60, rating: 4.4, description: 'RGB backlit mechanical keyboard with hot-swappable switches and aluminum frame.' },
    { name: 'Wireless Mouse', category: 'Accessories', price: 49.99, stock: 80, rating: 4.2, description: 'Ergonomic wireless mouse with 16000 DPI sensor and 70-hour battery life.' },
    { name: 'USB-C Dock Station', category: 'Accessories', price: 119.99, stock: 40, rating: 4.3, description: '13-in-1 USB-C docking station with dual 4K HDMI output and 100W power delivery.' },
    { name: 'Webcam 1080 Pro', category: 'Accessories', price: 69.99, stock: 35, rating: 4.0, description: 'Full HD webcam with auto-focus, dual microphones and privacy shutter.' },
    { name: 'Laptop Stand Alu', category: 'Accessories', price: 39.99, stock: 55, rating: 4.1, description: 'Adjustable aluminum laptop stand with ventilation for better cooling.' },
    { name: 'Smartphone X1', category: 'Phones', price: 799.99, stock: 20, rating: 4.7, description: 'Flagship smartphone with OLED display, 128MP triple camera and 5000mAh battery.' },
    { name: 'Smartphone X1 Mini', category: 'Phones', price: 649.99, stock: 18, rating: 4.5, description: 'Compact flagship with 6.1-inch display, dual camera and wireless charging.' },
    { name: 'Budget Phone M2', category: 'Phones', price: 199.99, stock: 50, rating: 3.9, description: 'Affordable smartphone with 6.5-inch screen, dual SIM and 128GB storage.' },
    { name: 'Power Bank 20000', category: 'Phones', price: 45.99, stock: 90, rating: 4.3, description: 'High-capacity 20000mAh power bank with USB-C 65W fast charging output.' },
    { name: 'Wireless Earbuds', category: 'Accessories', price: 79.99, stock: 70, rating: 4.2, description: 'True wireless earbuds with active noise cancellation and 30-hour total playtime.' },
    { name: 'Over-Ear Headphones', category: 'Accessories', price: 249.99, stock: 22, rating: 4.6, description: 'Studio-grade headphones with balanced audio and memory foam ear cushions.' },
    { name: 'Bluetooth Speaker', category: 'Electronics', price: 99.99, stock: 45, rating: 4.4, description: 'Portable waterproof Bluetooth speaker with 360° sound and 20-hour battery.' },
    { name: 'Tablet S8', category: 'Electronics', price: 549.99, stock: 17, rating: 4.5, description: '11-inch tablet with stylus support, 8GB RAM and all-day battery life.' },
    { name: 'Smart Watch Series 5', category: 'Electronics', price: 299.99, stock: 30, rating: 4.1, description: 'Fitness smartwatch with GPS, heart rate tracking and 10-day battery.' },
    { name: 'E-Reader Paperwhite', category: 'Electronics', price: 139.99, stock: 40, rating: 4.3, description: 'Waterproof e-reader with 6.8-inch glare-free display and warm light.' },
    { name: 'Drone Camera Fly 4K', category: 'Electronics', price: 899.99, stock: 6, rating: 4.7, description: 'Foldable camera drone with 4K HDR video and 34-minute flight time.' },
    { name: 'Action Camera Go 5', category: 'Electronics', price: 379.99, stock: 12, rating: 4.5, description: 'Rugged 5.3K action camera with stabilization and waterproof housing.' },
    { name: 'Gaming Console Z', category: 'Gaming', price: 499.99, stock: 14, rating: 4.8, description: 'Next-gen gaming console with 4K 120fps gaming, SSD and ray tracing.' },
    { name: 'Gaming Console Z Slim', category: 'Gaming', price: 449.99, stock: 16, rating: 4.6, description: 'Digital edition gaming console with 4K gaming for a leaner price.' },
    { name: 'Pro Controller Elite', category: 'Gaming', price: 129.99, stock: 28, rating: 4.7, description: 'Pro wireless controller with customizable paddles and trigger stops.' },
    { name: 'Mechanical Gaming Pad', category: 'Gaming', price: 59.99, stock: 65, rating: 4.0, description: 'RGB gaming mouse pad with low-friction surface and built-in lighting.' },
    { name: 'Gaming Headset 7.1', category: 'Gaming', price: 89.99, stock: 42, rating: 4.1, description: 'Surround sound gaming headset with noise-cancelling microphone.' },
    { name: 'Smart Hub Home', category: 'Home', price: 129.99, stock: 20, rating: 4.2, description: 'Smart home hub that controls lights, locks and security cameras via voice.' },
    { name: 'Smart Bulb Color 2-Pack', category: 'Home', price: 34.99, stock: 100, rating: 4.3, description: 'Color-changing smart bulbs with app control and voice assistant support.' },
    { name: 'Robot Vacuum V8', category: 'Home', price: 399.99, stock: 11, rating: 4.4, description: 'Robot vacuum with laser mapping, self-empty dock and mopping function.' },
    { name: 'Air Purifier Pro', category: 'Home', price: 249.99, stock: 15, rating: 4.5, description: 'HEPA air purifier with real-time air quality monitor for large rooms.' },
    { name: 'Smart Doorbell HD', category: 'Home', price: 179.99, stock: 24, rating: 4.1, description: 'Video doorbell with 2K HD, night vision and two-way audio.' },
];
const usersData = [
    {
        firstName: 'System',
        lastName: 'Administrator',
        email: 'admin@example.com',
        password: 'Admin123!',
        role: 'ADMIN',
        phone: '+15550001111',
    },
    {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice@example.com',
        password: 'Alice123!',
        role: 'CUSTOMER',
        phone: '+15550002222',
        address: { street: '123 Maple Street', city: 'Springfield', state: 'IL', zipCode: '62701' },
    },
    {
        firstName: 'Bob',
        lastName: 'Smith',
        email: 'bob@example.com',
        password: 'Bob123!',
        role: 'CUSTOMER',
        phone: '+15550003333',
        address: { street: '456 Oak Avenue', city: 'Riverside', state: 'CA', zipCode: '92501' },
    },
    {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'John123!',
        role: 'CUSTOMER',
        phone: '+15550004444',
        address: { street: '789 Pine Road', city: 'Austin', state: 'TX', zipCode: '73301' },
    },
];
const orderAddressFor = (user) => ({
    firstName: user.firstName,
    lastName: user.lastName,
    street: user.address?.street || '123 Main Street',
    city: user.address?.city || 'Springfield',
    zipCode: user.address?.zipCode || '00000',
    phone: user.phone || '+15550000000',
});
const seed = async () => {
    await mongoose_1.default.connect(config_1.default.mongodbUri);
    logger_1.default.info('Connected to MongoDB for seeding');
    const shouldWipe = process.argv.includes('--wipe');
    if (shouldWipe) {
        logger_1.default.info('Wiping existing data...');
        await Promise.all([
            User_1.default.deleteMany({}),
            Product_1.default.deleteMany({}),
            Category_1.default.deleteMany({}),
            Order_1.default.deleteMany({}),
            Payment_1.default.deleteMany({}),
            SecurityEvent_1.default.deleteMany({}),
        ]);
    }
    const existingUsers = await User_1.default.countDocuments();
    const existingCategories = await Category_1.default.countDocuments();
    const existingProducts = await Product_1.default.countDocuments();
    if (existingUsers > 0 && !shouldWipe) {
        logger_1.default.info(`Database already has ${existingUsers} users. Use --wipe to reset.`);
        await mongoose_1.default.disconnect();
        return;
    }
    logger_1.default.info('Creating categories...');
    const categories = {};
    for (const cat of categoriesData) {
        const created = await Category_1.default.create(cat);
        categories[cat.name] = created;
        logger_1.default.info(`  + Category ${cat.name}`);
    }
    logger_1.default.info('Creating products...');
    const products = {};
    for (const prod of productsData) {
        const imgName = prod.name.replace(/[^a-zA-Z0-9]/g, '');
        const image = `https://placehold.co/300x300?text=${imgName}`;
        const created = await Product_1.default.create({
            name: prod.name,
            description: prod.description,
            price: prod.price,
            category: categories[prod.category]._id,
            stock: prod.stock,
            rating: prod.rating,
            image,
            isActive: true,
        });
        products[prod.name] = created;
        logger_1.default.info(`  + Product ${prod.name}`);
    }
    logger_1.default.info('Creating users...');
    const users = {};
    for (const u of usersData) {
        const user = await User_1.default.create({
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            passwordHash: u.password,
            role: u.role,
            phone: u.phone,
            isActive: true,
            lastLoginAt: new Date(Date.now() - Math.floor(Math.random() * 72) * 3600 * 1000),
            address: u.address || { street: '', city: '', state: '', zipCode: '' },
        });
        users[u.email] = user;
        await SecurityEvent_1.default.create({
            eventType: SecurityEvent_1.SecurityEventType.USER_CREATED,
            userId: user._id,
            ip: '127.0.0.1',
            userAgent: 'seed-script',
            details: JSON.stringify({ email: u.email, role: u.role }),
            severity: 'LOW',
        });
        logger_1.default.info(`  + User ${u.email} (${u.role})`);
    }
    logger_1.default.info('Creating demo orders...');
    const orderSeeds = [
        {
            user: users['alice@example.com'],
            items: [
                { product: products['UltraBook Pro 14'], qty: 1 },
                { product: products['Wireless Mouse'], qty: 1 },
                { product: products['Mechanical Keyboard'], qty: 1 },
            ],
            status: 'DELIVERED',
            paymentStatus: 'COMPLETED',
            createdAt: new Date(Date.now() - 45 * 24 * 3600 * 1000),
        },
        {
            user: users['alice@example.com'],
            items: [
                { product: products['Smartphone X1'], qty: 1 },
            ],
            status: 'SHIPPED',
            paymentStatus: 'COMPLETED',
            createdAt: new Date(Date.now() - 6 * 24 * 3600 * 1000),
        },
        {
            user: users['alice@example.com'],
            items: [
                { product: products['Wireless Earbuds'], qty: 2 },
                { product: products['Power Bank 20000'], qty: 1 },
            ],
            status: 'PENDING',
            paymentStatus: 'PENDING',
            createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000),
        },
        {
            user: users['bob@example.com'],
            items: [
                { product: products['Gaming Console Z'], qty: 1 },
                { product: products['Gaming Headset 7.1'], qty: 1 },
            ],
            status: 'DELIVERED',
            paymentStatus: 'COMPLETED',
            createdAt: new Date(Date.now() - 60 * 24 * 3600 * 1000),
        },
        {
            user: users['bob@example.com'],
            items: [
                { product: products['4K Monitor 27"'], qty: 1 },
                { product: products['USB-C Dock Station'], qty: 1 },
            ],
            status: 'PROCESSING',
            paymentStatus: 'COMPLETED',
            createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
        },
        {
            user: users['bob@example.com'],
            items: [
                { product: products['Robot Vacuum V8'], qty: 1 },
                { product: products['Smart Bulb Color 2-Pack'], qty: 3 },
            ],
            status: 'PENDING',
            paymentStatus: 'FAILED',
            createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
        },
        {
            user: users['bob@example.com'],
            items: [
                { product: products['Action Camera Go 5'], qty: 1 },
            ],
            status: 'CANCELLED',
            paymentStatus: 'REFUNDED',
            createdAt: new Date(Date.now() - 20 * 24 * 3600 * 1000),
        },
    ];
    for (const seedOrder of orderSeeds) {
        const orderItems = seedOrder.items.map((item) => ({
            productId: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.qty,
            image: item.product.image,
        }));
        const subtotal = orderItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
        const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
        const total = subtotal + shipping;
        const order = await Order_1.default.create({
            userId: seedOrder.user._id,
            items: orderItems,
            subtotal,
            shipping,
            total,
            status: seedOrder.status,
            paymentStatus: seedOrder.paymentStatus,
            address: orderAddressFor(seedOrder.user),
            createdAt: seedOrder.createdAt,
        });
        const paymentStatuses = {
            COMPLETED: 'COMPLETED',
            PENDING: 'PENDING',
            FAILED: 'FAILED',
            REFUNDED: 'REFUNDED',
        };
        await Payment_1.default.create({
            orderId: order._id,
            userId: seedOrder.user._id,
            amount: total,
            method: seedOrder.paymentStatus === 'FAILED' ? 'CREDIT_CARD' : 'PAYPAL',
            status: paymentStatuses[seedOrder.paymentStatus],
            transactionReference: (0, helpers_1.generateTransactionReference)(),
            createdAt: seedOrder.createdAt,
        });
        logger_1.default.info(`  + Order ${order._id} for ${seedOrder.user.email} (${seedOrder.status})`);
    }
    logger_1.default.info('Adding initial security events...');
    const bootEvents = [
        { eventType: SecurityEvent_1.SecurityEventType.LOGIN_SUCCESS, user: users['admin@example.com'], sev: 'LOW', details: 'initial admin login seed' },
        { eventType: SecurityEvent_1.SecurityEventType.LOGIN_SUCCESS, user: users['alice@example.com'], sev: 'LOW', details: 'initial alice login seed' },
        { eventType: SecurityEvent_1.SecurityEventType.LOGIN_SUCCESS, user: users['bob@example.com'], sev: 'LOW', details: 'initial bob login seed' },
        { eventType: SecurityEvent_1.SecurityEventType.FORBIDDEN_ACCESS, user: undefined, sev: 'HIGH', details: 'simulated unauthorized admin attempt seed' },
        { eventType: SecurityEvent_1.SecurityEventType.RATE_LIMIT_EXCEEDED, user: undefined, sev: 'HIGH', details: 'simulated brute force attempt seed' },
    ];
    for (const ev of bootEvents) {
        await SecurityEvent_1.default.create({
            eventType: ev.eventType,
            userId: ev.user?._id,
            ip: '127.0.0.1',
            userAgent: 'seed-script',
            details: JSON.stringify({ note: ev.details }),
            severity: ev.sev,
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 5) * 24 * 3600 * 1000),
        });
    }
    logger_1.default.info({
        message: 'Seed completed',
        counts: {
            categories: categoriesData.length,
            products: productsData.length,
            users: usersData.length,
            orders: orderSeeds.length,
        },
    });
    await mongoose_1.default.disconnect();
};
seed()
    .then(() => {
    console.log('Seed data created successfully.');
})
    .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map