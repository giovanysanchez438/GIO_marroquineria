import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import productos from "../productos.json"; // Importar los productos del Excel

export default function Catalog() {
  return (
    <div className="min-h-screen flex flex-col bg-cream/30">
      <Navbar />
      <main className="flex-grow container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-navy mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Nuestro Catálogo
          </h1>
          <div className="w-24 h-px bg-gold mx-auto mb-4" />
          <p className="text-navy/60 uppercase tracking-widest text-sm">Artesanía en Cuero G·I·O</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map((p: any) => (
            <ProductCard 
              key={p.id} 
              id={p.id}
              name={p.name}
              price={p.price}
              images={p.images}
              category={p.category}
              stock={p.stock}
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
