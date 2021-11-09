const twigDrupal = require('twig-drupal-filters');
const twigAddAttributes = require('add-attributes-twig-extension');

module.exports.setupTwig = function setupTwig(twig) {
  twig.cache();
  twigDrupal(twig);
  twigAddAttributes(twig);
  return twig;
};
