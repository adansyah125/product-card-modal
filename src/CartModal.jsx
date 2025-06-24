import { AnimatePresence, motion } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
import { useState } from "react";

const panel = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: { type: "spring", stiffness: 100 } },
  exit: { x: "100%", transition: { duration: 0.25 } },
};

const CartModal = ({ isOpen, onClose, cart, onRemove, onCheckout }) => {
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [form, setForm] = useState({ nama: "", alamat: "", email: "" });

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleInput = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nama || !form.alamat || !form.email) {
      alert("Mohon lengkapi semua data.");
      return;
    }

    alert(`Checkout Berhasil!\nTerima kasih, ${form.nama} 😊`);
    setForm({ nama: "", alamat: "", email: "" });
    setCheckoutMode(false);
    onCheckout();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/30 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel dari kanan */}
          <motion.div
            variants={panel}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-lg p-6 flex flex-col overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {checkoutMode ? "📝 Checkout" : "🛒 Keranjang"}
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-black text-2xl">
                &times;
              </button>
            </div>

            {!checkoutMode ? (
              <>
                {cart.length === 0 ? (
                  <p className="text-gray-500">Keranjang kosong.</p>
                ) : (
                  <ul className="space-y-4">
                    {cart.map((item) => (
                      <li
                        key={item.id}
                        className="flex justify-between items-start border-b pb-2"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                          <p className="text-sm text-blue-600">
                            Rp {(item.price * item.qty).toLocaleString()}
                          </p>
                        </div>
                       <button
  onClick={() => onRemove(item.id)}
  className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm hover:underline transition"
>
  <FiTrash2 className="w-4 h-4" />
  <span>Hapus</span>
</button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-auto pt-6 border-t">
                  <p className="text-lg font-bold">Total: Rp {total.toLocaleString()}</p>
                  <button
                    onClick={() => setCheckoutMode(true)}
                    disabled={cart.length === 0}
                    className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                  >
                    Checkout
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 flex flex-col flex-grow">
  <div className="flex flex-col gap-1">
    <label htmlFor="nama" className="text-sm font-medium text-gray-700">Nama Lengkap</label>
    <input
      type="text"
      id="nama"
      name="nama"
      value={form.nama}
      onChange={handleInput}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      placeholder="Masukkan nama Anda"
    />
  </div>

  <div className="flex flex-col gap-1">
    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
    <input
      type="email"
      id="email"
      name="email"
      value={form.email}
      onChange={handleInput}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      placeholder="contoh@email.com"
    />
  </div>

  <div className="flex flex-col gap-1">
    <label htmlFor="alamat" className="text-sm font-medium text-gray-700">Alamat Lengkap</label>
    <textarea
      id="alamat"
      name="alamat"
      value={form.alamat}
      onChange={handleInput}
      rows={3}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
      placeholder="Jl. Contoh No. 123, Kota"
    ></textarea>
  </div>

  <p className="text-lg font-semibold mt-4">
    Total: <span className="text-blue-600">Rp {total.toLocaleString()}</span>
  </p>

  <button
    type="submit"
    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-semibold shadow"
  >
    Konfirmasi Pembayaran
  </button>

  <button
    type="button"
    onClick={() => setCheckoutMode(false)}
    className="w-full text-gray-600 hover:underline text-sm mt-2"
  >
    Kembali ke Keranjang
  </button>
</form>

            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartModal;
