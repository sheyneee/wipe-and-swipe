export type CompanyTeamMember = {
  id: string;
  name: string;
  shortName: string;
  role: string;
  bio: string;
  tags: string[];
  gradientClass: string;
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
  },
  {
    id: "cleaning-professionals",
    name: "Our Cleaning Professionals",
    shortName: "Our Team",
    role: "Trained. Dedicated",
    bio:
      "Our growing team of cleaning professionals are carefully selected and trained to meet our high standards. Each team member is committed to delivering exceptional service and treating your space with the care and respect it deserves.",
    tags: ["Professional", "Reliable"],
    gradientClass: "from-brand-accent to-brand-secondary",
  },
];