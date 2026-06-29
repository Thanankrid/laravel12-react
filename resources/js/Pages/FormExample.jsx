import BootstrapLayout from "@/layouts/BootstrapLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";

export default function FormExample() {
    const [formData, setFormData] = useState({ name: "", email: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newFormData = { ...formData, [name]: value };
        setFormData(newFormData);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
    };
    return (
        <BootstrapLayout>
            <div className="container">
                <Head title="Counter" />
                <div className="row">
                    <div className="col-lg-6">
                        <form onSubmit={handleSubmit}>
                            <input className="form-control" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                            <input className="form-control" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                            <button className="btn btn-primary" type="submit">Submit</button>
                        </form>
                    </div>
                    <div className="col-lg-6">
                        <h1>{ formData.name }</h1>
                        <p>{ formData.email }</p>
                    </div>
                </div>
            </div>
        </BootstrapLayout>
    );
}
