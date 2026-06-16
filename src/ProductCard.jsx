import {
  Card,
  CardContent,
  CardFooter,
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Eye, ShoppingCart } from "lucide-react";

const ProductCard = ({ product, onOpen, onBuy }) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative overflow-hidden">
        <div className="aspect-[4/3] overflow-hidden bg-muted sm:aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>
      </div>

      <CardContent className="p-4 sm:p-5">
        <h3 className="font-semibold text-sm sm:text-base leading-tight line-clamp-2">
          {product.name}
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        <p className="mt-2 sm:mt-3 text-base sm:text-lg font-bold tracking-tight">
          Rp {product.price.toLocaleString()}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 sm:p-5 sm:pt-0 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpen}
          className="flex-1 text-xs sm:text-sm"
        >
          <Eye className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Detail
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={onBuy}
          className="flex-1 text-xs sm:text-sm"
        >
          <ShoppingCart className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Beli
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
