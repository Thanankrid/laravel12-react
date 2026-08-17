import BootstrapLayout from "@/Layouts/BootstrapLayout";
import React, { useState, useEffect } from "react";

const ProductManager = ({p}) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        setProducts(p);
    }, []);

    // Handle delete product
    const deleteProduct = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const response = await fetch(`/api/product/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    // Remove the product from the state after successful deletion
                    setProducts(products.filter((product) => product.id !== id));
                    alert("Product deleted successfully.");
                } else {
                    console.error("Failed to delete product");
                }
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };


    return (
        <BootstrapLayout>
            <div className="container my-4">
                <h1>Product Manager</h1>
                <a href="product/create" className="btn btn-primary my-2" >
                    <i className="bi bi-plus-lg"></i> Add Product
                </a>
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {products.map((item, index) => (
                        <div className="col" key={item.id}>
                            <div className="card h-100">
                                <div style={{ position : "relative" }}>
                                    <img
                                        src={item.image}
                                        className="card-img-top"
                                        alt="..."
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title"><a href={`/product/${item.id}/edit`} className="stretched-link">{item.name}</a></h5>
                                        <p className="card-text">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                                
                                <button className="btn btn-danger" onClick={() => deleteProduct(item.id)}>
                                    <i className="bi bi-trash"></i> Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </BootstrapLayout>
    );
};

export default ProductManager;