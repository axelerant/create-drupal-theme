import { useEffect } from '@storybook/client-api';
import { addDecorator } from '@storybook/html';
import Twig from 'twig';
import '../dist/css/global.css';
import { setupTwig } from './setupTwig';
import './_drupal.js';

addDecorator((storyFn) => {
  useEffect(() => Drupal.attachBehaviors(), []);
  return storyFn();
});

setupTwig(Twig);

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};
