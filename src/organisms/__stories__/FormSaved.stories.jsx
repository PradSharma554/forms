import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import FormSaved from '../FormSaved';

export default {
  title: 'Forms/FormSaved',
  component: FormSaved,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    primaryButtonLabel: { control: 'text' },
    secondaryButtonLabel: { control: 'text' },
    onCreateAnother: { action: 'clicked create another' },
  },
};

const Template = (args) => <FormSaved {...args} />;

export const Playground = Template.bind({});
Playground.args = {
  title: 'You have successfully built a form',
  description: 'Your form has been saved and is ready to use.',
  primaryButtonLabel: 'Back to Forms',
  secondaryButtonLabel: 'Create Another Form',
};