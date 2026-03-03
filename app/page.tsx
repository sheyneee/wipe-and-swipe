import Hero from "@/components/home/Hero";
import ServicesGrid from "@/components/home/ServicesGrid";
import HomeContactSection from "@/components/home/HomeContactSection";
import MeetTheTeam from "@/components/home/MeetTheTeam";

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