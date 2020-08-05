module.exports = {
  ci: {
    collect: {
      numberOfRuns: 1,
      url: ['http://localhost/'],
      settings: {
        chromeFlags: '--no-sandbox',
      },
    },
    assert: {
      preset: 'lighthouse:no-pwa',
    },
    upload: {
      target: 'lhci',
      serverBaseUrl: process.env.LHCI_DASHBOARD_URL,
      token: process.env.LHCI_TOKEN,
    },
  },
};
