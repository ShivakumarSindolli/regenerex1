import Navigation from "@/components/Navigation";
import Dashboard from "./dashboard";

export default function DashboardWithNav() {
  return (
    <>
      <Navigation />
      <div className="pt-16">
        <Dashboard />
      </div>
    </>
  );
}
