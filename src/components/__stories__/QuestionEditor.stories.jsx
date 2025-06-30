import React, { useState, useEffect, Fragment } from 'react';
import QuestionEditor from '../../organisms/QuestionEditor';

export default {
  title: 'Forms/QuestionEditor',
  component: QuestionEditor,
  argTypes: {
    title: { control: 'text' },
    type: {
      control: {
        type: 'select',
        options: [
          'text',
          'paragraph',
          'multiple-choice',
          'checkboxes',
          'dropdown',
          'date',
          'time',
        ],
      },
    },
    required: { control: 'boolean' },
  },
};

export const Default = (args) => {
  const [question, setQuestion] = useState({
    id: 'q1',
    title: args.title,
    type: args.type,
    options: ['Red', 'Blue'],
    required: args.required,
  });

  useEffect(() => {
  const needsOptions = ['multiple-choice', 'checkboxes', 'dropdown'].includes(args.type);
  setQuestion((prev) => ({
    ...prev,
    title: args.title,
    type: args.type,
    required: args.required,
    options: needsOptions ? prev.options.length ? prev.options : ['Option 1'] : [],
  }));
}, [args.title, args.type, args.required]);


  const updateQuestion = (id, updates) => {
    setQuestion((prev) => ({ ...prev, ...updates }));
  };

  const updateOption = (id, index, value) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    setQuestion((prev) => ({ ...prev, options: newOptions }));
  };

  const addOption = (id) => {
    setQuestion((prev) => ({
      ...prev,
      options: [...prev.options, `Option ${prev.options.length + 1}`],
    }));
  };

  const removeOption = (id, index) => {
    const newOptions = [...question.options];
    newOptions.splice(index, 1);
    setQuestion((prev) => ({ ...prev, options: newOptions }));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <QuestionEditor
        question={question}
        activeQuestion="q1"
        setActiveQuestion={() => {}}
        updateQuestion={updateQuestion}
        deleteQuestion={() => alert('Deleted')}
        duplicateQuestion={() => alert('Duplicated')}
        addOption={addOption}
        updateOption={updateOption}
        removeOption={removeOption}
      />
    </div>
  );
};

Default.args = {
  title: 'What is your favorite color?',
  type: 'multiple-choice',
  required: false,
};