import BootstrapLayout from "@/layouts/BootstrapLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";

export default function ListManager() {
    const [items, setItems] = useState([]);
    const addItem = () => {        setItems([...items, `Item ${items.length + 1}`]);    };
    const removeItem = (index) => {        setItems(items.filter((_, i) => i !== index));    };
    return (
        <BootstrapLayout>
            <div className="container">
                <Head title="Counter" />
                <h1>State managed List</h1>
                <button className="btn btn-primary" onClick={addItem}> Add Item </button>
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {items.map((item, index) => (
                        <div className="col">
                            <div className="card h-100">
                                <img src={"https://picsum.photos/200/"+(100+index)} className="card-img-top" alt="..." />
                                <div className="card-body">
                                    <h5 className="card-title">{item}</h5>
                                    <p className="card-text">
                                        This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.
                                    </p>
                                </div>
                                <button className="btn btn-danger" onClick={() => removeItem(index)}> <i className="bi bi-trash"></i> Remove </button>
                            </div>
                        </div>
                    ))}
                </div>                
            </div>
        </BootstrapLayout>
    );
}
