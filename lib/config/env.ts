function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export const env = {
  MONGODB_URI: required("MONGODB_URI", process.env.MONGODB_URI),
  JWT_SECRET: required("JWT_SECRET", process.env.JWT_SECRET),
  ADMIN_REGISTER_SECRET: required("ADMIN_REGISTER_SECRET", process.env.ADMIN_REGISTER_SECRET),

  RESEND_API_KEY: required("RESEND_API_KEY", process.env.RESEND_API_KEY),
  APP_URL: required("APP_URL", process.env.APP_URL),
  CONTACT_FROM_EMAIL: required("CONTACT_FROM_EMAIL", process.env.CONTACT_FROM_EMAIL),
  CONTACT_TO_EMAIL: required("CONTACT_TO_EMAIL", process.env.CONTACT_TO_EMAIL),
};