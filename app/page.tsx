import { Amenities } from "@/components/Amenities";
import { DateSelection } from "@/components/DateSelection";
import { EntirePropertyToggle } from "@/components/EntirePropertyToggle";
import { ExperienceSection } from "@/components/ExperienceSection";
import { GuestSelector } from "@/components/GuestSelector";
import { HeritageSection } from "@/components/HeritageSection";
import { Hero } from "@/components/Hero";
import { RoomListing } from "@/components/RoomListing";
import { HotelAmodhHeader } from "@/components/HotelAmodhHeader";
import { StickyEnquiryFooter } from "@/components/StickyEnquiryFooter";

export default function Home() {
  return (
    <>
      <HotelAmodhHeader />
      <main className="flex-1 pb-36">
        <Hero />
        <HeritageSection />
        <DateSelection />
        <EntirePropertyToggle />
        <RoomListing />
        <GuestSelector />
        <Amenities />
        <ExperienceSection />
      </main>
      <StickyEnquiryFooter />
    </>
  );
}
