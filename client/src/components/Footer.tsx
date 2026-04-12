import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-navy text-white/80">
      {/* Golden separator */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, oklch(0.75 0.12 85), transparent)" }} />

      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-3xl font-bold tracking-[0.15em] text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              G<span style={{ color: "oklch(0.75 0.12 85)" }}>·</span>I<span style={{ color: "oklch(0.75 0.12 85)" }}>·</span>O
            </h3>
            <p className="text-sm tracking-[0.2em] uppercase mb-4" style={{ color: "oklch(0.75 0.12 85)" }}>Marroquinería</p>
            <p className="text-sm leading-relaxed text-white/60">
              Artesanía en cuero de alta gama. Cada pieza es única, elaborada con los más finos materiales y técnicas artesanales colombianas.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase mb-6" style={{ color: "oklch(0.75 0.12 85)" }}>Navegación</h4>
            <ul className="space-y-3">
              <li><Link href="/catalogo" className="text-sm text-white/60 hover:text-white transition-colors">Catálogo completo</Link></li>
              <li><Link href="/catalogo?cat=bolsos-dama" className="text-sm text-white/60 hover:text-white transition-colors">Bolsos para Dama</Link></li>
              <li><Link href="/catalogo?cat=billeteras-hombre" className="text-sm text-white/60 hover:text-white transition-colors">Billeteras para Hombre</Link></li>
              <li><Link href="/catalogo?cat=accesorios" className="text-sm text-white/60 hover:text-white transition-colors">Accesorios</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase mb-6" style={{ color: "oklch(0.75 0.12 85)" }}>Contacto</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li>Colombia</li>
              <li>info@giomarroquineria.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} G·I·O Marroquinería. Todos los derechos reservados.
          </p>
          <p className="text-xs text-white/40">
            Artesanía colombiana de alta gama
          </p>
        </div>
      </div>
    </footer>
  );
}
