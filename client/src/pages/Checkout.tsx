import { useState } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Loader2, MessageCircle, Lock } from "lucide-react";

const WHATSAPP_NUMBER = "573123344130";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const [, navigate] = useLocation();
  const createOrder = trpc.orders.create.useMutation();
  const confirmPayment = trpc.orders.confirmPayment.useMutation();

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
  });
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"whatsapp" | "nequi" | null>(null);

  if (items.length === 0) {
    navigate("/carrito");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generateWhatsAppMessage = (orderNumber: string) => {
    const itemsList = items
      .map(i => `• ${i.name} (x${i.quantity}) - $${(i.price * i.quantity).toLocaleString("es-CO")} COP`)
      .join("%0A");

    const message = `*Nuevo Pedido G·I·O Marroquinería*%0A%0A*Número de Orden:* ${orderNumber}%0A%0A*Cliente:* ${form.customerName}%0A*Email:* ${form.customerEmail}%0A*Teléfono:* ${form.customerPhone || "No indicado"}%0A*Dirección:* ${form.customerAddress || "No indicada"}%0A%0A*Productos:%0A${itemsList}%0A%0A*Total: $${totalPrice.toLocaleString("es-CO")} COP*%0A%0A*Método de Pago:* ${paymentMethod === "nequi" ? "Nequi / Daviplata / Transferencia Bancaria" : "Nequi / Daviplata / Transferencia Bancaria"}`;

    return message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.customerEmail || !paymentMethod) {
      toast.error("Por favor completa todos los campos y selecciona un método de pago.");
      return;
    }

    setLoading(true);
    try {
      const order = await createOrder.mutateAsync({
        ...form,
        items: items.map(i => ({
          productId: i.productId,
          productName: i.name,
          productSku: i.sku,
          quantity: i.quantity,
          unitPrice: i.price,
        })),
      });

      // Confirm payment (register order in system)
      await confirmPayment.mutateAsync({
        orderId: order.orderId,
        stripePaymentIntentId: `wa_${order.orderNumber}`,
      });

      // Generate WhatsApp message
      const whatsappMessage = generateWhatsAppMessage(order.orderNumber);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

      clearCart();
      toast.success("Orden creada. Abriendo WhatsApp...");

      // Open WhatsApp in new tab
      window.open(whatsappUrl, "_blank");

      // Redirect to confirmation after a short delay
      setTimeout(() => {
        navigate(`/orden/${order.orderNumber}`);
      }, 1000);
    } catch (err: any) {
      toast.error(err.message || "Error al procesar la orden.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-12 flex-1">
        <div className="text-center mb-12">
          <div className="w-12 h-px mx-auto mb-6" style={{ background: "oklch(0.75 0.12 85)" }} />
          <h1 className="text-3xl md:text-4xl font-bold text-navy tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Finalizar Compra
          </h1>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
            <h3 className="text-lg font-semibold text-navy tracking-wide mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Datos del Comprador
            </h3>

            <div>
              <label className="block text-xs tracking-[0.1em] uppercase text-navy/50 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                Nombre completo *
              </label>
              <input
                type="text"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-navy/15 rounded-sm text-sm text-navy bg-white focus:outline-none focus:border-gold transition-colors"
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label className="block text-xs tracking-[0.1em] uppercase text-navy/50 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                Email *
              </label>
              <input
                type="email"
                name="customerEmail"
                value={form.customerEmail}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-navy/15 rounded-sm text-sm text-navy bg-white focus:outline-none focus:border-gold transition-colors"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-xs tracking-[0.1em] uppercase text-navy/50 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                Teléfono
              </label>
              <input
                type="tel"
                name="customerPhone"
                value={form.customerPhone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-navy/15 rounded-sm text-sm text-navy bg-white focus:outline-none focus:border-gold transition-colors"
                placeholder="+57 300 000 0000"
              />
            </div>

            <div>
              <label className="block text-xs tracking-[0.1em] uppercase text-navy/50 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                Dirección de envío
              </label>
              <textarea
                name="customerAddress"
                value={form.customerAddress}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-navy/15 rounded-sm text-sm text-navy bg-white focus:outline-none focus:border-gold transition-colors resize-none"
                placeholder="Ciudad, dirección completa"
              />
            </div>

            <div className="h-px w-full" style={{ background: "oklch(0.75 0.12 85 / 0.2)" }} />

            {/* Payment Methods */}
            <div className="p-6 bg-cream rounded-sm">
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle size={20} className="text-gold" />
                <h3 className="text-lg font-semibold text-navy tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Método de Pago
                </h3>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border-2 border-gold/30 rounded-sm cursor-pointer hover:bg-white/50 transition-colors" style={{ borderColor: paymentMethod === "whatsapp" ? "oklch(0.75 0.12 85)" : "oklch(0.75 0.12 85 / 0.3)" }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="whatsapp"
                    checked={paymentMethod === "whatsapp"}
                    onChange={() => setPaymentMethod("whatsapp")}
                    className="w-4 h-4 accent-gold"
                  />
                  <div>
                    <p className="text-sm font-semibold text-navy" style={{ fontFamily: "'Inter', sans-serif" }}>WhatsApp + Nequi / Daviplata</p>
                    <p className="text-xs text-navy/50" style={{ fontFamily: "'Inter', sans-serif" }}>Recibe el resumen de tu pedido por WhatsApp y paga por Nequi, Daviplata o transferencia bancaria</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 border-gold/30 rounded-sm cursor-pointer hover:bg-white/50 transition-colors" style={{ borderColor: paymentMethod === "nequi" ? "oklch(0.75 0.12 85)" : "oklch(0.75 0.12 85 / 0.3)" }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="nequi"
                    checked={paymentMethod === "nequi"}
                    onChange={() => setPaymentMethod("nequi")}
                    className="w-4 h-4 accent-gold"
                  />
                  <div>
                    <p className="text-sm font-semibold text-navy" style={{ fontFamily: "'Inter', sans-serif" }}>Transferencia Directa</p>
                    <p className="text-xs text-navy/50" style={{ fontFamily: "'Inter', sans-serif" }}>Transfiere directamente a Nequi, Daviplata o cuenta bancaria. Recibirás los datos por WhatsApp</p>
                  </div>
                </label>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-navy/30">
                <Lock size={12} /> Conexión segura y encriptada
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !paymentMethod}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-navy text-white text-sm tracking-[0.15em] uppercase hover:bg-navy-light transition-colors disabled:opacity-50"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Procesando...</>
              ) : (
                <><MessageCircle size={18} /> Enviar a WhatsApp</>
              )}
            </button>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-sm border border-gold/10 sticky top-32">
              <h3 className="text-lg font-semibold text-navy mb-6 tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Tu Pedido
              </h3>

              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="w-14 h-16 flex-shrink-0 bg-cream rounded-sm overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-navy" style={{ fontFamily: "'Inter', sans-serif" }}>{item.name}</p>
                      <p className="text-xs text-navy/30">x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-navy" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      ${(item.price * item.quantity).toLocaleString("es-CO")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="h-px w-full mb-4" style={{ background: "oklch(0.75 0.12 85 / 0.3)" }} />

              <div className="flex justify-between">
                <span className="text-sm font-medium text-navy" style={{ fontFamily: "'Inter', sans-serif" }}>Total</span>
                <span className="text-xl font-bold text-navy" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  ${totalPrice.toLocaleString("es-CO")} COP
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
