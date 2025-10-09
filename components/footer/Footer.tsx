import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="font-playfair text-2xl font-bold mb-4">Velwyn</h3>
            <p className="text-primary-foreground/70 text-sm">
              Curating timeless pieces for the modern wardrobe since 2024
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Women</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Men</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Accessories</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Customer Care</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Size Guide</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-accent transition-colors" aria-label="Follow us on Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors" aria-label="Follow us on Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors" aria-label="Follow us on Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/60">
          <p>&copy; 2024 NOIR. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
