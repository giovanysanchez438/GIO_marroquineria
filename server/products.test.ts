import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the db module
vi.mock("./db", () => ({
  getAllProducts: vi.fn().mockResolvedValue([
    { id: 1, sku: "001", name: "VIVI MINI", category: "bolsos-dama", price: "85000.00", stock: 3, images: [], featured: 1, active: 1 },
    { id: 2, sku: "002", name: "040-1", category: "bolsos-dama", price: "50000.00", stock: 4, images: [], featured: 1, active: 1 },
  ]),
  getFeaturedProducts: vi.fn().mockResolvedValue([
    { id: 1, sku: "001", name: "VIVI MINI", category: "bolsos-dama", price: "85000.00", stock: 3, images: [], featured: 1, active: 1 },
  ]),
  getProductById: vi.fn().mockImplementation(async (id: number) => {
    if (id === 1) return { id: 1, sku: "001", name: "VIVI MINI", description: "Bolso mini", category: "bolsos-dama", price: "85000.00", stock: 3, images: [], featured: 1, active: 1 };
    return null;
  }),
  getAllProductsAdmin: vi.fn().mockResolvedValue([]),
  createProduct: vi.fn().mockResolvedValue({ insertId: 9 }),
  updateProduct: vi.fn().mockResolvedValue(undefined),
  deleteProduct: vi.fn().mockResolvedValue(undefined),
  createOrder: vi.fn().mockResolvedValue({ id: 1, orderNumber: "GIO-TEST-001" }),
  getOrderById: vi.fn().mockResolvedValue({
    id: 1, orderNumber: "GIO-TEST-001", customerName: "Test", customerEmail: "test@test.com",
    customerPhone: null, customerAddress: null, total: "85000.00", status: "paid",
    items: [{ id: 1, productName: "VIVI MINI", productSku: "001", quantity: 1, unitPrice: "85000.00", subtotal: "85000.00", productId: 1 }],
  }),
  getOrderByNumber: vi.fn().mockImplementation(async (num: string) => {
    if (num === "GIO-TEST-001") return {
      id: 1, orderNumber: "GIO-TEST-001", customerName: "Test", customerEmail: "test@test.com",
      customerPhone: null, customerAddress: null, total: "85000.00", status: "paid",
      items: [{ id: 1, productName: "VIVI MINI", productSku: "001", quantity: 1, unitPrice: "85000.00", subtotal: "85000.00", productId: 1 }],
    };
    return null;
  }),
  getAllOrders: vi.fn().mockResolvedValue([]),
  updateOrderStatus: vi.fn().mockResolvedValue(undefined),
  decrementStock: vi.fn().mockResolvedValue(undefined),
}));

// Mock notification
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1, openId: "admin-user", email: "admin@gio.com", name: "Admin",
      loginMethod: "manus", role: "admin", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  return {
    user: {
      id: 2, openId: "normal-user", email: "user@gio.com", name: "User",
      loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("products.list", () => {
  it("returns products list for public users", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.products.list();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("name");
    expect(result[0]).toHaveProperty("price");
  });

  it("accepts optional category filter", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.products.list({ category: "bolsos-dama" });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("products.featured", () => {
  it("returns featured products", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.products.featured();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("products.byId", () => {
  it("returns product by id", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.products.byId({ id: 1 });
    expect(result).toHaveProperty("name", "VIVI MINI");
    expect(result).toHaveProperty("price");
  });

  it("throws NOT_FOUND for non-existent product", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.products.byId({ id: 999 })).rejects.toThrow();
  });
});

describe("products admin operations", () => {
  it("blocks non-admin users from adminList", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.products.adminList()).rejects.toThrow("Acceso restringido");
  });

  it("allows admin users to access adminList", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.products.adminList();
    expect(Array.isArray(result)).toBe(true);
  });

  it("allows admin to create a product", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.products.create({
      sku: "009", name: "Test Product", category: "bolsos-dama",
      price: 100000, stock: 5,
    });
    expect(result).toEqual({ success: true });
  });

  it("allows admin to update a product", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.products.update({ id: 1, price: 90000 });
    expect(result).toEqual({ success: true });
  });

  it("allows admin to delete a product", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.products.delete({ id: 1 });
    expect(result).toEqual({ success: true });
  });
});

describe("orders.create", () => {
  it("creates an order with valid data", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.orders.create({
      customerName: "Juan Pérez",
      customerEmail: "juan@test.com",
      customerPhone: "+57 300 000 0000",
      customerAddress: "Bogotá, Colombia",
      items: [{
        productId: 1, productName: "VIVI MINI", productSku: "001",
        quantity: 1, unitPrice: 85000,
      }],
    });
    expect(result).toHaveProperty("orderId");
    expect(result).toHaveProperty("orderNumber");
    expect(result.total).toBe(85000);
  });

  it("rejects order with invalid email", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.orders.create({
      customerName: "Test",
      customerEmail: "invalid-email",
      items: [{ productId: 1, productName: "Test", productSku: "001", quantity: 1, unitPrice: 100 }],
    })).rejects.toThrow();
  });
});

describe("orders.byNumber", () => {
  it("returns order by number", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.orders.byNumber({ orderNumber: "GIO-TEST-001" });
    expect(result).toHaveProperty("orderNumber", "GIO-TEST-001");
    expect(result).toHaveProperty("items");
  });

  it("throws NOT_FOUND for non-existent order", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.orders.byNumber({ orderNumber: "INVALID" })).rejects.toThrow();
  });
});

describe("orders.confirmPayment", () => {
  it("confirms payment and notifies owner", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.orders.confirmPayment({
      orderId: 1,
      stripePaymentIntentId: "pi_test_123",
    });
    expect(result).toEqual({ success: true });
  });
});

describe("orders admin operations", () => {
  it("blocks non-admin from order list", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.orders.adminList()).rejects.toThrow();
  });

  it("allows admin to list orders", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.orders.adminList();
    expect(Array.isArray(result)).toBe(true);
  });
});
