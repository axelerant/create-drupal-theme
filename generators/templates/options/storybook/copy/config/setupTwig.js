import twigDrupal from 'twig-drupal-filters';
import twigAddAttributes from 'add-attributes-twig-extension';

export const setupTwig = function setupTwig(twig) {
  twig.cache();
  twigDrupal(twig);
  twigAddAttributes(twig);
  return twig;
};
