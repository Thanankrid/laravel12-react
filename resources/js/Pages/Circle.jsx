import BootstrapLayout from "@/layouts/BootstrapLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";

export default function Circle() {
    const [items, setItems] = useState([1,1,1,1,1,1,1,1]);
    const [color, setColor] = useState("blue");

    const onPressButton = () => { setColor("black"); };  

    return (
        <BootstrapLayout>
            <div className="container">
                <Head title="Circle and state" />
                <h1>Circle and state</h1>
                <button className="btn btn-primary" onClick={onPressButton}> Change Color </button>
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {items.map((item, index) => (
                        <div className="col">
                            <div style={{ backgroundColor : color, width:100, height:100 }} className="rounded-circle"></div>
                        </div>
                    ))}
                </div>                
            </div>
        </BootstrapLayout>
    );
}
