import { forwardRef, useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { type NavItem } from "../types";
import { TextAlignJustify, X } from "lucide-react";

const Header = forwardRef<HTMLElement>((_, ref) => {
  const navItem: NavItem[] = [
    {
      label: "Trang chủ",
      href: "/",
    },
    {
      label: "Dự án",
      href: "/du-an",
    },
    {
      label: "Giải pháp",
      href: "/giai-phap",
    },
    {
      label: "Tuyển dụng",
      href: "/tuyen-dung",
    },
  ];

  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      ref={ref}
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled || !isHome ? "bg-white/95 backdrop-blur-md shadow-md py-2" : "bg-transparent py-4"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 text-lg">
          <Link
            to={"/"}
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer text-primary text-lg font-bold"
          >
            MTBP
          </Link>

          {/* DESKTOP LAYOUT */}
          <div className="hidden md:flex space-x-8 items-center">
            {navItem.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`font-medium transition-colors ${
                  location.pathname === item.href
                    ? "text-primary font-bold"
                    : isScrolled || !isHome
                      ? "text-gray-700 hover:text-primary"
                      : "text-gray-800 hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/lien-he"
              className="bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Liên hệ ngay
            </Link>
          </div>

          {/* MOBILE LAYOUT */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpened(!isOpened)}
              className="cursor-pointer hover:text-primary"
            >
              {isOpened ? (
                <X className="w-6 h-6" />
              ) : (
                <TextAlignJustify className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {isOpened && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg h-screen absolute w-full">
          <div className="px-4 pt-2 pb-6">
            {navItem.map((item, index) => (
              <Link
                to={item.href}
                onClick={() => setIsOpened(false)}
                className="block px-3 py-4 text-lg font-medium text-gray-900 rounded-md border-b border-gray-50 hover:text-white hover:bg-primary"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/lien-he"
              className="bg-primary block mt-6 hover:bg-blue-600 text-white text-center px-5 py-2.5 rounded-full font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={() => setIsOpened(false)}
            >
              Liên hệ ngay
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
});

export default Header;
