import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  getAllProducts, getFeaturedProducts, getProductById,
  getAllProductsAdmin, createProduct, updateProduct, deleteProduct,
  createOrder, getOrderById, getOrderByNumber, getAllOrders, updateOrderStatus, decrementStock
} from "./db";
import { notifyOwner } from "./_core/notification";
import { nanoid } from "nanoid";

// Admin guard middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Acceso restringido a administradores." });
  return next({ ctx });
});

// ─── Products Router ─────────────────────────────────────────────────────────
const productsRouter = router({
  list: publicProcedure
    .input(z.object({ category: z.string().optional() }).optional())
    .query(async ({ input }) => {
      return getAllProducts(input?.category);
    }),

  featured: publicProcedure.query(async () => {
    return getFeaturedProducts();
  }),

  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const product = await getProductById(input.id);
      if (!product) throw new TRPCError({ code: "NOT_FOUND", message: "Producto no encontrado." });
      return product;
    }),

  // Admin procedures
  adminList: adminProcedure.query(async () => {
    return getAllProductsAdmin();
  }),

  create: adminProcedure
    .input(z.object({
      sku: z.string().min(1).max(20),
      name: z.string().min(1).max(200),
      description: z.string().optional(),
      category: z.enum(["bolsos-dama", "billeteras-hombre", "accesorios"]),
      price: z.number().positive(),
      stock: z.number().int().min(0),
      images: z.array(z.string()).optional(),
      featured: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      await createProduct({
        sku: input.sku,
        name: input.name,
        description: input.description ?? null,
        category: input.category,
        price: input.price.toFixed(2),
        stock: input.stock,
        images: input.images ?? [],
        featured: input.featured ? 1 : 0,
        active: 1,
      });
      return { success: true };
    }),

  update: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).max(200).optional(),
      description: z.string().optional(),
      category: z.enum(["bolsos-dama", "billeteras-hombre", "accesorios"]).optional(),
      price: z.number().positive().optional(),
      stock: z.number().int().min(0).optional(),
      images: z.array(z.string()).optional(),
      featured: z.boolean().optional(),
      active: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, price, featured, active, ...rest } = input;
      const updateData: Record<string, any> = { ...rest };
      if (price !== undefined) updateData.price = price.toFixed(2);
      if (featured !== undefined) updateData.featured = featured ? 1 : 0;
      if (active !== undefined) updateData.active = active ? 1 : 0;
      await updateProduct(id, updateData);
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteProduct(input.id);
      return { success: true };
    }),
});

// ─── Orders Router ────────────────────────────────────────────────────────────
const ordersRouter = router({
  create: publicProcedure
    .input(z.object({
      customerName: z.string().min(1),
      customerEmail: z.string().email(),
      customerPhone: z.string().optional(),
      customerAddress: z.string().optional(),
      items: z.array(z.object({
        productId: z.number(),
        productName: z.string(),
        productSku: z.string(),
        quantity: z.number().int().positive(),
        unitPrice: z.number().positive(),
      })),
    }))
    .mutation(async ({ input }) => {
      const total = input.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      const orderNumber = `GIO-${Date.now()}-${nanoid(4).toUpperCase()}`;

      const order = await createOrder(
        {
          orderNumber,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone ?? null,
          customerAddress: input.customerAddress ?? null,
          total: total.toFixed(2),
          status: "pending",
        },
        input.items.map(item => ({
          orderId: 0, // will be set in createOrder
          productId: item.productId,
          productName: item.productName,
          productSku: item.productSku,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toFixed(2),
          subtotal: (item.unitPrice * item.quantity).toFixed(2),
        }))
      );

      return { orderId: order.id, orderNumber: order.orderNumber, total };
    }),

  byNumber: publicProcedure
    .input(z.object({ orderNumber: z.string() }))
    .query(async ({ input }) => {
      const order = await getOrderByNumber(input.orderNumber);
      if (!order) throw new TRPCError({ code: "NOT_FOUND", message: "Orden no encontrada." });
      return order;
    }),

  confirmPayment: publicProcedure
    .input(z.object({
      orderId: z.number(),
      stripePaymentIntentId: z.string(),
    }))
    .mutation(async ({ input }) => {
      await updateOrderStatus(input.orderId, "paid", input.stripePaymentIntentId);
      const order = await getOrderById(input.orderId);
      if (order) {
        // Notify owner
        const itemsList = order.items.map(i => `• ${i.productName} (x${i.quantity}) - $${Number(i.subtotal).toLocaleString("es-CO")}`).join("\n");
        await notifyOwner({
          title: `🛍️ Nueva compra #${order.orderNumber}`,
          content: `**Nueva orden recibida en G·I·O Marroquinería**\n\n**Cliente:** ${order.customerName}\n**Email:** ${order.customerEmail}\n**Teléfono:** ${order.customerPhone || "No indicado"}\n**Dirección:** ${order.customerAddress || "No indicada"}\n\n**Productos:**\n${itemsList}\n\n**Total: $${Number(order.total).toLocaleString("es-CO")} COP**\n\n**Stripe ID:** ${input.stripePaymentIntentId}`,
        });
        // Decrement stock
        for (const item of order.items) {
          await decrementStock(item.productId, item.quantity);
        }
      }
      return { success: true };
    }),

  adminList: adminProcedure.query(async () => {
    return getAllOrders();
  }),

  adminUpdateStatus: adminProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["pending", "paid", "shipped", "delivered", "cancelled"]),
    }))
    .mutation(async ({ input }) => {
      await updateOrderStatus(input.id, input.status);
      return { success: true };
    }),
});

// ─── App Router ───────────────────────────────────────────────────────────────
export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  products: productsRouter,
  orders: ordersRouter,
});

export type AppRouter = typeof appRouter;
