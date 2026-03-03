export const BRAND = {
  primary: "#296276",
  secondary: "#283955",
  accent: "#266075",
  white: "#ffffff",
} as const;

export type BrandColor = keyof typeof BRAND;