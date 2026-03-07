import Hero from "@/components/client/home/Hero";
import ServicesGrid from "@/components/client/home/ServicesGrid";
import HomeContactSection from "@/components/client/home/HomeContactSection";
import MeetTheTeam from "@/components/client/home/MeetTheTeam";

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