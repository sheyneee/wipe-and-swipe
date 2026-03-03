export type Service = {
  value: string;
  title: string;
  price: string;
  description: string;
  bullets: string[];
  emoji: string;
};

export const SERVICES: Service[] = [
  {
    value: "residential",
    title: "Residential Cleaning",
    price: "$40/hour + Goods and Services Tax (GST)",
    description: "Perfect for weekly or fortnightly cleaning to keep your home fresh, tidy, and stress-free.",
    bullets: ["General dusting & tidying", "Bathroom & toilet cleaning", "Kitchen cleaning & appliances", "Vacuuming & mopping", "Laundry folding & bed making (upon request)"],
    emoji: "🏠",
  },
  {
    value: "commercial",
    title: "Commercial Cleaning",
    price: "Quote Based + Goods and Services Tax (GST)",
    description: "Professional cleaning for offices, clinics, retail spaces & commercial buildings with flexible scheduling.",
    bullets: ["Desk & surface sanitising", "Vacuuming & mopping", "Restroom sanitation", "High-touch point disinfection"],
    emoji: "🏢",
  },
  {
    value: "airbnb",
    title: "Airbnb Cleaning",
    price: "$35/hour + Goods and Services Tax (GST)",
    description: "Reliable, fast-turnaround cleaning so guests walk into a spotless and welcoming space.",
    bullets: ["Full bathroom & kitchen clean", "Vacuuming & mopping", "Surface sanitising", "Bed making & linen change"],
    emoji: "🏡",
  },
  {
    value: "school",
    title: "School Cleaning",
    price: "Quote Based + Goods and Services Tax (GST)",
    description: "Safe, hygienic cleaning for schools and educational facilities with focus on health and compliance.",
    bullets: ["Classroom & office cleaning", "Desk & surface sanitising", "Restroom cleaning", "Quarterly deep cleaning available"],
    emoji: "🏫",
  },
  {
    value: "tenancy",
    title: "End-of-Tenancy Cleaning",
    price: "$50/hour + Goods and Services Tax (GST)",
    description: "Ideal for empty houses to help tenants secure bond returns or prep properties for new occupants.",
    bullets: ["Deep kitchen & bathroom clean", "Inside cupboards & drawers", "Interior windows & skirting boards", "Wall & ceiling spot cleaning"],
    emoji: "🧹",
  },
  {
    value: "deep",
    title: "Deep Cleaning",
    price: "$55/hour + Goods and Services Tax (GST)",
    description: "Thorough top-to-bottom clean for homes needing extra care. Great before events or seasonal resets.",
    bullets: ["Detailed dusting & high surfaces", "Deep kitchen & bathroom cleaning", "Inside cabinets & light fixtures", "Full floor detailing"],
    emoji: "✨",
  },
  {
    value: "window",
    title: "Window Cleaning",
    price: "Quote Based + Goods and Services Tax (GST)",
    description: "Professional interior and exterior window cleaning for homes and businesses.",
    bullets: ["Interior glass cleaning", "Exterior glass cleaning", "Frames, sills & tracks", "Cobweb removal"],
    emoji: "🪟",
  },
  {
    value: "driveway",
    title: "Driveway & Concrete",
    price: "Quote Based + Goods and Services Tax (GST)",
    description: "High-pressure cleaning to restore driveways, patios, pathways, and concrete surfaces.",
    bullets: ["Moss & mould removal", "Dirt & grime removal", "Oil stain treatment", "Surface rinse & clean finish"],
    emoji: "🚿",
  },
  {
    value: "builder",
    title: "Builder's Clean",
    price: "Quote Based + Goods and Services Tax (GST)",
    description: "Detailed cleaning after renovations or new builds to make the property move-in ready.",
    bullets: ["Construction dust removal", "Interior window cleaning", "Paint splatter removal", "Final presentation clean"],
    emoji: "🏗",
  },
];