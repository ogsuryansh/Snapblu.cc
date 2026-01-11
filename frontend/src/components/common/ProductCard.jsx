import { ShoppingCart, Package } from 'lucide-react';
import Button from './Button';

const ProductCard = ({ product, onPurchase, purchasing }) => {
    return (
        <div className="card hover:border-gray-600 transition-all duration-200 group flex flex-col h-full">
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
            <div className="p-4 flex flex-col flex-1">
                <div className="mb-3">
                    <h3 className="font-semibold text-white mb-1 line-clamp-2">
                        {product.name}
                    </h3>
                    <p className="text-xs text-blue-400 font-bold uppercase">{product.category || 'LOG'}</p>
                </div>

                {product.description && (
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {product.description}
                    </p>
                )}

                <div className="mt-auto">
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Price</span>
                            <span className="text-green-400 font-bold text-lg">${product.price}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Availability</span>
                            <span className="badge bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                INSTANT
                            </span>
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        icon={ShoppingCart}
                        className="w-full"
                        onClick={() => onPurchase(product._id)}
                        disabled={purchasing || product.isSold}
                    >
                        {purchasing ? 'Processing...' : 'Purchase Now'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
