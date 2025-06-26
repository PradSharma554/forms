import React, { createContext, useContext, useState } from 'react';

const FormsContext = createContext();

export const useForms = () => {
  const context = useContext(FormsContext);
  if (!context) {
    throw new Error('useForms must be used within a FormsProvider');
  }
  return context;
};

export const FormsProvider = ({ children }) => {
  const [forms, setForms] = useState([
    {
      id: '1',
      title: 'Customer Feedback Survey',
      description: 'Help us improve our services by sharing your feedback',
      questions: [
        {
          id: 'q1',
          type: 'text',
          title: 'What is your name?',
          required: true,
          options: []
        },
        {
          id: 'q2',
          type: 'multiple-choice',
          title: 'How satisfied are you with our service?',
          required: true,
          options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied']
        },
        {
          id: 'q3',
          type: 'paragraph',
          title: 'Any additional comments?',
          required: false,
          options: []
        }
      ],
      createdAt: new Date('2025-01-15'),
      responses: []
    },
    {
      id: '2',
      title: 'Event Registration',
      description: 'Register for our upcoming tech conference',
      questions: [
        {
          id: 'q1',
          type: 'text',
          title: 'Full Name',
          required: true,
          options: []
        },
        {
          id: 'q2',
          type: 'text',
          title: 'Email Address',
          required: true,
          options: []
        },
        {
          id: 'q3',
          type: 'multiple-choice',
          title: 'Which sessions are you interested in?',
          required: true,
          options: ['AI & Machine Learning', 'Web Development', 'Mobile Development', 'DevOps']
        }
      ],
      createdAt: new Date('2025-01-10'),
      responses: []
    }
  ]);

  const [responses, setResponses] = useState({});

  const createForm = (formData) => {
    const newForm = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date(),
      responses: []
    };
    setForms(prev => [...prev, newForm]);
    return newForm.id;
  };

  const updateForm = (formId, formData) => {
    setForms(prev => prev.map(form => 
      form.id === formId ? { ...form, ...formData } : form
    ));
  };

  const deleteForm = (formId) => {
    setForms(prev => prev.filter(form => form.id !== formId));
    setResponses(prev => {
      const newResponses = { ...prev };
      delete newResponses[formId];
      return newResponses;
    });
  };

  const submitResponse = (formId, responseData) => {
    const response = {
      id: Date.now().toString(),
      formId,
      answers: responseData,
      submittedAt: new Date()
    };

    setResponses(prev => ({
      ...prev,
      [formId]: [...(prev[formId] || []), response]
    }));

    return response.id;
  };

  const getFormResponses = (formId) => {
    return responses[formId] || [];
  };

  const value = {
    forms,
    responses,
    createForm,
    updateForm,
    deleteForm,
    submitResponse,
    getFormResponses
  };

  return (
    <FormsContext.Provider value={value}>
      {children}
    </FormsContext.Provider>
  );
};