export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-4">
            <div className="container mx-auto flex justify-center">
                <nav className="space-x-4">
                    <a href="/">Home</a>
                    <a href="/about">About Us</a>
                    <a href="/contact">Contact Us</a>
                    <a href="/services">Services</a>
                    <a href="/blog">Blog</a>
                    <a href="/faq">FAQ</a>
                    <a href="/terms">Terms and Conditions</a>
                    <a href="/privacy">Privacy Policy</a>
                </nav>
            </div>
            <p className="text-center mt-4">&copy; 2023 EchoSign</p>
        </footer>
    );
}