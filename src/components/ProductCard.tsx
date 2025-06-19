import { useState } from "react";

interface ProductCardProps {
    defaultImage: string;
    hoverImage: string;
    title?: string;
    productName?: string;
    price?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
    defaultImage,
    hoverImage,
    title = "NEW",
    productName,
    price
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-xl dark:shadow-gray-900/50 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative overflow-hidden aspect-[4/5] bg-gray-100 dark:bg-gray-700">
                {/* Default Image */}
                <img
                    src={defaultImage}
                    alt={productName || "Product"}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out ${isHovered ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
                        }`}
                />

                {/* Hover Image */}
                <img
                    src={hoverImage}
                    alt={`${productName || "Product"} - alternate view`}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                        }`}
                />

                {/* Badge */}
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full shadow-sm ${title === 'SALE'
                            ? 'bg-red-500 text-white'
                            : title === 'LIMITED'
                                ? 'bg-orange-500 text-white'
                                : title === 'TRENDING'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-black dark:bg-white text-white dark:text-black'
                        }`}>
                        {title}
                    </span>
                </div>

                {/* Add to Bag button - appears on hover */}
                <div className={`absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 transition-all duration-300 ease-out ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                    <button className="w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-black dark:text-white font-medium py-2.5 px-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-black hover:dark:bg-white hover:text-white hover:dark:text-black transition-all duration-200 shadow-lg text-sm sm:text-base">
                        Add to Bag
                    </button>
                </div>

                {/* Quick View Icon */}
                <div className={`absolute top-2 right-2 sm:top-3 sm:right-3 transition-all duration-300 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                    }`}>
                    <button className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors">
                        <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 text-sm sm:text-base leading-tight">
                    {productName || "Product Name"}
                </h3>
                <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    {price || "$0.00"}
                </p>

                {/* Color Options */}
                <div className="flex space-x-1 mt-2">
                    <div className="w-4 h-4 rounded-full bg-black border border-gray-300 dark:border-gray-600"></div>
                    <div className="w-4 h-4 rounded-full bg-gray-500 border border-gray-300 dark:border-gray-600"></div>
                    <div className="w-4 h-4 rounded-full bg-blue-500 border border-gray-300 dark:border-gray-600"></div>
                </div>
            </div>
        </div>
    );
};
export default ProductCard;
