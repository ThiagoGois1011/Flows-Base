import HomeSidebar from "@/components/HomeSidebar/HomeSidebar";
import HomeWelcome from "@/components/HomeWelcome/HomeWelcome";

export default function Home() {
  return (
    <div className="flex h-screen">
      <HomeSidebar />
      <HomeWelcome />
    </div>
  );
}
