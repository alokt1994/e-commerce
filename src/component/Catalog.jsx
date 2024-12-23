import React, { useEffect, useState } from "react";
import "./Catalog.css";

export const Catalog = () => {
  const [products, setProducts] = useState([]); // Product list from API
  const [cart, setCart] = useState([]); // Cart state
  const [isCartOpen, setIsCartOpen] = useState(false); // State for cart modal visibility
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const productsPerPage = 10; // Number of products per page

  // Fetch products from API
  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products))
      .catch((err) => console.error(err));
  }, []);

  // Add product to cart
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const isProductInCart = prevCart.find((item) => item.id === product.id);
      if (isProductInCart) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Increment product quantity
  const handleIncrementQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrement product quantity
  const handleDecrementQuantity = (productId) => {
    setCart(
      (prevCart) =>
        prevCart
          .map((item) =>
            item.id === productId
              ? { ...item, quantity: Math.max(item.quantity - 1, 0) }
              : item
          )
          .filter((item) => item.quantity > 0) // Remove item if quantity becomes 0
    );
  };

  // Remove product from cart
  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Open or close the cart modal
  const toggleCartModal = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <h1>Catalog Page</h1>

      {/* Add to Cart Button with Cart Count */}
      <div className="cart-button" onClick={toggleCartModal}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png"
          alt="Cart"
          className="cart-icon"
        />
        <span className="cart-count">{cart.length}</span>
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {currentProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="product-image"
            />
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <button
              onClick={() => handleAddToCart(product)}
              className="add-to-cart-button"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`pagination-button ${
              currentPage === index + 1 ? "active" : ""
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="cart-modal">
          <div className="cart-modal-content">
            <h2>Shopping Cart</h2>
            {cart.length > 0 ? (
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>{item.title}</td>
                      <td>
                        <button
                          onClick={() => handleDecrementQuantity(item.id)}
                          className="quantity-button"
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          onClick={() => handleIncrementQuantity(item.id)}
                          className="quantity-button"
                        >
                          +
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Your cart is empty.</p>
            )}
            <button onClick={toggleCartModal} className="close-cart-button">
              Close Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
