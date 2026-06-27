const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-primary text-white py-6 mt-10">
            <div className="container mx-auto text-center">
                <p>ShopZone &copy; {currentYear}</p>
            </div>
        </footer>
    );
};

export default Footer;
