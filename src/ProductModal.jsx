import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog";
import { Button } from "./components/ui/button";

const ProductModal = ({ product, onClose }) => {
  return (
    <Dialog open={!!product} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="pr-6 text-base sm:text-lg">
            {product?.name}
          </DialogTitle>
          <DialogDescription>
            Rp {product?.price?.toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        {product && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg bg-muted -mx-2 sm:mx-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full max-h-64 sm:max-h-80 object-cover"
              />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>
            <p className="text-xl sm:text-2xl font-bold">
              Rp {product.price.toLocaleString()}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
