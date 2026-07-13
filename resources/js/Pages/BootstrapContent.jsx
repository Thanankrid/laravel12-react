import BootstrapLayout from "@/Layouts/BootstrapLayout";
import { Head } from "@inertiajs/react";

export default function Bootstrap() {
    return (
        <BootstrapLayout>
                       
            <Head title="Welcome"/>
            <div className="container">
                <h1>Here Your Bootstrap</h1>
                <div className="row">
                    <div className="col-lg-4">
                        <img className="img-thumbnail" src="https://cms.imgworlds.com/assets/473cfc50-242c-46f8-80be-68b867e28919.jpg?key=home-gallery" />
                    </div>
                    <div className="col-lg-4">
                        <img className="img-thumbnail" src="https://cms.imgworlds.com/assets/473cfc50-242c-46f8-80be-68b867e28919.jpg?key=home-gallery" />
                    </div>
                    <div className="col-lg-4">
                        <img className="img-thumbnail" src="https://cms.imgworlds.com/assets/473cfc50-242c-46f8-80be-68b867e28919.jpg?key=home-gallery" />
                    </div>
                </div>
            </div>
        </BootstrapLayout>
    );
}
