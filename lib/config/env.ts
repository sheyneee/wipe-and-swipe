function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export const env = {
  MONGODB_URI: required("MONGODB_URI", process.env.MONGODB_URI),
  JWT_SECRET: required("JWT_SECRET", process.env.JWT_SECRET),
  ADMIN_REGISTER_SECRET: required("ADMIN_REGISTER_SECRET", process.env.ADMIN_REGISTER_SECRET),
};