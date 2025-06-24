import { motion, AnimatePresence } from "framer-motion";

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const modal = {
  hidden: { y: "-100vh", opacity: 0 },
  visible: { y: "0", opacity: 1, transition: { delay: 0.1 } }
};

const ProductModal = ({ product, onClose }) => {
  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            variants={modal}
            className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={product.image} alt={product.name} className="w-full rounded mb-4" />
            <h2 className="text-xl font-bold mb-2">{product.name}</h2>
            <p className="text-blue-600 font-semibold mb-2">Rp {product.price.toLocaleString()}</p>
            <p className="text-gray-700 mb-4">{product.description}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Tutup
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
