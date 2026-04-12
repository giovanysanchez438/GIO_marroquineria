import { Link } from "wouter";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";

export default function Cart() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-12 flex-1">
        <div className="text-center mb-12">
          <div className="w-12 h-px mx-auto mb-6" style={{ background: "oklch(0.75 0.12 85)" }} />
          <h1 className="text-3xl md:text-4xl font-bold text-navy tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Carrito de Compras
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={48} className="mx-auto mb-6 text-navy/20" />
            <p className="text-lg text-navy/40 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Tu carrito está vacío
            </p>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 px-8 py-3 bg-navy text-white text-sm tracking-[0.15em] uppercase hover:bg-navy-light transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Explorar catálogo <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map(item => (
                <div key={item.productId} className="flex gap-5 p-4 bg-white rounded-sm border border-gold/10">
                  <Link href={`/producto/${item.productId}`} className="w-24 h-28 flex-shrink-0 bg-cream rounded-sm overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link href={`/producto/${item.productId}`} className="text-sm font-medium text-navy hover:text-gold transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {item.name}
                      </Link>
                      <p className="text-xs text-navy/30 mt-0.5">SKU: {item.sku}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-navy/10 rounded-sm">
                        <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="px-2.5 py-1.5 text-navy/40 hover:text-navy">
                          <Minus size={14} />
                        </button>
                        <span className="px-3 py-1.5 text-xs font-medium text-navy">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="px-2.5 py-1.5 text-navy/40 hover:text-navy">
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-navy" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        ${(item.price * item.quantity).toLocaleString("es-CO")}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.productId)} className="self-start p-1.5 text-navy/20 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-sm border border-gold/10 sticky top-32">
                <h3 className="text-lg font-semibold text-navy mb-6 tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Resumen del Pedido
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-navy/60" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <span>Productos ({totalItems})</span>
                    <span>${totalPrice.toLocaleString("es-CO")}</span>
                  </div>
                  <div className="flex justify-between text-sm text-navy/60" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <span>Envío</span>
                    <span className="text-gold">Por calcular</span>
                  </div>
                </div>

                <div className="h-px w-full mb-6" style={{ background: "oklch(0.75 0.12 85 / 0.3)" }} />

                <div className="flex justify-between mb-8">
                  <span className="text-sm font-medium text-navy" style={{ fontFamily: "'Inter', sans-serif" }}>Total</span>
                  <span className="text-2xl font-bold text-navy" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    ${totalPrice.toLocaleString("es-CO")} <span className="text-xs font-normal text-navy/40">COP</span>
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full text-center px-8 py-4 bg-navy text-white text-sm tracking-[0.15em] uppercase hover:bg-navy-light transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Proceder al pago
                </Link>

                <Link
                  href="/catalogo"
                  className="block text-center mt-4 text-xs text-navy/40 hover:text-navy transition-colors tracking-[0.1em] uppercase"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Seguir comprando
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
