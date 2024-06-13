describe('Main Page', () => {
  it('should load correctly', () => {
    cy.visit('http://localhost:3000/');
    cy.contains('Pick your game').should('exist');
  });

});
