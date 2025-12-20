import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <span className="text-white font-bold">MTBP Agency</span>
            </div>
            <p className="text-sm">
              Full-service marketing agency tại Tây Ninh
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>Social Media Marketing</li>
              <li>Branding & Design</li>
              <li>Content Production</li>
              <li>KOL Marketing</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/work" className="hover:text-white transition">
                  Work
                </Link>
              </li>
              <li>
                <Link to="/solutions" className="hover:text-white transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/career" className="hover:text-white transition">
                  Career
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li>📍 Tây Ninh, Vietnam</li>
              <li>📧 hello@mtbp.vn</li>
              <li>📱 +84 901 234 567</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>© 2024 MTBP Agency. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
