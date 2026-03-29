export type CompanyTeamMember = {
  id: string;
  name: string;
  shortName: string;
  role: string;
  bio: string;
  tags: string[];
  gradientClass: string;
  image: string; // ✅ ADD THIS
};

export const companyTeamMembers: CompanyTeamMember[] = [
  {
    id: "joyce-daphne-martinez",
    name: "Joyce Daphne Martinez",
    shortName: "Joyce Daphne",
    role: "Co-Founder. Operations Lead",
    bio:
       "Joyce brings passion and attention to detail to every cleaning job. With a background in customer care, she ensures that every client receives the white-glove service they deserve.",
    tags: ["Customer Focus", "Detail-Oriented"],
    gradientClass: "from-brand-primary to-brand-accent",
    image: "/images/team/ceo-1.webp", // ✅ Joyce
  },
  {
    id: "reineer-kien-martinez",
    name: "Reineer Kien Martinez",
    shortName: "Reineer Kien",
    role: "Co-Founder. Service Manager",
    bio:
      "Reineer leads our cleaning teams with professionalism and expertise. His systematic approach to cleaning and commitment to excellence ensures consistent, high-quality results across every job.",
    tags: ["Leadership", "Standards"],
    gradientClass: "from-brand-secondary to-brand-primary",
    image: "/images/team/ceo-2.webp", // ✅ Reineer
  },
];