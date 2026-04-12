import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Package, ShoppingCart, X, Save, Loader2, Upload } from "lucide-react";
import { getLoginUrl } from "@/const";

const categoryOptions = [
  { value: "bolsos-dama", label: "Bolsos Dama" },
  { value: "billeteras-hombre", label: "Billeteras Hombre" },
  { value: "accesorios", label: "Accesorios" },
];

interface ProductForm {
  sku: string;
  name: string;
  description: string;
  category: string;
  price: string;
  stock: string;
  images: string[];
  featured: boolean;
}

const emptyForm: ProductForm = {
  sku: "", name: "", description: "", category: "bolsos-dama",
  price: "", stock: "0", images: [], featured: false,
};

export default function Admin() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const utils = trpc.useUtils();
  const { data: products, isLoading } = trpc.products.adminList.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });
  const { data: orders } = trpc.orders.adminList.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });
  const createProduct = trpc.products.create.useMutation({ onSuccess: () => utils.products.adminList.invalidate() });
  const updateProduct = trpc.products.update.useMutation({ onSuccess: () => utils.products.adminList.invalidate() });
  const deleteProduct = trpc.products.delete.useMutation({ onSuccess: () => utils.products.adminList.invalidate() });

  const [tab, setTab] = useState<"products" | "orders">("products");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [uploading, setUploading] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin text-navy/30" size={32} /></div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
          <p className="text-navy/50">Debes iniciar sesión para acceder al panel de administración.</p>
          <a href={getLoginUrl()} className="px-6 py-3 bg-navy text-white text-sm tracking-[0.15em] uppercase">Iniciar sesión</a>
        </div>
        <Footer />
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <p className="text-navy/50">No tienes permisos de administrador.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); };
  const openEdit = (p: any) => {
    setForm({
      sku: p.sku, name: p.name, description: p.description || "",
      category: p.category, price: String(Number(p.price)),
      stock: String(p.stock), images: p.images || [], featured: p.featured === 1,
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await response.json();
        if (data.url) {
          setForm(prev => ({ ...prev, images: [...prev.images, data.url] }));
        }
      }
      toast.success("Imagen(es) subida(s) exitosamente.");
    } catch {
      toast.error("Error al subir imagen.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx: number) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleSave = async () => {
    if (!form.sku || !form.name || !form.price) {
      toast.error("SKU, nombre y precio son obligatorios.");
      return;
    }
    try {
      if (editingId) {
        await updateProduct.mutateAsync({
          id: editingId, name: form.name, description: form.description,
          category: form.category as any, price: Number(form.price),
          stock: Number(form.stock), images: form.images, featured: form.featured,
        });
        toast.success("Producto actualizado.");
      } else {
        await createProduct.mutateAsync({
          sku: form.sku, name: form.name, description: form.description,
          category: form.category as any, price: Number(form.price),
          stock: Number(form.stock), images: form.images, featured: form.featured,
        });
        toast.success("Producto creado.");
      }
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.message || "Error al guardar.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Desactivar este producto?")) return;
    await deleteProduct.mutateAsync({ id });
    toast.success("Producto desactivado.");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Panel de Administración
          </h1>
          <p className="text-sm text-navy/40 mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
            Gestiona productos y órdenes de G·I·O Marroquinería
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gold/10">
          <button
            onClick={() => setTab("products")}
            className={`flex items-center gap-2 px-4 py-3 text-sm tracking-[0.1em] uppercase border-b-2 transition-colors ${
              tab === "products" ? "border-navy text-navy" : "border-transparent text-navy/40 hover:text-navy/60"
            }`}
          >
            <Package size={16} /> Productos
          </button>
          <button
            onClick={() => setTab("orders")}
            className={`flex items-center gap-2 px-4 py-3 text-sm tracking-[0.1em] uppercase border-b-2 transition-colors ${
              tab === "orders" ? "border-navy text-navy" : "border-transparent text-navy/40 hover:text-navy/60"
            }`}
          >
            <ShoppingCart size={16} /> Órdenes
          </button>
        </div>

        {/* Products Tab */}
        {tab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-navy/50">{products?.length ?? 0} productos</p>
              <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 bg-navy text-white text-xs tracking-[0.1em] uppercase hover:bg-navy-light transition-colors">
                <Plus size={14} /> Nuevo producto
              </button>
            </div>

            {/* Product Form Modal */}
            {showForm && (
              <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                <div className="bg-white rounded-sm max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-navy" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {editingId ? "Editar Producto" : "Nuevo Producto"}
                    </h3>
                    <button onClick={() => setShowForm(false)} className="text-navy/30 hover:text-navy"><X size={20} /></button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-navy/50 mb-1">SKU *</label>
                        <input value={form.sku} onChange={e => setForm(p => ({ ...p, sku: e.target.value }))} disabled={!!editingId}
                          className="w-full px-3 py-2 border border-navy/15 rounded-sm text-sm disabled:bg-gray-50" />
                      </div>
                      <div>
                        <label className="block text-xs text-navy/50 mb-1">Categoría</label>
                        <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                          className="w-full px-3 py-2 border border-navy/15 rounded-sm text-sm">
                          {categoryOptions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-navy/50 mb-1">Nombre *</label>
                      <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-navy/15 rounded-sm text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-navy/50 mb-1">Descripción</label>
                      <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                        rows={3} className="w-full px-3 py-2 border border-navy/15 rounded-sm text-sm resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-navy/50 mb-1">Precio (COP) *</label>
                        <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                          className="w-full px-3 py-2 border border-navy/15 rounded-sm text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs text-navy/50 mb-1">Stock</label>
                        <input type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))}
                          className="w-full px-3 py-2 border border-navy/15 rounded-sm text-sm" />
                      </div>
                    </div>

                    {/* Images */}
                    <div>
                      <label className="block text-xs text-navy/50 mb-2">Imágenes ({form.images.length})</label>
                      {form.images.length > 0 && (
                        <div className="mb-4 p-3 bg-navy/5 rounded-sm">
                          <p className="text-xs text-navy/40 mb-3">Galería (primera es la portada):</p>
                          <div className="grid grid-cols-4 gap-2">
                            {form.images.map((img, i) => (
                              <div key={i} className="relative group">
                                <div className="aspect-square rounded-sm overflow-hidden border-2 border-navy/10 hover:border-gold transition-colors">
                                  <img src={img} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                                  {i === 0 && <div className="absolute top-1 left-1 bg-gold text-white text-xs px-1.5 py-0.5 rounded-sm">Portada</div>}
                                </div>
                                <button onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" title="Eliminar foto">
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <label className="inline-flex items-center gap-2 px-4 py-2 border border-dashed border-navy/20 rounded-sm text-xs text-navy/50 hover:border-navy/40 cursor-pointer">
                        <Upload size={14} /> {uploading ? "Subiendo..." : "Subir imagen"}
                        <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                      </label>
                      <div className="mt-2">
                        <label className="block text-xs text-navy/40 mb-1">O pegar URL de imagen:</label>
                        <div className="flex gap-2">
                          <input
                            id="imageUrlInput"
                            type="text"
                            placeholder="https://..."
                            className="flex-1 px-3 py-2 border border-navy/15 rounded-sm text-xs"
                          />
                          <button
                            onClick={() => {
                              const input = document.getElementById("imageUrlInput") as HTMLInputElement;
                              if (input.value.trim()) {
                                setForm(p => ({ ...p, images: [...p.images, input.value.trim()] }));
                                input.value = "";
                              }
                            }}
                            className="px-3 py-2 bg-navy text-white text-xs rounded-sm"
                          >
                            Agregar
                          </button>
                        </div>
                      </div>
                    </div>

                    <label className="flex items-center gap-2 text-sm text-navy/60">
                      <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} />
                      Producto destacado (aparece en la página principal)
                    </label>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 border border-navy/15 text-sm text-navy/60 hover:bg-gray-50">
                      Cancelar
                    </button>
                    <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-navy text-white text-sm hover:bg-navy-light">
                      <Save size={14} /> {editingId ? "Actualizar" : "Crear"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Products Table */}
            <div className="bg-white rounded-sm border border-gold/10 overflow-x-auto">
              <table className="w-full text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                <thead>
                  <tr className="border-b border-gold/10">
                    <th className="text-left px-4 py-3 text-xs tracking-wider uppercase text-navy/40 font-medium">SKU</th>
                    <th className="text-left px-4 py-3 text-xs tracking-wider uppercase text-navy/40 font-medium">Producto</th>
                    <th className="text-left px-4 py-3 text-xs tracking-wider uppercase text-navy/40 font-medium">Categoría</th>
                    <th className="text-right px-4 py-3 text-xs tracking-wider uppercase text-navy/40 font-medium">Precio</th>
                    <th className="text-right px-4 py-3 text-xs tracking-wider uppercase text-navy/40 font-medium">Stock</th>
                    <th className="text-right px-4 py-3 text-xs tracking-wider uppercase text-navy/40 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map(p => (
                    <tr key={p.id} className={`border-b border-gold/5 ${p.active === 0 ? "opacity-40" : ""}`}>
                      <td className="px-4 py-3 text-navy/50">{p.sku}</td>
                      <td className="px-4 py-3 font-medium text-navy">{p.name}</td>
                      <td className="px-4 py-3 text-navy/50">
                        {categoryOptions.find(c => c.value === p.category)?.label}
                      </td>
                      <td className="px-4 py-3 text-right text-navy">${Number(p.price).toLocaleString("es-CO")}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={p.stock <= 0 ? "text-red-500" : "text-navy"}>{p.stock}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEdit(p)} className="p-1.5 text-navy/30 hover:text-navy"><Pencil size={14} /></button>
                          <button onClick={() => handleDelete(p.id)} className="p-1.5 text-navy/30 hover:text-red-500"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === "orders" && (
          <div className="bg-white rounded-sm border border-gold/10 overflow-x-auto">
            <table className="w-full text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              <thead>
                <tr className="border-b border-gold/10">
                  <th className="text-left px-4 py-3 text-xs tracking-wider uppercase text-navy/40 font-medium">Orden</th>
                  <th className="text-left px-4 py-3 text-xs tracking-wider uppercase text-navy/40 font-medium">Cliente</th>
                  <th className="text-left px-4 py-3 text-xs tracking-wider uppercase text-navy/40 font-medium">Email</th>
                  <th className="text-right px-4 py-3 text-xs tracking-wider uppercase text-navy/40 font-medium">Total</th>
                  <th className="text-center px-4 py-3 text-xs tracking-wider uppercase text-navy/40 font-medium">Estado</th>
                  <th className="text-right px-4 py-3 text-xs tracking-wider uppercase text-navy/40 font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {orders && orders.length > 0 ? orders.map((o: any) => (
                  <tr key={o.id} className="border-b border-gold/5">
                    <td className="px-4 py-3 font-medium text-navy">{o.orderNumber}</td>
                    <td className="px-4 py-3 text-navy/70">{o.customerName}</td>
                    <td className="px-4 py-3 text-navy/50">{o.customerEmail}</td>
                    <td className="px-4 py-3 text-right text-navy">${Number(o.total).toLocaleString("es-CO")}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 text-[10px] tracking-wider uppercase rounded-sm ${
                        o.status === "paid" ? "bg-green-50 text-green-600" :
                        o.status === "pending" ? "bg-yellow-50 text-yellow-600" :
                        o.status === "shipped" ? "bg-blue-50 text-blue-600" :
                        o.status === "delivered" ? "bg-green-50 text-green-700" :
                        "bg-red-50 text-red-500"
                      }`}>
                        {o.status === "paid" ? "Pagado" : o.status === "pending" ? "Pendiente" :
                         o.status === "shipped" ? "Enviado" : o.status === "delivered" ? "Entregado" : "Cancelado"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-navy/40 text-xs">
                      {new Date(o.createdAt).toLocaleDateString("es-CO")}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-navy/30">No hay órdenes aún.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
