/// <reference types="cypress" />

describe('Address CRUD operations', function () {
  beforeEach(() => {
    // Clear all addresses before each test
    cy.request('GET', '/api/address').then((response) => {
      if (response.body.data && response.body.data.length > 0) {
        // Delete all addresses
        response.body.data.forEach((address: any) => {
          cy.request('DELETE', `/api/address/${address.id}`);
        });
      }
    });
    
    cy.visit('/address');
    cy.get('[data-cy="address-page"]').should('exist');
  });

  it('displays empty state when no addresses exist', () => {
    cy.get('[data-cy="address-list"]').should('be.visible');
    cy.get('[data-cy="al-empty"]').should('contain', 'No addresses saved yet');
  });

  it('creates a new address', () => {
    // Fill out the form
    cy.get('[data-cy="af-name"]').type('John Doe');
    cy.get('[data-cy="af-line1"]').type('123 Main Street');
    cy.get('[data-cy="af-line2"]').type('Apt 4B');
    cy.get('[data-cy="af-city"]').type('New York');
    cy.get('[data-cy="af-state"]').type('NY');
    cy.get('[data-cy="af-postal"]').type('10001');
    cy.get('[data-cy="af-country"]').type('USA');
    cy.get('[data-cy="af-phone"]').type('555-1234');

    // Submit the form
    cy.get('[data-cy="af-submit"]').click();

    // Debug: Check if the page is still loading
    cy.log('Checking page state after form submission...');
    
    // Debug: Wait for any loading to complete
    cy.wait(2000);
    
    // Debug: Check what elements are actually present
    cy.get('body').then(($body) => {
      cy.log('Body content:', $body.html());
      
      // Check if address-list exists
      if ($body.find('[data-cy="address-list"]').length === 0) {
        cy.log('❌ address-list element not found!');
      } else {
        cy.log('✅ address-list element found');
      }
      
      // Check if al-empty exists (indicating no addresses)
      if ($body.find('[data-cy="al-empty"]').length > 0) {
        cy.log('❌ Empty state showing - form submission failed!');
      } else {
        cy.log('✅ Empty state gone - maybe addresses were created');
      }
      
      // Check if any al-item exists (indicating addresses were created)
      if ($body.find('[data-cy="al-item"]').length > 0) {
        cy.log('✅ al-item found - address was created!');
      } else {
        cy.log('❌ No al-item found - no addresses created');
      }
    });

    // Verify the address appears in the list
    cy.get('[data-cy="al-item"]').should('have.length', 1);
    
    // Verify each specific field
    cy.get('[data-cy="al-name"]').should('contain', 'John Doe');
    cy.get('[data-cy="al-address"]').should('contain', '123 Main Street, Apt 4B');
    cy.get('[data-cy="al-city-state"]').should('contain', 'New York, NY');
    cy.get('[data-cy="al-postal-country"]').should('contain', '10001, USA');
    cy.get('[data-cy="al-phone"]').should('contain', '555-1234');

    // Verify form is reset
    cy.get('[data-cy="af-name"]').should('have.value', '');
    cy.get('[data-cy="af-line1"]').should('have.value', '');
  });

  it('edits an existing address', () => {
    // First create an address
    cy.get('[data-cy="af-name"]').type('Jane Smith');
    cy.get('[data-cy="af-line1"]').type('456 Oak Avenue');
    cy.get('[data-cy="af-city"]').type('Los Angeles');
    cy.get('[data-cy="af-state"]').type('CA');
    cy.get('[data-cy="af-postal"]').type('90210');
    cy.get('[data-cy="af-country"]').type('USA');
    cy.get('[data-cy="af-submit"]').click();

    // Wait for the address to appear
    cy.get('[data-cy="al-item"]').should('have.length', 1);

    // Click edit button
    cy.get('[data-cy="al-edit"]').click();

    // Verify form is populated
    cy.get('[data-cy="af-name"]').should('have.value', 'Jane Smith');
    cy.get('[data-cy="af-line1"]').should('have.value', '456 Oak Avenue');
    cy.get('[data-cy="af-city"]').should('have.value', 'Los Angeles');

    // Update the form
    cy.get('[data-cy="af-name"]').clear().type('Jane Doe');
    cy.get('[data-cy="af-line1"]').clear().type('789 Pine Street');
    cy.get('[data-cy="af-city"]').clear().type('San Francisco');

    // Submit the update
    cy.get('[data-cy="af-submit"]').click();

    // Verify the address is updated
    cy.get('[data-cy="al-item"]').should('contain', 'Jane Doe');
    cy.get('[data-cy="al-item"]').should('contain', '789 Pine Street');
    cy.get('[data-cy="al-item"]').should('contain', 'San Francisco');

    // Verify form is reset
    cy.get('[data-cy="af-name"]').should('have.value', '');
  });

  it('cancels edit mode', () => {
    // Create an address first
    cy.get('[data-cy="af-name"]').type('Test User');
    cy.get('[data-cy="af-line1"]').type('123 Test Street');
    cy.get('[data-cy="af-city"]').type('Test City');
    cy.get('[data-cy="af-postal"]').type('12345');
    cy.get('[data-cy="af-country"]').type('Test Country');
    cy.get('[data-cy="af-submit"]').click();

    // Wait for address to appear
    cy.get('[data-cy="al-item"]').should('have.length', 1);

    // Click edit
    cy.get('[data-cy="al-edit"]').click();

    // Verify form is populated
    cy.get('[data-cy="af-name"]').should('have.value', 'Test User');

    // Click cancel
    cy.get('[data-cy="af-cancel"]').click();

    // Verify form is reset
    cy.get('[data-cy="af-name"]').should('have.value', '');
    cy.get('[data-cy="af-line1"]').should('have.value', '');

    // Verify address is unchanged
    cy.get('[data-cy="al-item"]').should('contain', 'Test User');
    cy.get('[data-cy="al-item"]').should('contain', '123 Test Street');
  });

  it('deletes an address', () => {
    // Create an address
    cy.get('[data-cy="af-name"]').type('Delete Me');
    cy.get('[data-cy="af-line1"]').type('123 Delete Street');
    cy.get('[data-cy="af-city"]').type('Delete City');
    cy.get('[data-cy="af-postal"]').type('54321');
    cy.get('[data-cy="af-country"]').type('Delete Country');
    cy.get('[data-cy="af-submit"]').click();

    // Wait for address to appear
    cy.get('[data-cy="al-item"]').should('have.length', 1);
    cy.get('[data-cy="al-item"]').should('contain', 'Delete Me');

    // Click delete
    cy.get('[data-cy="al-delete"]').click();

    // Verify address is removed
    cy.get('[data-cy="al-item"]').should('have.length', 0);
    cy.get('[data-cy="al-empty"]').should('contain', 'No addresses saved yet');
  });

  it('validates required fields', () => {
    // Try to submit empty form
    cy.get('[data-cy="af-submit"]').click();

    // Form should not submit (no new address created)
    cy.get('[data-cy="al-empty"]').should('contain', 'No addresses saved yet');

    // Fill only some required fields
    cy.get('[data-cy="af-name"]').type('Partial User');
    cy.get('[data-cy="af-submit"]').click();

    // Still no address created
    cy.get('[data-cy="al-empty"]').should('contain', 'No addresses saved yet');

    // Fill all required fields
    cy.get('[data-cy="af-line1"]').type('123 Complete Street');
    cy.get('[data-cy="af-city"]').type('Complete City');
    cy.get('[data-cy="af-postal"]').type('11111');
    cy.get('[data-cy="af-country"]').type('Complete Country');
    cy.get('[data-cy="af-submit"]').click();

    // Now address should be created
    cy.get('[data-cy="al-item"]').should('have.length', 1);
    cy.get('[data-cy="al-item"]').should('contain', 'Partial User');
  });

  it('navigates to address page from navbar', () => {
    // Start from home page
    cy.visit('/');
    cy.get('[data-cy="home-page"]').should('exist');

    // Click address link in navbar
    cy.get('[data-cy="address-link"]').click();

    // Should be on address page
    cy.url().should('include', '/address');
    cy.get('[data-cy="address-page"]').should('exist');
  });
});
