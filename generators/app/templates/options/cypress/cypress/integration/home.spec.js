describe('home', () => {
  it('vr', () => {
    cy.visit('/');
    cy.percySnapshot();
  });
});
