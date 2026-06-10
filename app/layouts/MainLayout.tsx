import { Outlet, useNavigation } from "react-router";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

const MainLayout = () => {
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-49">
      <Header ref={headerRef} />
      <main className="" style={{ paddingTop: headerHeight }}>
      {isLoading && (
    <div className="fixed inset-0 z-[9999] bg-white/60 backdrop-blur-sm flex items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  )}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
