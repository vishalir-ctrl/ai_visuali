import type { Product } from "../data/products";

interface ProductCardProps {
  product: Product;
  selected: boolean;
  onSelect: (product: Product) => void;
}

const ProductCard = ({
  product,
  selected,
  onSelect,
}: ProductCardProps) => {
  return (
   <div
  className={`rounded-xl overflow-hidden shadow-md transition duration-300 h-[450px] flex flex-col ${
    selected
      ? "border-4 border-blue-600"
      : "bg-white hover:shadow-xl"
  }`}
>

      <img
        src={product.image}
  alt={product.name}
  className="w-full h-64 object-contain bg-white p-3"
      />

      <div className="p-4">

        <h2 className="text-xl font-bold">
          {product.name}
        </h2>

        <p className="text-gray-500">
          {product.category}
        </p>

        <p className="text-green-600 font-bold mt-2">
          ₹{product.price}
        </p>

        <button
  onClick={() => onSelect(product)}
  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
>
  {selected ? "Selected" : "Select"}
</button>

      </div>

    </div>
  );
};

export default ProductCard;