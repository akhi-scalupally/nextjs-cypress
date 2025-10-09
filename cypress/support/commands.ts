/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// Viewport configurations for different device types
export const VIEWPORTS = {
  mobile: {
    width: 375,
    height: 667,
    name: 'iPhone SE'
  },
  tablet: {
    width: 768,
    height: 1024,
    name: 'iPad'
  },
  desktop: {
    width: 1280,
    height: 720,
    name: 'Desktop'
  },
  largeDesktop: {
    width: 1920,
    height: 1080,
    name: 'Large Desktop'
  }
} as const;

// Custom command to set viewport
Cypress.Commands.add('setViewport', (device: keyof typeof VIEWPORTS) => {
  const viewport = VIEWPORTS[device];
  cy.viewport(viewport.width, viewport.height);
  cy.log(`Viewport set to ${viewport.name} (${viewport.width}x${viewport.height})`);
});

// Custom command to test across all viewports
Cypress.Commands.add('testAcrossViewports', (testFn: () => void, devices: (keyof typeof VIEWPORTS)[] = ['mobile', 'tablet', 'desktop']) => {
  devices.forEach(device => {
    cy.log(`Testing on ${VIEWPORTS[device].name}`);
    
    // Clear all addresses before each viewport test
    cy.request('GET', '/api/address').then((response) => {
      if (response.body.data && response.body.data.length > 0) {
        // Delete all addresses
        response.body.data.forEach((address: any) => {
          cy.request('DELETE', `/api/address/${address.id}`);
        });
      }
    });
    
    // Set viewport and visit the page
    cy.setViewport(device);
    cy.visit('/address');
    cy.get('[data-cy="address-page"]').should('exist');
    
    // Run the test
    testFn();
  });
});

// Custom command to check responsive behavior
Cypress.Commands.add('checkResponsiveElement', (selector: string, expectedBehavior: {
  mobile?: { visible?: boolean; hidden?: boolean; text?: string };
  tablet?: { visible?: boolean; hidden?: boolean; text?: string };
  desktop?: { visible?: boolean; hidden?: boolean; text?: string };
}) => {
  Object.entries(expectedBehavior).forEach(([device, behavior]) => {
    cy.setViewport(device as keyof typeof VIEWPORTS);
    
    if (behavior.visible) {
      cy.get(selector).should('be.visible');
    }
    if (behavior.hidden) {
      cy.get(selector).should('not.be.visible');
    }
    if (behavior.text) {
      cy.get(selector).should('contain', behavior.text);
    }
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      setViewport(device: keyof typeof VIEWPORTS): Chainable<void>
      testAcrossViewports(testFn: () => void, devices?: (keyof typeof VIEWPORTS)[]): Chainable<void>
      checkResponsiveElement(selector: string, expectedBehavior: {
        mobile?: { visible?: boolean; hidden?: boolean; text?: string };
        tablet?: { visible?: boolean; hidden?: boolean; text?: string };
        desktop?: { visible?: boolean; hidden?: boolean; text?: string };
      }): Chainable<void>
    }
  }
}

// Global test data cleanup is now handled in e2e.ts
// This ensures data is cleared only once at start and end of ALL tests
// instead of before each individual test