import buttonTemplate from './button.twig';
import buttonData from './button.json';
import '@atoms/button/button.css';

export default {
  title: 'Components/Button',
  component: buttonTemplate,
}

export const Primary = () => (
  buttonTemplate({
    button_title: buttonData.button_title,
    variant: 'primary',
  })
);

export const Secondary = () => (
  buttonTemplate({
    button_title: buttonData.button_title,
    variant: 'secondary',
  })
);
