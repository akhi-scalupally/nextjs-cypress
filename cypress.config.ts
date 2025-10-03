import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // NODE_ENV is already set to 'test' by the npm scripts using cross-env
      // No need to load environment files as cross-env handles the environment
      
      // implement node event listeners here
    },
  },
});
