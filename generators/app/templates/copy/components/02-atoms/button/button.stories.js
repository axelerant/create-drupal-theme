import React from 'react';

import Button from './button.twig';
import '@atoms/button/button.css';
import data from './button.json';

export default {
  title: 'Components/Button',
  component: Button,
}

export const Primary = () => (
  Button({
    button_title: data.button_title,
    variant: 'primary',
  })
);

export const Secondary = () => (
  Button({
    button_title: data.button_title,
    variant: 'secondary',
  })
);
