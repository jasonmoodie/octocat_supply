import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isCartOpen, closeCart } =
    useCart();
  const { darkMode } = useTheme();

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
        className={`fixed top-0 right-0 h-full w-full max-w-md z-50 flex flex-col shadow-2xl transition-transform duration-300 ${
          darkMode ? 'bg-gray-900 text-light' : 'bg-white text-gray-800'
        } ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <h2 className="text-xl font-bold">
            Shopping Cart
            {totalItems > 0 && (
              <span className="ml-2 text-sm font-normal text-primary">({totalItems} items)</span>
            )}
          </h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className={`p-2 rounded-full transition-colors ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-grow overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-16 w-16 mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className={`text-lg font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Your cart is empty
              </p>
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Add items from the store to get started.
              </p>
            </div>
          ) : (
            items.map(({ product, quantity }) => {
              const effectivePrice =
                product.discount != null && product.discount > 0
                  ? product.price * (1 - product.discount)
                  : product.price;
              return (
                <div
                  key={product.productId}
                  className={`flex items-center gap-4 rounded-lg p-3 ${
                    darkMode ? 'bg-gray-800' : 'bg-gray-50'
                  }`}
                >
                  <img
                    src={`/${product.imgName}`}
                    alt={product.name}
                    className="w-16 h-16 object-contain rounded-md flex-shrink-0"
                  />
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold truncate">{product.name}</p>
                    <p className="text-primary font-bold">${effectivePrice.toFixed(2)}</p>
                    {/* Quantity controls */}
                    <div
                      className={`flex items-center space-x-2 mt-2 ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-200'
                      } rounded-lg p-1 w-fit`}
                    >
                      <button
                        onClick={() => updateQuantity(product.productId, quantity - 1)}
                        aria-label={`Decrease quantity of ${product.name}`}
                        className={`w-7 h-7 flex items-center justify-center ${
                          darkMode ? 'text-light' : 'text-gray-700'
                        } hover:text-primary transition-colors`}
                      >
                        <span aria-hidden="true">-</span>
                      </button>
                      <span
                        className={`min-w-[1.5rem] text-center text-sm ${
                          darkMode ? 'text-light' : 'text-gray-800'
                        }`}
                        aria-label={`Quantity: ${quantity}`}
                      >
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.productId, quantity + 1)}
                        aria-label={`Increase quantity of ${product.name}`}
                        className={`w-7 h-7 flex items-center justify-center ${
                          darkMode ? 'text-light' : 'text-gray-700'
                        } hover:text-primary transition-colors`}
                      >
                        <span aria-hidden="true">+</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      ${(effectivePrice * quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(product.productId)}
                      aria-label={`Remove ${product.name} from cart`}
                      className={`text-xs transition-colors ${
                        darkMode ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            className={`px-6 py-4 border-t space-y-4 ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">${totalPrice.toFixed(2)}</span>
            </div>
            <button
              className="w-full bg-primary hover:bg-accent text-white py-3 rounded-lg font-semibold transition-colors"
              aria-label="Proceed to checkout"
            >
              Checkout
            </button>
            <button
              onClick={clearCart}
              className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                darkMode
                  ? 'text-gray-400 hover:text-red-400'
                  : 'text-gray-500 hover:text-red-500'
              }`}
              aria-label="Clear cart"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
