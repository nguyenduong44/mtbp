import { Outlet } from "react-router";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useEffect, useRef, useState } from "react";

const MainLayout = () => {
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-49">
      <Header ref={headerRef} />
      <main className="" style={{ paddingTop: headerHeight }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
