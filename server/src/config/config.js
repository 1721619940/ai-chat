const env = process.env.NODE_ENV || "development";

const baseConfig = {
  env,
  port: parseInt(process.env.PORT || "5500", 10),
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  openRouterKey: process.env.OPENROUTER_API_KEY,
  aiModel: process.env.AI_MODEL || "amazon/nova-2-lite-v1:free",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
};

const devConfig = {
  // anything specific for dev
  // e.g. logLevel: "debug"
};

const prodConfig = {
  // anything specific for prod
  // e.g. logLevel: "info"
};

const config =
  env === "production"
    ? { ...baseConfig, ...prodConfig }
    : { ...baseConfig, ...devConfig };

export default config;
