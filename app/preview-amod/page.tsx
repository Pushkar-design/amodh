import { Amenities } from "@/components/Amenities";
import { AmodRoomsSection } from "@/components/amod/AmodRoomsSection";
import { AmodStayProvider } from "@/components/amod/amod-stay-context";
import { SelectionBar } from "@/components/amod/SelectionBar";
import { ExperienceSection } from "@/components/ExperienceSection";
import { HeritageSection } from "@/components/HeritageSection";
import { Hero } from "@/components/Hero";
import { HomeContactSection } from "@/components/HomeContactSection";
import { HotelAmodhHeader } from "@/components/HotelAmodhHeader";

export default function PreviewAmodPage() {
  return (
    <AmodStayProvider>
      <HotelAmodhHeader />
      <main className="flex-1 pb-40">
        <Hero roomsHref="/preview-amod#rooms" />
        <HeritageSection />
        <AmodRoomsSection />
        <section
          id="experiences"
          className="scroll-mt-28"
          aria-label="Services and amenities"
        >
          <Amenities />
          <ExperienceSection />
        </section>
        <HomeContactSection />
      </main>
      <SelectionBar />
    </AmodStayProvider>
  );
}
