import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/atoms/button';
import { Input } from '@/atoms/input';
import { Textarea } from '@/atoms/textarea';
import { Card, CardContent } from '@/molecules/card';
import FormSaved from '@/organisms/FormSaved';
import QuestionEditor from '@/organisms/QuestionEditor';
import { Eye, Save, ArrowLeft } from 'lucide-react';
import {
  createForm,
  getFormById,
  updateForm,
} from '../../api/formsAPI';

const QUESTION_TYPES = [
  { value: 'text', label: 'Short Answer' },
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'checkboxes', label: 'Checkboxes' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'date', label: 'Date' },
  { value: 'time', label: 'Time' },
];

const FormBuilder = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { formId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: formFromServer } = useQuery({
    queryKey: ['form', formId],
    queryFn: () => getFormById(formId),
    enabled: !!formId,
  });

  const createMutation = useMutation({
    mutationFn: createForm,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['forms']);
      setFormSaved(true);
      setFormData(data);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ formId, updatedForm }) => updateForm({ formId, updatedForm }),
    onSuccess: () => queryClient.invalidateQueries(['forms']),
  });

  const [formSaved, setFormSaved] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Untitled Form',
    description: '',
    questions: [],
  });
  const [activeQuestion, setActiveQuestion] = useState(null);

  useEffect(() => {
    if (formFromServer) {
      setFormData(formFromServer);
    }
  }, [formFromServer]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (formId) {
        await updateMutation.mutateAsync({ formId, updatedForm: formData });
      } else {
        const newForm = await createMutation.mutateAsync(formData);
        setFormData(newForm);
      }
      setFormSaved(true);
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  };

  const handleAddQuestion = (type) => {
    const newQuestion = {
      id: uuidv4(),
      type,
      title: 'Untitled Question',
      required: false,
      options: ['multiple-choice', 'checkboxes', 'dropdown'].includes(type) ? ['Option 1'] : [],
    };
    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
    setActiveQuestion(newQuestion.id);
  };

  if (formSaved) {
    return <FormSaved onCreateAnother={() => {
      setFormData({ title: 'Untitled Form', description: '', questions: [] });
      setFormSaved(false);
    }} />;
  }

  return (
    <div>
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center px-4 h-16">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')}> <ArrowLeft className="w-4 h-4 mr-2" /> Back </Button>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="text-lg font-semibold border-none shadow-none focus:ring-0"
              placeholder="Form title"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/form/${formId || ''}`)}>
              <Eye className="w-4 h-4 mr-1" /> Preview
            </Button>

            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-1" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>

          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardContent>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Form description"
              rows={2}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          {formData.questions.map((question) => (
            <QuestionEditor
              key={question.id}
              question={question}
              activeQuestion={activeQuestion}
              setActiveQuestion={setActiveQuestion}
              updateQuestion={(id, changes) => {
                setFormData((prev) => ({
                  ...prev,
                  questions: prev.questions.map((q) => q.id === id ? { ...q, ...changes } : q),
                }));
              }}
              deleteQuestion={(id) => {
                setFormData((prev) => ({
                  ...prev,
                  questions: prev.questions.filter((q) => q.id !== id),
                }));
              }}
              duplicateQuestion={(id) => {
                const original = formData.questions.find((q) => q.id === id);
                const clone = { ...original, id: uuidv4(), title: `${original.title} (Copy)` };
                const index = formData.questions.findIndex((q) => q.id === id);
                const newQuestions = [...formData.questions];
                newQuestions.splice(index + 1, 0, clone);
                setFormData((prev) => ({ ...prev, questions: newQuestions }));
              }}
              addOption={(id) => {
                setFormData((prev) => ({
                  ...prev,
                  questions: prev.questions.map((q) =>
                    q.id === id ? { ...q, options: [...q.options, `Option ${q.options.length + 1}`] } : q
                  ),
                }));
              }}
              updateOption={(qid, idx, val) => {
                setFormData((prev) => ({
                  ...prev,
                  questions: prev.questions.map((q) =>
                    q.id === qid ? { ...q, options: q.options.map((opt, i) => (i === idx ? val : opt)) } : q
                  ),
                }));
              }}
              removeOption={(qid, idx) => {
                setFormData((prev) => ({
                  ...prev,
                  questions: prev.questions.map((q) =>
                    q.id === qid ? { ...q, options: q.options.filter((_, i) => i !== idx) } : q
                  ),
                }));
              }}
            />
          ))}
        </div>

        <Card className="mt-6 border-2">
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {QUESTION_TYPES.map((type) => (
                <Button
                  key={type.value}
                  variant="outline"
                  onClick={() => handleAddQuestion(type.value)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormBuilder;