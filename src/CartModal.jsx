import { useState } from "react";
import {
  Trash2,
  Wallet,
  QrCode,
  CheckCircle2,
  Printer,
  ChevronLeft,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./components/ui/sheet";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Separator } from "./components/ui/separator";
import { cn } from "./lib/utils";

const STEPS = { CART: "cart", CHECKOUT: "checkout", PAYMENT: "payment", INVOICE: "invoice" };

const PAYMENT_METHODS = [
  { id: "cash", label: "Tunai", icon: Wallet, desc: "Bayar di tempat dengan uang tunai" },
  { id: "qris", label: "QRIS", icon: QrCode, desc: "Scan QR code untuk pembayaran" },
];

function generateOrderId() {
  return "INV/" + Date.now().toString(36).toUpperCase() + "/" + Math.random().toString(36).substring(2, 6).toUpperCase();
}

function formatDate() {
  return new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const CartModal = ({ isOpen, onClose, cart, onRemove, onCheckout }) => {
  const [step, setStep] = useState(STEPS.CART);
  const [form, setForm] = useState({ nama: "", alamat: "", email: "" });
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [qrPaid, setQrPaid] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const reset = () => {
    setStep(STEPS.CART);
    setForm({ nama: "", alamat: "", email: "" });
    setErrors({});
    setPaymentMethod(null);
    setInvoice(null);
    setQrPaid(false);
  };

  const handleClose = (open) => {
    if (!open) {
      reset();
      onClose();
    }
  };

  const handleInput = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.nama.trim()) newErrors.nama = "Nama harus diisi";
    if (!form.email.trim()) newErrors.email = "Email harus diisi";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Email tidak valid";
    if (!form.alamat.trim()) newErrors.alamat = "Alamat harus diisi";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setStep(STEPS.PAYMENT);
  };

  const handlePay = () => {
    const inv = {
      id: generateOrderId(),
      date: formatDate(),
      customer: form,
      items: [...cart],
      total,
      paymentMethod: PAYMENT_METHODS.find((p) => p.id === paymentMethod),
    };
    setInvoice(inv);
    setStep(STEPS.INVOICE);
  };

  const handleFinish = () => {
    onCheckout();
    reset();
  };

  const stepTitle = {
    [STEPS.CART]: "Keranjang Belanja",
    [STEPS.CHECKOUT]: "Checkout",
    [STEPS.PAYMENT]: "Pilih Pembayaran",
    [STEPS.INVOICE]: "Invoice",
  };

  const stepNumber = Object.values(STEPS).indexOf(step);

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="flex flex-col gap-0 p-0">
        <SheetHeader className="px-4 pt-4 pb-3 border-b sm:px-6 sm:pt-6 sm:pb-4">
          <div className="flex items-center gap-3">
            {step !== STEPS.CART && (
              <button
                onClick={() => {
                  if (step === STEPS.CHECKOUT) setStep(STEPS.CART);
                  else if (step === STEPS.PAYMENT) setStep(STEPS.CHECKOUT);
                  else if (step === STEPS.INVOICE) {
                    setStep(STEPS.PAYMENT);
                    setInvoice(null);
                  }
                }}
                className="p-1 -ml-1 rounded-md hover:bg-accent transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <SheetTitle className="text-base sm:text-lg">{stepTitle[step]}</SheetTitle>
          </div>
          {step !== STEPS.INVOICE && (
            <div className="flex gap-1.5 mt-3">
              {Object.values(STEPS).filter((s) => s !== STEPS.INVOICE).map((s, i) => (
                <div
                  key={s}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-colors",
                    i <= stepNumber ? "bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>
          )}
        </SheetHeader>

        {step === STEPS.CART && (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <ShoppingBag className="h-12 w-12 mb-3 opacity-40" />
                  <p className="text-sm">Keranjang kosong</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {cart.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-start gap-3 rounded-lg border p-3 sm:p-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Rp {item.price.toLocaleString()} x {item.qty}
                        </p>
                        <p className="text-sm font-semibold mt-1">
                          Rp {(item.price * item.qty).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemove(item.id)}
                        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t p-4 pb-4 sm:p-6 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-lg sm:text-xl font-bold">
                  Rp {total.toLocaleString()}
                </span>
              </div>
              <Button
                className="w-full"
                size="lg"
                disabled={cart.length === 0}
                onClick={() => setStep(STEPS.CHECKOUT)}
              >
                Lanjut ke Checkout
              </Button>
            </div>
          </>
        )}

        {step === STEPS.CHECKOUT && (
          <form
            onSubmit={handleSubmitForm}
            className="flex flex-1 flex-col gap-0"
          >
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 sm:px-6">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap</Label>
                <Input
                  id="nama"
                  name="nama"
                  value={form.nama}
                  onChange={handleInput}
                  placeholder="Masukkan nama"
                  className={errors.nama ? "border-destructive" : ""}
                />
                {errors.nama && (
                  <p className="text-xs text-destructive">{errors.nama}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleInput}
                  placeholder="contoh@email.com"
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="alamat">Alamat Lengkap</Label>
                <textarea
                  id="alamat"
                  name="alamat"
                  value={form.alamat}
                  onChange={handleInput}
                  rows={3}
                  placeholder="Jl. Contoh No. 123, Kota"
                  className={cn(
                    "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none",
                    errors.alamat && "border-destructive"
                  )}
                />
                {errors.alamat && (
                  <p className="text-xs text-destructive">{errors.alamat}</p>
                )}
              </div>
            </div>

            <div className="border-t p-4 pb-safe space-y-3 sm:p-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Belanja</span>
                <span className="font-semibold">Rp {total.toLocaleString()}</span>
              </div>
              <Button type="submit" className="w-full" size="lg">
                Konfirmasi & Pilih Pembayaran
              </Button>
            </div>
          </form>
        )}

        {step === STEPS.PAYMENT && (
          <div className="flex flex-1 flex-col gap-0">
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 sm:px-6">
              <div className="rounded-lg border bg-muted/30 p-3 sm:p-4 space-y-1">
                <p className="text-xs text-muted-foreground">Ringkasan Pesanan</p>
                <p className="text-sm font-medium truncate">{form.nama}</p>
                <p className="text-sm">
                  Total: <span className="font-bold">Rp {total.toLocaleString()}</span>
                </p>
              </div>

              <p className="text-sm font-medium">Metode Pembayaran</p>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const selected = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={cn(
                        "w-full flex items-start gap-3 sm:gap-4 rounded-lg border p-3 sm:p-4 text-left transition-all",
                        selected
                          ? "border-primary ring-1 ring-primary bg-primary/5"
                          : "hover:bg-accent"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full transition-colors",
                          selected ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}
                      >
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{method.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {method.desc}
                        </p>
                      </div>
                      {selected && (
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {paymentMethod === "qris" && (
                <div className="rounded-lg border bg-muted/20 p-4 sm:p-6 text-center space-y-3">
                  <div className="mx-auto w-36 h-36 sm:w-48 sm:h-48 bg-white rounded-lg p-2 shadow-sm flex items-center justify-center">
                    <QrCode className="w-full h-full text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Scan QR Code</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Scan QRIS di atas menggunakan aplikasi pembayaran
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQrPaid(true)}
                  >
                    Saya Sudah Bayar
                  </Button>
                  {qrPaid && (
                    <p className="text-xs text-emerald-600 font-medium flex items-center justify-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Pembayaran terkonfirmasi
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="border-t p-4 pb-4 space-y-2 sm:p-6">
              <Button
                className="w-full"
                size="lg"
                disabled={
                  !paymentMethod ||
                  (paymentMethod === "qris" && !qrPaid)
                }
                onClick={handlePay}
              >
                {paymentMethod === "cash" ? "Konfirmasi Pembayaran Tunai" : "Konfirmasi Pembayaran QRIS"}
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setStep(STEPS.CHECKOUT)}
              >
                Kembali
              </Button>
            </div>
          </div>
        )}

        {step === STEPS.INVOICE && invoice && (
          <div className="flex flex-1 flex-col gap-0">
            <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
              <div className="text-center mb-6 space-y-1">
                <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                </div>
                <p className="text-base sm:text-lg font-bold">Pembayaran Berhasil!</p>
                <p className="text-xs text-muted-foreground">
                  Terima kasih, {invoice.customer.nama}
                </p>
              </div>

              <div className="rounded-lg border p-3 sm:p-4 space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground shrink-0">No. Invoice</span>
                  <span className="text-xs font-mono font-medium truncate text-right">{invoice.id}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground shrink-0">Tanggal</span>
                  <span className="text-xs text-right">{invoice.date}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground shrink-0">Pembayaran</span>
                  <span className="text-xs font-medium flex items-center gap-1">
                    <invoice.paymentMethod.icon className="h-3.5 w-3.5 shrink-0" />
                    {invoice.paymentMethod.label}
                  </span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground">Detail Pesanan</p>
                {invoice.items.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Rp {item.price.toLocaleString()} x {item.qty}
                      </p>
                    </div>
                    <p className="text-sm font-semibold shrink-0">
                      Rp {(item.price * item.qty).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm gap-2">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>Rp {invoice.total.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm gap-2">
                  <span className="text-muted-foreground">Biaya Layanan</span>
                  <span>Rp 0</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-base font-bold gap-2">
                  <span>Total Dibayar</span>
                  <span>Rp {invoice.total.toLocaleString()}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="rounded-lg bg-muted/30 p-3 space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Data Pembeli</p>
                <p className="text-sm">{invoice.customer.nama}</p>
                <p className="text-xs text-muted-foreground truncate">{invoice.customer.email}</p>
                <p className="text-xs text-muted-foreground">{invoice.customer.alamat}</p>
              </div>
            </div>

            <div className="border-t p-4 pb-4 space-y-2 sm:p-6">
              <Button className="w-full" size="lg" onClick={handleFinish}>
                Selesai
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.print()}
              >
                <Printer className="mr-2 h-4 w-4" />
                Cetak Invoice
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

function ShoppingBag(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

export default CartModal;
