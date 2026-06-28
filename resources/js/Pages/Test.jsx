import { Head } from '@inertiajs/react';

function MyButton() {
    return <button>I'm a button</button>;
}

export default function Test() {
    return (
        <div>
            <Head title="Test" />
            <h1>Welcome to my app</h1>
            <MyButton />
        </div>
    );
}


