import { Link } from "wouter";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  images: string[] | null;
  category: string;
  stock: number;
}

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' fill='%23f5f0e8'%3E%3Crect width='400' height='500'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23c4a87c' font-family='serif' font-size='18'%3ESin imagen%3C/text%3E%3C/svg%3E";

const categoryLabels: Record<string, string> = {
  "bolsos-dama": "Bolsos Dama",
  "billeteras-hombre": "Billeteras Hombre",
  "accesorios": "Accesorios",
};

export default function ProductCard({ id, name, price, images, category, stock }: ProductCardProps) {
  const imgSrc = images && images.length > 0 ? images[0] : PLACEHOLDER;
  const outOfStock = stock <= 0;

  return (
    <Link href={`/producto/${id}`} className="group block">
      <div className="relative overflow-hidden bg-cream rounded-sm aspect-[3/4]">
        <img
          src={imgSrc}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {outOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-sm tracking-[0.2em] uppercase font-medium">Agotado</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 bg-white/90 text-navy font-medium rounded-sm">
            {categoryLabels[category] || category}
          </span>
        </div>
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="text-sm tracking-[0.05em] text-navy font-medium group-hover:text-gold transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
          {name}
        </h3>
        <p className="text-lg font-semibold text-navy" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          ${price.toLocaleString("es-CO")} <span className="text-xs font-normal text-navy/50">COP</span>
        </p>
      </div>
    </Link>
  );
}
