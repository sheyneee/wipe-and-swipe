export type Service = {
  value: string;
  title: string;
  price: string;
  description: string;
  bullets: string[];
  whyChoose: string[];
  emoji: string;
};

export const SERVICES: Service[] = [
  {
    value: "residential",
    title: "Residential Cleaning",
    price: "$40/hour + GST",
    description: "Perfect for weekly or fortnightly cleaning to keep your home fresh, tidy, and stress-free.",
    bullets: [
      "General dusting & tidying",
      "Bathroom & toilet cleaning",
      "Kitchen cleaning & appliances",
      "Vacuuming & mopping",
      "Laundry folding & bed making (upon request)",
    ],
    whyChoose: [
      "Save time on household chores and get your weekends back",
      "Maintain a consistently clean, healthy living environment",
      "Reliable results with attention to detail every visit",
      "Flexible scheduling. Weekly, fortnightly, or monthly",
    ],
    emoji: "🏠",
  },
  {
    value: "commercial",
    title: "Commercial Cleaning",
    price: "Quote Based + GST",
    description: "Professional cleaning for offices, clinics, retail spaces & commercial buildings with flexible scheduling.",
    bullets: ["Desk & surface sanitising", "Vacuuming & mopping", "Restroom sanitation", "High-touch point disinfection"],
    whyChoose: [
      "Create a cleaner, more professional space for staff and customers",
      "Reduce germs on high-touch surfaces with consistent sanitising",
      "Flexible scheduling to minimise disruption to operations",
      "Quote-based scope to match your site size and needs",
    ],
    emoji: "🏢",
  },
  {
    value: "airbnb",
    title: "Airbnb Cleaning",
    price: "$35/hour + GST",
    description: "Reliable, fast-turnaround cleaning so guests walk into a spotless and welcoming space.",
    bullets: ["Full bathroom & kitchen clean", "Vacuuming & mopping", "Surface sanitising", "Bed making & linen change"],
    whyChoose: [
      "Fast turnarounds to keep your calendar fully bookable",
      "Consistent presentation that supports better reviews",
      "Detailed reset between guests. Bathrooms, kitchens, and linens",
      "Reliable cleaners you can trust with your property",
    ],
    emoji: "🏡",
  },
  {
    value: "school",
    title: "School Cleaning",
    price: "Quote Based + GST",
    description: "Safe, hygienic cleaning for schools and educational facilities with focus on health and compliance.",
    bullets: ["Classroom & office cleaning", "Desk & surface sanitising", "Restroom cleaning", "Quarterly deep cleaning available"],
    whyChoose: [
      "Support a healthier environment for students and staff",
      "Focus on high-contact areas to reduce spread of illness",
      "Cleaning schedules aligned with school hours and routines",
      "Optional periodic deep cleans for term breaks and resets",
    ],
    emoji: "🏫",
  },
  {
    value: "tenancy",
    title: "End-of-Tenancy Cleaning",
    price: "$50/hour + GST",
    description: "Ideal for empty houses to help tenants secure bond returns or prep properties for new occupants.",
    bullets: ["Deep kitchen & bathroom clean", "Inside cupboards & drawers", "Interior windows & skirting boards", "Wall & ceiling spot cleaning"],
    whyChoose: [
      "Improve chances of bond return with a proper reset clean",
      "Ideal for empty homes. Easier access to details and edges",
      "Covers key inspection areas like cupboards, skirtings, and windows",
      "Helps landlords prepare faster for new tenants",
    ],
    emoji: "🧹",
  },
  {
    value: "deep-cleaning",
    title: "Deep Cleaning",
    price: "$55/hour + GST",
    description: "Thorough top-to-bottom clean for homes needing extra care. Great before events or seasonal resets.",
    bullets: ["Detailed dusting & high surfaces", "Deep kitchen & bathroom cleaning", "Inside cabinets & light fixtures", "Full floor detailing"],
    whyChoose: [
      "Best for seasonal resets, post-illness, or pre-event preparation",
      "Targets buildup in kitchens, bathrooms, and hard-to-reach areas",
      "Ideal when regular cleaning has fallen behind",
      "Leaves the home feeling genuinely refreshed, not just tidy",
    ],
    emoji: "✨",
  },
  {
    value: "window",
    title: "Window Cleaning",
    price: "Quote Based + GST",
    description: "Professional interior and exterior window cleaning for homes and businesses.",
    bullets: ["Interior glass cleaning", "Exterior glass cleaning", "Frames, sills & tracks", "Cobweb removal"],
    whyChoose: [
      "Brighter interiors and a sharper first impression",
      "Removes grime from tracks, sills, and frames. Not just glass",
      "Great for both residential and commercial sites",
      "Quote-based pricing to match access and window count",
    ],
    emoji: "🪟",
  },
  {
    value: "driveway",
    title: "Driveway & Concrete",
    price: "Quote Based + GST",
    description: "High-pressure cleaning to restore driveways, patios, pathways, and concrete surfaces.",
    bullets: ["Moss & mould removal", "Dirt & grime removal", "Oil stain treatment", "Surface rinse & clean finish"],
    whyChoose: [
      "Instant curb-appeal improvement with visible before-after results",
      "Reduces slip risk by removing moss and mould",
      "Restores patios and paths for a cleaner outdoor space",
      "Quote-based to reflect area size and stain severity",
    ],
    emoji: "🚿",
  },
  {
    value: "builder",
    title: "Builder's Clean",
    price: "Quote Based + GST",
    description: "Detailed cleaning after renovations or new builds to make the property move-in ready.",
    bullets: ["Construction dust removal", "Interior window cleaning", "Paint splatter removal", "Final presentation clean"],
    whyChoose: [
      "Makes the property move-in ready after construction or renovations",
      "Targets fine dust that settles on every surface",
      "Helps present the build at handover. Clean, polished, and finished",
      "Quote-based scope to match build stage and site condition",
    ],
    emoji: "🏗",
  },
];