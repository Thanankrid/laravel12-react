// แก้ตรงนี้: ลบ : any ออกไป
export default function TemplateLayout({ children }) {
    return (
        <div>
            <Header />
            <div style={{ display: "flex", flex: "1" }}>
                <main style={{ flex: "1", padding: "10px" }}>{children}</main>
            </div>
            <Footer />
        </div>
    );
}

function Header() {
    return (
        <header style={{ padding: "10px", backgroundColor: "#282c34", color: "white" }}>
            <h1>My Website</h1>
        </header>
    );
}

function Footer() {
    return (
        <footer style={{ padding: "10px", backgroundColor: "#282c34", color: "white", textAlign: "center" }}>
            <p>© 2024 My Website</p>
        </footer>
    );
}