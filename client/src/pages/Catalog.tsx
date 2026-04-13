import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

export default function Catalog() {
  // Lista de productos estática para evitar errores de base de datos
  const productos = [
    {
      id: 1,
      name: "Bolso de Cuero Artesanal GIO",
      price: 250000,
      images: ["https://i.ibb.co/JqYxV4R/bolso-cuero-dama-gio.jpg"], // Reemplaza con tu enlace directo de ImgBB
      category: "bolsos-dama",
      stock: 10
    }
    // Para agregar otro producto, copia el bloque de arriba, pégalo aquí y cambia los datos.
  ];

  return (
    <div className="min-h-screen flex flex-col bg-cream/30">
      <Navbar />
      <main className="flex-grow container py-12">
        <h1 className="text-4xl font-bold text-navy mb-8 text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Nuestro Catálogo
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {productos.map(p => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
