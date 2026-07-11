import { useState } from "react";
import { products } from "../data/products";
import type { Product } from "../data/products";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  onTryOn: (product: Product) => void;
  tryonLoading?: boolean;
}

const ProductGrid = ({ onTryOn, tryonLoading = false }: ProductGridProps) => {

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="mt-10">

      <h2 className="text-3xl font-bold mb-6">
        Available Dresses
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            selected={selectedProduct?.id === product.id}
            onSelect={setSelectedProduct}
          />
        ))}

      </div>
      {selectedProduct && (
        <div className="mt-8 p-4 rounded-lg bg-blue-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">
              Selected Dress
            </h3>
            <p className="mt-1 text-gray-700">
              {selectedProduct.name}
            </p>
          </div>

          <button
            onClick={() => onTryOn(selectedProduct)}
            disabled={tryonLoading}
            className={`bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition ${
              tryonLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {tryonLoading ? "Processing Try-On..." : "Try On"}
          </button>
        </div>
      )}

    </div>
  );
};

export default ProductGrid;