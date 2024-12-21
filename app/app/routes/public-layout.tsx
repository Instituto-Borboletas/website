import { Outlet } from "react-router";
import { Header } from "~/components/header"
import { Footer } from "~/components/footer"

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
