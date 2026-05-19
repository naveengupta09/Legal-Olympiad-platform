import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footes";

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background bg-hero-mesh">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}