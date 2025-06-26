import React, { useEffect, useState, Fragment } from 'react';
import { Input } from '@/atoms/input';
import { Textarea } from '@/atoms/textarea';
import { Button } from '@/atoms/button';
import { Label } from '@/atoms/label';
import { Card, CardContent, CardHeader } from '@/molecules/card';

import { Listbox, Transition, Switch } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

import {
  GripVertical, Trash2, Plus, Copy,
  CheckSquare, Circle, Type, AlignLeft, List, Calendar, Clock
} from 'lucide-react';

import { cn } from '@/lib/utils';

const QUESTION_TYPES = [
  { value: 'text', label: 'Short answer', icon: Type },
  { value: 'paragraph', label: 'Paragraph', icon: AlignLeft },
  { value: 'multiple-choice', label: 'Multiple choice', icon: Circle },
  { value: 'checkboxes', label: 'Checkboxes', icon: CheckSquare },
  { value: 'dropdown', label: 'Dropdown', icon: List },
  { value: 'date', label: 'Date', icon: Calendar },
  { value: 'time', label: 'Time', icon: Clock }
];

const QuestionEditor = ({
  question,
  activeQuestion,
  setActiveQuestion,
  updateQuestion,
  deleteQuestion,
  duplicateQuestion,
  addOption,
  updateOption,
  removeOption
}) => {
  const [questionTitle, setQuestionTitle] = useState(question.title);
  const [optionValues, setOptionValues] = useState(question.options);

  useEffect(() => {
    setQuestionTitle(question.title);
  }, [question.title]);

  useEffect(() => {
    setOptionValues(question.options);
  }, [question.options]);

  const IconComponent = QUESTION_TYPES.find(t => t.value === question.type)?.icon || Type;
  const selectedQuestionType = QUESTION_TYPES.find(t => t.value === question.type);

  return (
    <Card className={`mb-4 ${activeQuestion === question.id ? 'ring-2 ring-purple-700' : ''}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2 mb-4">
          <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
          <IconComponent className="w-5 h-5 text-gray-600" />
          <Input
            value={questionTitle}
            onChange={(e) => setQuestionTitle(e.target.value)}
            onBlur={() => updateQuestion(question.id, { title: questionTitle })}
            onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
            onClick={() => setActiveQuestion(question.id)}
            className="text-lg font-medium border-none shadow-none p-0 focus-visible:ring-0"
            placeholder="Question title"
          />
        </div>

        <Listbox
          value={question.type}
          onChange={(value) => {
            const newOptions = ['multiple-choice', 'checkboxes', 'dropdown'].includes(value)
              ? ['Option 1'] : [];
            updateQuestion(question.id, { type: value, options: newOptions });
          }}
        >
          {({ open }) => (
            <div className="relative w-48">
              <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 sm:text-sm sm:leading-6">
                <span className="flex items-center">
                  {selectedQuestionType && (
                    <selectedQuestionType.icon className="h-5 w-5 text-gray-400 mr-2" aria-hidden="true" />
                  )}
                  <span className="block truncate">{selectedQuestionType?.label}</span>
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {QUESTION_TYPES.map((type) => (
                    <Listbox.Option
                      key={type.value}
                      className={({ active }) =>
                        cn(
                          active ? 'bg-purple-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9'
                        )
                      }
                      value={type.value}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <type.icon
                              className={cn(selected ? 'text-white' : 'text-gray-400', 'h-5 w-5 flex-shrink-0 mr-2')}
                              aria-hidden="true"
                            />
                            <span className={cn(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                              {type.label}
                            </span>
                          </div>
                          {selected && (
                            <span
                              className={cn(
                                active ? 'text-white' : 'text-purple-600',
                                'absolute inset-y-0 right-0 flex items-center pr-4'
                              )}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          )}
        </Listbox>
      </CardHeader>

      <CardContent>
        {['multiple-choice', 'checkboxes', 'dropdown'].includes(question.type) && (
          <div className="space-y-2 mb-4">
            {optionValues.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                {question.type === 'multiple-choice' && <Circle className="w-4 h-4 text-gray-400" />}
                {question.type === 'checkboxes' && <CheckSquare className="w-4 h-4 text-gray-400" />}
                {question.type === 'dropdown' && <span className="text-gray-400 text-sm">{index + 1}.</span>}
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...optionValues];
                    newOptions[index] = e.target.value;
                    setOptionValues(newOptions);
                  }}
                  onBlur={() => updateOption(question.id, index, optionValues[index])}
                  onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                  className="flex-1"
                  placeholder={`Option ${index + 1}`}
                />
                {optionValues.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(question.id, index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => addOption(question.id)}
              className="text-purple-600 hover:text-purple-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add option
            </Button>
          </div>
        )}

        {question.type === 'text' && (
          <Input placeholder="Short answer text" disabled className="mb-4" />
        )}
        {question.type === 'paragraph' && (
          <Textarea placeholder="Long answer text" disabled className="mb-4" />
        )}
        {question.type === 'date' && (
          <Input type="date" disabled className="mb-4 w-48" />
        )}
        {question.type === 'time' && (
          <Input type="time" disabled className="mb-4 w-48" />
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => duplicateQuestion(question.id)}
            >
              <Copy className="w-4 h-4 mr-1" />
              Duplicate
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteQuestion(question.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor={`required-${question.id}`} className="text-sm">Required</Label>
            <Switch
              checked={question.required}
              onChange={(checked) => updateQuestion(question.id, { required: checked })}
              className={cn(
                question.required ? 'bg-purple-600' : 'bg-gray-200',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2'
              )}
            >
              <span className="sr-only">Toggle required</span>
              <span
                aria-hidden="true"
                className={cn(
                  question.required ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                )}
              />
            </Switch>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionEditor;