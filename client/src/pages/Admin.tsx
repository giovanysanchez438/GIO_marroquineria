import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Trash2, Star, StarOff, Plus, Save } from "lucide-react";
import initialProducts from "../productos.json";

export default function Admin() {
  // Manejo local de productos para simular la base de datos
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "bolsos-dama",
    images: [""],
    stock: "1",
    featured: false
  });

  // Función para alternar si un producto es destacado
  const toggleFeatured = (id: number) => {
    const updatedProducts = products.map(p => 
      p.id === id ? { ...p, featured: !p.featured } : p
    );
    setProducts(updatedProducts);
    toast.success("Estado de destacado actualizado localmente");
    
    // Mostrar en consola para que el usuario pueda copiarlo si quiere
    console.log("Nuevo inventario para productos.json:", JSON.stringify(updatedProducts, null, 2));
  };

  const deleteProduct = (id: number) => {
    if (!confirm("¿Eliminar este producto de la vista previa?")) return;
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    toast.success("Producto eliminado localmente");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productToAdd = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      name: newProduct.name,
      price: parseInt(newProduct.price),
      category: newProduct.category,
      images: [newProduct.images[0]],
      stock: parseInt(newProduct.stock),
      featured: newProduct.featured
    };
    const updatedProducts = [productToAdd, ...products];
    setProducts(updatedProducts);
    setNewProduct({ name: "", price: "", category: "bolsos-dama", images: [""], stock: "1", featured: false });
    toast.success("Producto añadido localmente");
    console.log("Nuevo inventario para productos.json:", JSON.stringify(updatedProducts, null, 2));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow container py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-navy mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Panel de Control G·I·O
            </h1>
            <p className="text-navy/50 text-sm uppercase tracking-widest">Gestión de Inventario y Destacados</p>
          </div>
          <div className="bg-gold/5 border border-gold/20 p-4 rounded-sm max-w-md">
            <p className="text-xs text-navy/70 leading-relaxed">
              <strong>Instrucciones:</strong> Usa este panel para organizar tu tienda. 
              Haz clic en la <strong>estrella</strong> para destacar productos en la página principal. 
              <br/><br/>
              <em>Nota: Para que los cambios sean permanentes en la web, debes actualizar el archivo <code>productos.json</code> en tu PC con los datos que aparecen en la consola.</em>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Formulario */}
          <div className="lg:col-span-1">
            <div className="bg-cream/30 p-6 border border-gold/10 rounded-sm">
              <h2 className="text-xl font-bold text-navy mb-6 flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                <Plus size={20} /> Nuevo Artículo
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-navy/50 mb-1">Nombre</label>
                  <input className="w-full p-3 border border-navy/10 rounded-sm text-sm focus:border-gold outline-none" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-navy/50 mb-1">Precio</label>
                    <input type="number" className="w-full p-3 border border-navy/10 rounded-sm text-sm focus:border-gold outline-none" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-navy/50 mb-1">Stock</label>
                    <input type="number" className="w-full p-3 border border-navy/10 rounded-sm text-sm focus:border-gold outline-none" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-navy/50 mb-1">Categoría</label>
                  <select className="w-full p-3 border border-navy/10 rounded-sm text-sm focus:border-gold outline-none bg-white" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                    <option value="bolsos-dama">Bolsos Dama</option>
                    <option value="billeteras-hombre">Billeteras Hombre</option>
                    <option value="accesorios">Accesorios</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-navy/50 mb-1">URL Imagen (ImgBB)</label>
                  <input className="w-full p-3 border border-navy/10 rounded-sm text-sm focus:border-gold outline-none" value={newProduct.images[0]} onChange={e => setNewProduct({...newProduct, images: [e.target.value]})} required />
                </div>
                <div className="flex items-center gap-3 py-2">
                  <input type="checkbox" id="featured-new" className="w-4 h-4 accent-navy" checked={newProduct.featured} onChange={e => setNewProduct({...newProduct, featured: e.target.checked})} />
                  <label htmlFor="featured-new" className="text-sm text-navy/70 cursor-pointer">Destacar en Inicio</label>
                </div>
                <button type="submit" className="w-full py-4 bg-navy text-white uppercase tracking-[0.2em] text-xs font-bold hover:bg-gold transition-all">
                  Añadir Producto
                </button>
              </form>
            </div>
          </div>

          {/* Tabla de Inventario */}
          <div className="lg:col-span-2">
            <div className="overflow-x-auto border border-gold/10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-navy text-white">
                    <th className="p-4 text-xs uppercase tracking-widest font-medium">Producto</th>
                    <th className="p-4 text-xs uppercase tracking-widest font-medium">Precio</th>
                    <th className="p-4 text-xs uppercase tracking-widest font-medium text-center">Destacado</th>
                    <th className="p-4 text-xs uppercase tracking-widest font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/5">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-cream/10 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-cream rounded-sm overflow-hidden border border-gold/10">
                            <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-sm font-medium text-navy">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-navy/70">${Number(product.price).toLocaleString()}</td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => toggleFeatured(product.id)}
                          className={`transition-all ${product.featured ? "text-gold scale-110" : "text-navy/10 hover:text-navy/30"}`}
                          title={product.featured ? "Quitar de destacados" : "Marcar como destacado"}
                        >
                          {product.featured ? <Star size={22} fill="currentColor" /> : <StarOff size={22} />}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => deleteProduct(product.id)} className="text-navy/20 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
