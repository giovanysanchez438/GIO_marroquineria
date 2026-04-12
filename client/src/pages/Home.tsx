import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Gem, Shield, Truck } from "lucide-react";

export default function Home() {
  const { data: featured, isLoading } = trpc.products.featured.useQuery();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-cream" style={{ minHeight: "85vh" }}>
        {/* Geometric golden pattern overlay */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, oklch(0.75 0.12 85) 1px, transparent 1px),
            radial-gradient(circle at 80% 50%, oklch(0.75 0.12 85) 1px, transparent 1px),
            linear-gradient(135deg, oklch(0.75 0.12 85) 0.5px, transparent 0.5px),
            linear-gradient(225deg, oklch(0.75 0.12 85) 0.5px, transparent 0.5px)
          `,
          backgroundSize: "120px 120px, 120px 120px, 60px 60px, 60px 60px",
        }} />

        {/* Golden spiral hint */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-[0.04]" style={{
          backgroundImage: `radial-gradient(ellipse at 70% 40%, oklch(0.75 0.12 85) 0%, transparent 70%)`,
        }} />

        <div className="container relative flex flex-col items-center justify-center text-center" style={{ minHeight: "85vh" }}>
          {/* Decorative line */}
          <div className="w-16 h-px mb-8" style={{ background: "oklch(0.75 0.12 85)" }} />

          <p className="text-sm tracking-[0.35em] uppercase mb-6 font-medium" style={{ color: "oklch(0.7 0.12 85)", fontFamily: "'Inter', sans-serif" }}>
            Artesanía colombiana de alta gama
          </p>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[0.08em] text-navy leading-tight mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            G<span className="text-gold">·</span>I<span className="text-gold">·</span>O
          </h1>

          <h2 className="text-xl sm:text-2xl md:text-3xl tracking-[0.3em] uppercase mb-8" style={{ color: "oklch(0.7 0.12 85)", fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>
            Marroquinería
          </h2>

          <p className="max-w-xl text-base text-navy/60 leading-relaxed mb-12" style={{ fontFamily: "'Inter', sans-serif" }}>
            Cada pieza es una obra de arte. Cuero genuino, pelo natural y técnicas artesanales que honran la tradición colombiana con un diseño contemporáneo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/catalogo?cat=bolsos-dama"
              className="px-10 py-4 bg-navy text-white text-sm tracking-[0.2em] uppercase hover:bg-navy-light transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Mujer
            </Link>
            <Link
              href="/catalogo?cat=billeteras-hombre"
              className="px-10 py-4 border-2 text-navy text-sm tracking-[0.2em] uppercase hover:bg-navy hover:text-white transition-colors"
              style={{ borderColor: "oklch(0.25 0.05 260)", fontFamily: "'Inter', sans-serif" }}
            >
              Hombre
            </Link>
          </div>

          {/* Decorative line */}
          <div className="w-16 h-px mt-12" style={{ background: "oklch(0.75 0.12 85)" }} />
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Gem, title: "Cuero Genuino", desc: "Materiales premium seleccionados con los más altos estándares de calidad." },
              { icon: Shield, title: "Artesanía Única", desc: "Cada pieza es elaborada a mano por artesanos colombianos con décadas de experiencia." },
              { icon: Truck, title: "Envío Nacional", desc: "Entregamos a todo Colombia con empaque premium que protege su inversión." },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center rounded-full border" style={{ borderColor: "oklch(0.75 0.12 85 / 0.4)" }}>
                  <item.icon size={24} className="text-gold" />
                </div>
                <h3 className="text-lg font-semibold text-navy mb-3 tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {item.title}
                </h3>
                <p className="text-sm text-navy/50 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-cream">
        <div className="container">
          <div className="text-center mb-16">
            <div className="w-12 h-px mx-auto mb-6" style={{ background: "oklch(0.75 0.12 85)" }} />
            <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-wide mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Colección Destacada
            </h2>
            <p className="text-sm tracking-[0.15em] uppercase text-gold" style={{ fontFamily: "'Inter', sans-serif" }}>
              Piezas seleccionadas de nuestra colección
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-cream-dark rounded-sm" />
                  <div className="mt-4 h-4 bg-cream-dark rounded w-3/4" />
                  <div className="mt-2 h-5 bg-cream-dark rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featured?.map(p => (
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
          )}

          <div className="text-center mt-12">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 text-sm tracking-[0.15em] uppercase text-navy hover:text-gold transition-colors font-medium"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Ver todo el catálogo <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Banner */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Women */}
            <Link href="/catalogo?cat=bolsos-dama" className="group relative overflow-hidden aspect-[4/3] bg-navy rounded-sm flex items-end p-8">
              <div className="absolute inset-0 opacity-[0.08]" style={{
                backgroundImage: `radial-gradient(circle at 30% 70%, oklch(0.75 0.12 85), transparent 60%)`,
              }} />
              <div className="relative z-10">
                <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "oklch(0.75 0.12 85)" }}>Colección</p>
                <h3 className="text-4xl font-bold text-white tracking-wide mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Mujer
                </h3>
                <span className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-white/70 group-hover:text-white transition-colors">
                  Explorar <ArrowRight size={14} />
                </span>
              </div>
            </Link>

            {/* Men */}
            <Link href="/catalogo?cat=billeteras-hombre" className="group relative overflow-hidden aspect-[4/3] rounded-sm flex items-end p-8" style={{ background: "oklch(0.92 0.02 85)" }}>
              <div className="absolute inset-0 opacity-[0.06]" style={{
                backgroundImage: `radial-gradient(circle at 70% 30%, oklch(0.75 0.12 85), transparent 60%)`,
              }} />
              <div className="relative z-10">
                <p className="text-xs tracking-[0.3em] uppercase mb-2 text-gold">Colección</p>
                <h3 className="text-4xl font-bold text-navy tracking-wide mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Hombre
                </h3>
                <span className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-navy/60 group-hover:text-navy transition-colors">
                  Explorar <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
