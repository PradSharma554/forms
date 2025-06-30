import React, { useState } from 'react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '../select';

export default {
  title: 'Atoms/Select',
  component: Select,
  argTypes: {
    value: {
      control: 'text',
      defaultValue: 'apple',
    },
  },
};

export const Default = (args) => {
  const [value, setValue] = useState(args.value || 'apple');

  return (
    <div className="max-w-xs">
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

Default.args = {
  value: 'apple',
};