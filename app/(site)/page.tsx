import Hero from "@/components/client/home/Hero";
import ServicesGrid from "@/components/client/home/ServicesGrid";
import HomeContactSection from "@/components/client/home/HomeContactSection";
import MeetTheTeam from "@/components/client/home/MeetTheTeam";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cleaning Services in Whanganui | Wipe & Swipe",
  description:
    "Professional residential and commercial cleaning services in Whanganui, New Zealand. Book a free quote today with Wipe & Swipe Cleaning Services Ltd.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      <MeetTheTeam id="about" />
      <HomeContactSection />
    </>
  );
}