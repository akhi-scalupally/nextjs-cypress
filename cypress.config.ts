import { defineConfig } from "cypress";
import { config as dotenvConfig } from "dotenv";
import path from "path";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // Load .env.testing file for test environment
      const envPath = path.resolve(__dirname, ".env.testing");
      dotenvConfig({ path: envPath });
      
      // implement node event listeners here
    },
  },
});
