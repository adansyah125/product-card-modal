import { motion } from "framer-motion";

const ProductCard = ({ product, onOpen, onBuy }) => {
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 flex flex-col"
    >
      <div className="w-full h-48 overflow-hidden rounded-xl mb-4 bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
        />
      </div>

      <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
      <p className="text-blue-600 font-bold text-sm mb-4">
        Rp {product.price.toLocaleString()}
      </p>

      <div className="flex gap-2 mt-auto">
        <button
          onClick={onOpen}
          className="flex-1 cursor-pointer bg-gray-200 hover:bg-gray-300 text-sm py-2 rounded-lg transition"
        >
          Lihat Detail
        </button>
        <button
          onClick={onBuy}
          className="flex-1 cursor-pointer bg-green-500 hover:bg-green-600 text-white text-sm py-2 rounded-lg transition shadow-sm"
        >
          Beli
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
