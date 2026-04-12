import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2, Package } from "lucide-react";

export default function OrderConfirmation() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { data: order, isLoading } = trpc.orders.byNumber.useQuery({ orderNumber: orderNumber || "" });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-16 flex-1">
        <div className="max-w-2xl mx-auto text-center">
          {isLoading ? (
            <div className="animate-pulse text-navy/30 py-20">Cargando orden...</div>
          ) : order ? (
            <>
              <CheckCircle2 size={64} className="mx-auto mb-6 text-green-500" />
              <h1 className="text-3xl md:text-4xl font-bold text-navy tracking-wide mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Pedido Confirmado
              </h1>
              <p className="text-sm text-navy/50 mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                Gracias por tu compra en G·I·O Marroquinería
              </p>

              <div className="bg-white p-8 rounded-sm border border-gold/10 text-left mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <Package size={20} className="text-gold" />
                  <h3 className="text-lg font-semibold text-navy" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Detalles del Pedido
                  </h3>
                </div>

                <div className="space-y-3 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <div className="flex justify-between">
                    <span className="text-navy/50">Número de orden</span>
                    <span className="font-medium text-navy">{order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-navy/50">Estado</span>
                    <span className="font-medium text-green-600 uppercase text-xs tracking-wider">
                      {order.status === "paid" ? "Pagado" : order.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-navy/50">Cliente</span>
                    <span className="text-navy">{order.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-navy/50">Email</span>
                    <span className="text-navy">{order.customerEmail}</span>
                  </div>
                </div>

                <div className="h-px w-full my-6" style={{ background: "oklch(0.75 0.12 85 / 0.2)" }} />

                <div className="space-y-3">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-navy/70">{item.productName} <span className="text-navy/30">x{item.quantity}</span></span>
                      <span className="font-medium text-navy">${Number(item.subtotal).toLocaleString("es-CO")}</span>
                    </div>
                  ))}
                </div>

                <div className="h-px w-full my-6" style={{ background: "oklch(0.75 0.12 85 / 0.2)" }} />

                <div className="flex justify-between text-lg">
                  <span className="font-medium text-navy" style={{ fontFamily: "'Inter', sans-serif" }}>Total</span>
                  <span className="font-bold text-navy" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    ${Number(order.total).toLocaleString("es-CO")} COP
                  </span>
                </div>
              </div>

              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 px-8 py-3 bg-navy text-white text-sm tracking-[0.15em] uppercase hover:bg-navy-light transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Seguir comprando
              </Link>
            </>
          ) : (
            <div className="py-20">
              <p className="text-navy/40 text-lg">Orden no encontrada</p>
              <Link href="/" className="text-gold hover:underline text-sm mt-4 inline-block">Volver al inicio</Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
