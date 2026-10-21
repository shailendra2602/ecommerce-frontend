import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");

  const showToast = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  const addToCart = (product) => {
    setCart((previousCart) => {
      const existingProduct = previousCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return previousCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...previousCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    showToast(`${product.name} added to cart`);
  };

  const increaseQuantity = (productId) => {
    setCart((previousCart) =>
      previousCart.map((product) =>
        product.id === productId
          ? {
              ...product,
              quantity: product.quantity + 1,
            }
          : product
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCart((previousCart) =>
      previousCart
        .map((product) =>
          product.id === productId
            ? {
                ...product,
                quantity: product.quantity - 1,
              }
            : product
        )
        .filter((product) => product.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((previousCart) =>
      previousCart.filter(
        (product) => product.id !== productId
      )
    );

    showToast("Product removed from cart");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        message,
      }}
    >
      {children}

      {message && (
        <div className="toast">
          {message}
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}