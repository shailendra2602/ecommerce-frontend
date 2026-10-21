import { useState } from "react";
import ProductCard from "../components/ProductCard";
import products from "../data/products";

function Products() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="products-page">

      <h1>All Products</h1>

      {/* Search */}

      <div className="products-controls">

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          className="product-search"
        />

        {/* Category */}

        <select
          value={category}
          onChange={(event) =>
            setCategory(event.target.value)
          }
          className="category-select"
        >
          {categories.map((item) => (
            <option
              value={item}
              key={item}
            >
              {item}
            </option>
          ))}
        </select>

      </div>


      {/* Products */}

      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <h2>No products found</h2>

          <p>
            Try another product name or category.
          </p>
        </div>
      ) : (
        <div className="products">

          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}

        </div>
      )}

    </div>
  );
}

export default Products;