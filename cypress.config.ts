import { defineConfig } from "cypress";
import { clearTestData } from "./lib/db-sqlite";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    supportFile: "cypress/support/e2e.ts",
    setupNodeEvents(on, config) {
      // NODE_ENV is already set to 'test' by the npm scripts using cross-env
      // No need to load environment files as cross-env handles the environment
      
      // Helper function to clear test data
      const clearTestDataHelper = () => {
        console.log('🔍 DEBUG: Entering test mode cleanup block');
        try {
          console.log('🔍 DEBUG: Calling clearTestData()...');
          clearTestData();
          
          console.log('🧹 Global test data cleared');
        } catch (error) {
          console.error('❌ DEBUG: Error in clearTestDataHelper:', error);
          console.error('Failed to clear global test data:', error);
        }
      };
      
      // Global test data cleanup - runs once at start and end of ALL tests
      on('before:run', (details) => {
        
        if (process.env.NEXT_PUBLIC_TEST_MODE === 'true') {
          clearTestDataHelper();
        } else {
          console.log('🔍 DEBUG: Not in test mode, skipping cleanup');
          console.log('🔍 DEBUG: NEXT_PUBLIC_TEST_MODE =', process.env.NEXT_PUBLIC_TEST_MODE);
        }
        
        console.log('🔍 DEBUG: before:run hook completed');
      });

      on('after:run', (results) => {
        
        if (process.env.NEXT_PUBLIC_TEST_MODE === 'true') {
          clearTestDataHelper();
        } else {
          console.log('🔍 DEBUG: Not in test mode, skipping cleanup');
          console.log('🔍 DEBUG: NEXT_PUBLIC_TEST_MODE =', process.env.NEXT_PUBLIC_TEST_MODE);
        }
        
        console.log('🔍 DEBUG: after:run hook completed');
      });

      // For Cypress UI mode - runs when browser launches
      on('before:browser:launch', (browser, launchOptions) => {

        
        if (process.env.NEXT_PUBLIC_TEST_MODE === 'true') {
          clearTestDataHelper();
        } else {
          console.log('🔍 DEBUG: Not in test mode, skipping cleanup');
          console.log('🔍 DEBUG: NEXT_PUBLIC_TEST_MODE =', process.env.NEXT_PUBLIC_TEST_MODE);
        }
        
        console.log('🔍 DEBUG: before:browser:launch hook completed');
        return launchOptions;
      });

      // Task for manual cleanup from tests
      on('task', {
        clearTestData() {
          console.log('🔍 DEBUG: clearTestData task called');
          clearTestDataHelper();
          return null;
        }
      });
    },
  },
});
