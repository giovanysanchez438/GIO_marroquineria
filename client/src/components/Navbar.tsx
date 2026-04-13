import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu, X, Settings } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const [location] = useLocation();

  const navLinks = [
    { href: "/catalogo", label: "Catálogo" },
    { href: "/catalogo?cat=bolsos-dama", label: "Bolsos Dama" },
    { href: "/catalogo?cat=billeteras-hombre", label: "Billeteras Hombre" },
    { href: "/catalogo?cat=accesorios", label: "Accesorios" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gold/20">
      {/* Top bar */}
      <div className="bg-navy text-center py-1.5 px-4">
        <p className="text-xs tracking-[0.25em] uppercase" style={{ color: "oklch(0.75 0.12 85)" }}>
          Artesanía en cuero de alta gama &mdash; Envíos a todo Colombia
        </p>
      </div>

      <nav className="container flex items-center justify-between py-4">
        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 text-navy"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menú"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-[0.15em] text-navy" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            G<span className="text-gold mx-0.5">·</span>I<span className="text-gold mx-0.5">·</span>O
          </h1>
          <span className="hidden sm:block text-xs tracking-[0.2em] uppercase text-gold ml-2 mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
            Marroquinería
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm tracking-[0.1em] uppercase text-navy/70 hover:text-navy transition-colors font-medium"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-3">
          {/* Botón directo al Panel de Administración */}
          <Link href="/admin" className="p-2 text-navy/70 hover:text-navy transition-colors" title="Administración">
            <Settings size={20} />
          </Link>
          
          <Link href="/carrito" className="relative p-2 text-navy/70 hover:text-navy transition-colors">
            <ShoppingBag size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-navy text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gold/20 bg-white">
          <div className="container py-4 space-y-3">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm tracking-[0.1em] uppercase text-navy/70 hover:text-navy py-2 font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
