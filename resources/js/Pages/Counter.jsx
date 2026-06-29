//resources/js/Pages/Counter.jsx
import BootstrapLayout from "@/layouts/BootstrapLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
//import { useState } from "react";

export default function Counter() {

    const [count, setCount] = useState(0);

    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count - 1);
    const reset = () => setCount(0);

    return (
        <BootstrapLayout>                      
            <Head title="Counter"/>
            <div className="container mt-4">
                <h1>Counter App</h1>                
                <h5 className="text-center bg-info fs-1">{count}</h5>
                <div className="row text-center">
                    <div className="col-lg-4">                
                        <button className="btn btn-warning" onClick={decrement}>ลด</button>      
                    </div>                    
                    <div className="col-lg-4">                
                        <button className="btn btn-secondary" onClick={reset}>รีเซ็ท</button>      
                    </div>                    
                    <div className="col-lg-4">                
                        <button className="btn btn-success" onClick={increment}>เพิ่ม</button>      
                    </div>                    
                </div>
            </div>
        </BootstrapLayout>
    );
}
