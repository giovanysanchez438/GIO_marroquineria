import { useSearch, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useMemo } from "react";

const categories = [
  { value: "", label: "Todos" },
  { value: "bolsos-dama", label: "Bolsos Dama" },
  { value: "billeteras-hombre", label: "Billeteras Hombre" },
  { value: "accesorios", label: "Accesorios" },
];

export default function Catalog() {
  const searchString = useSearch();
  const [, navigate] = useLocation();
  const params = useMemo(() => new URLSearchParams(searchString), [searchString]);
  const activeCategory = params.get("cat") || "";

  const { data: products, isLoading } = trpc.products.list.useQuery(
    activeCategory ? { category: activeCategory } : undefined
  );

  const categoryTitle = categories.find(c => c.value === activeCategory)?.label || "Todos los Productos";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="py-16 bg-cream">
        <div className="container text-center">
          <div className="w-12 h-px mx-auto mb-6" style={{ background: "oklch(0.75 0.12 85)" }} />
          <h1 className="text-3xl md:text-5xl font-bold text-navy tracking-wide mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {categoryTitle}
          </h1>
          <p className="text-sm text-navy/50" style={{ fontFamily: "'Inter', sans-serif" }}>
            {products?.length ?? 0} producto{(products?.length ?? 0) !== 1 ? "s" : ""}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-white border-b border-gold/10">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => navigate(cat.value ? `/catalogo?cat=${cat.value}` : "/catalogo")}
                className={`px-5 py-2 text-xs tracking-[0.15em] uppercase transition-all ${
                  activeCategory === cat.value
                    ? "bg-navy text-white"
                    : "bg-transparent text-navy/60 hover:text-navy border border-navy/15 hover:border-navy/30"
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-white flex-1">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-cream rounded-sm" />
                  <div className="mt-4 h-4 bg-cream rounded w-3/4" />
                  <div className="mt-2 h-5 bg-cream rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(p => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  price={Number(p.price)}
                  images={p.images}
                  category={p.category}
                  stock={p.stock}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-navy/40 text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                No hay productos disponibles en esta categoría.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
