import React from 'react';
import {Button} from '../button';

export default {
  title: 'Atoms/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['default', 'outline', 'ghost'],
    },
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
    },
    children: {
      control: 'text',
      defaultValue: 'Click Me',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

const Template = (args) => <Button {...args} />;

export const Playground = Template.bind({});
Playground.args = {
  variant: 'default',
  size: 'md',
  children: 'Click Me',
  disabled: false,
};