import BootstrapLayout from "@/Layouts/BootstrapLayout";
import React, { useState, useEffect } from "react";

const ProductOthers = () => {
    const [products, setProducts] = useState([]);

    const loadData = () => {
        fetch( "https://raw.githubusercontent.com/arc6828/laravel-react/refs/heads/main/public/json/products.json" )
            .then((response) =>  response.json() )
            .then((data) => {
                setProducts(data);
            })
            .catch((error) => { console.error( "There was an error fetching the products!", error ); });
    };

    const loadData2 = async () => {
        try {
            const response = await fetch( "https://raw.githubusercontent.com/arc6828/laravel-react/refs/heads/main/public/json/products.json" );            
            const data = await response.json();
            setProducts(data);
        } catch (error) { console.error( "There was an error fetching the products!", error ); }
    };

    useEffect(() => {
        // loadData();
        loadData2();
    }, []);

    return (
        <BootstrapLayout>
            <div className="container my-4">
                <h1>Product List</h1>
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {products.map((item, index) => (
                        <div className="col" key={item.id}>
                            <div className="card h-100">
                                <img
                                    src={item.image}
                                    className="card-img-top"
                                    alt="..."
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{item.name}</h5>
                                    <p className="card-text">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </BootstrapLayout>
    );
};

export default ProductOthers;
