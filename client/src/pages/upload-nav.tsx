import Navigation from "@/components/Navigation";
import UploadPage from "./upload";

export default function UploadWithNav() {
  return (
    <>
      <Navigation />
      <div className="pt-16">
        <UploadPage />
      </div>
    </>
  );
}
