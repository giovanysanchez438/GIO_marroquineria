import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import { ShoppingBag, ChevronLeft, Minus, Plus, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='700' fill='%23f5f0e8'%3E%3Crect width='600' height='700'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23c4a87c' font-family='serif' font-size='24'%3ESin imagen%3C/text%3E%3C/svg%3E";

const categoryLabels: Record<string, string> = {
  "bolsos-dama": "Bolsos Dama",
  "billeteras-hombre": "Billeteras Hombre",
  "accesorios": "Accesorios",
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = trpc.products.byId.useQuery({ id: Number(id) });
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-navy/30">Cargando...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-navy/50 text-lg">Producto no encontrado</p>
          <Link href="/catalogo" className="text-gold hover:underline text-sm">Volver al catálogo</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images && (product.images as string[]).length > 0 ? product.images as string[] : [PLACEHOLDER];
  const outOfStock = product.stock <= 0;

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: Number(product.price),
      image: images[0] || PLACEHOLDER,
    }, quantity);
    setAdded(true);
    toast.success(`${product.name} agregado al carrito`);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-8">
        {/* Breadcrumb */}
        <Link href="/catalogo" className="inline-flex items-center gap-1 text-sm text-navy/50 hover:text-navy transition-colors mb-8">
          <ChevronLeft size={16} /> Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <ProductGallery images={images} productName={product.name} placeholder={PLACEHOLDER} />

          {/* Product Info */}
          <div className="flex flex-col">
            <span className="text-xs tracking-[0.2em] uppercase text-gold mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
              {categoryLabels[product.category] || product.category}
            </span>

            <h1 className="text-3xl md:text-4xl font-bold text-navy tracking-wide mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {product.name}
            </h1>

            <p className="text-xs text-navy/30 mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
              SKU: {product.sku}
            </p>

            <div className="mb-8">
              <p className="text-3xl font-bold text-navy" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                ${Number(product.price).toLocaleString("es-CO")} <span className="text-base font-normal text-navy/40">COP</span>
              </p>
            </div>

            <div className="h-px w-full mb-8" style={{ background: "oklch(0.75 0.12 85 / 0.3)" }} />

            {product.description && (
              <p className="text-sm text-navy/60 leading-relaxed mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                {product.description}
              </p>
            )}

            {/* Stock */}
            <p className={`text-xs tracking-[0.1em] uppercase mb-6 ${outOfStock ? "text-red-500" : "text-green-600"}`} style={{ fontFamily: "'Inter', sans-serif" }}>
              {outOfStock ? "Agotado" : `${product.stock} disponible${product.stock > 1 ? "s" : ""}`}
            </p>

            {/* Quantity + Add to cart */}
            {!outOfStock && (
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border border-navy/15 rounded-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-navy/50 hover:text-navy transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-3 text-sm font-medium text-navy min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-3 text-navy/50 hover:text-navy transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={added}
                  className="flex-1 flex items-center justify-center gap-3 px-8 py-3.5 bg-navy text-white text-sm tracking-[0.15em] uppercase hover:bg-navy-light transition-colors disabled:opacity-70"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {added ? <><Check size={18} /> Agregado</> : <><ShoppingBag size={18} /> Agregar al carrito</>}
                </button>
              </div>
            )}

            {/* Details */}
            <div className="mt-12 space-y-4">
              <div className="h-px w-full" style={{ background: "oklch(0.75 0.12 85 / 0.2)" }} />
              <div className="flex justify-between text-xs text-navy/40" style={{ fontFamily: "'Inter', sans-serif" }}>
                <span>Material</span>
                <span>Cuero genuino / Pelo natural</span>
              </div>
              <div className="h-px w-full" style={{ background: "oklch(0.75 0.12 85 / 0.2)" }} />
              <div className="flex justify-between text-xs text-navy/40" style={{ fontFamily: "'Inter', sans-serif" }}>
                <span>Origen</span>
                <span>Artesanía colombiana</span>
              </div>
              <div className="h-px w-full" style={{ background: "oklch(0.75 0.12 85 / 0.2)" }} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1" />
      <Footer />
    </div>
  );
}
