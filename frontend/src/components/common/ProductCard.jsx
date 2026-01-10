import { ShoppingCart, Package } from 'lucide-react';
import Button from './Button';

const ProductCard = ({ product }) => {
    return (
        <div className="card hover:border-gray-600 transition-all duration-200 group">
            {/* Product Image */}
            <div className="aspect-square bg-dark-hover flex items-center justify-center p-8 group-hover:bg-dark-border transition-colors">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain"
                    />
                ) : (
                    <Package size={64} className="text-gray-600" />
                )}
            </div>

            {/* Product Info */}
            <div className="p-4">
                <div className="mb-3">
                    <h3 className="font-semibold text-white mb-1 line-clamp-2">
                        {product.name}
                    </h3>
                    <p className="text-xs text-gray-400 uppercase">{product.category}</p>
                </div>

                {product.description && (
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {product.description}
                    </p>
                )}

                <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Price per line</span>
                        <span className="text-white font-semibold">${product.price}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Available stock</span>
                        <span className="badge bg-dark-hover text-white">
                            {product.stock}
                        </span>
                    </div>
                </div>

                <Button
                    variant="secondary"
                    icon={ShoppingCart}
                    className="w-full"
                    disabled={product.stock === 0}
                >
                    Purchase
                </Button>
            </div>
        </div>
    );
};

export default ProductCard;
