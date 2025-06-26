import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import NavBar from "@/organisms/NavBar";
import { getFormById, submitFormResponse } from '../../api/formsAPI';
import { Button } from '@/atoms/button';
import { Input } from '@/atoms/input';
import { Textarea } from '@/atoms/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/molecules/card';
import { RadioGroup, RadioGroupItem } from '@/molecules/radio-group';
import { Checkbox } from '@/atoms/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/molecules/select';
import { Label } from '@/atoms/label';
import { Alert, AlertDescription } from '@/atoms/alert';
import { CheckCircle, AlertCircle, FileText } from 'lucide-react';

const FormFiller = () => {
  const { formId } = useParams();
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data: form, isLoading, isError } = useQuery({
    queryKey: ['form', formId],
    queryFn: () => getFormById(formId),
    enabled: !!formId,
    onSuccess: (form) => {
      const initial = {};
      form.questions.forEach(q => {
        initial[q.id] = q.type === 'checkboxes' ? [] : '';
      });
      setAnswers(initial);
    }
  });

  const mutation = useMutation({
    mutationFn: ({ formId, response }) => submitFormResponse({ formId, response }),
    onSuccess: () => setIsSubmitted(true)
  });

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    if (errors[questionId]) setErrors(prev => ({ ...prev, [questionId]: null }));
  };

  const handleCheckboxChange = (questionId, optionValue, checked) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      return {
        ...prev,
        [questionId]: checked ? [...current, optionValue] : current.filter(v => v !== optionValue)
      };
    });
    if (errors[questionId]) setErrors(prev => ({ ...prev, [questionId]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    form.questions.forEach(q => {
      if (q.required) {
        const val = answers[q.id];
        if ((q.type === 'checkboxes' && (!val || val.length === 0)) ||
            (typeof val === 'string' && val.trim() === '')) {
          newErrors[q.id] = 'This question is required';
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setTimeout(() => {
      mutation.mutate({ formId, response: answers });
    }, 500);
  };

  const renderQuestion = (q) => {
    const val = answers[q.id];
    const err = errors[q.id];

    return (
      <Card key={q.id} className="mb-6">
        <CardContent className="p-6 space-y-4">
          <Label className="text-base font-medium text-gray-900">
            {q.title}{q.required && <span className="text-red-500 ml-1">*</span>}
          </Label>

          {q.type === 'text' && (
            <Input value={val} onChange={(e) => handleAnswerChange(q.id, e.target.value)} className={err ? 'border-red-500' : ''} />
          )}

          {q.type === 'paragraph' && (
            <Textarea value={val} placeholder="Type your answer" onChange={(e) => handleAnswerChange(q.id, e.target.value)} rows={4} className={err ? 'border-red-500' : ''} />
          )}

          {q.type === 'multiple-choice' && (
            <RadioGroup value={val} onValueChange={(v) => handleAnswerChange(q.id, v)} className={err ? 'border border-red-500 rounded-md p-2' : ''}>
              {q.options.map((opt, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt} id={`${q.id}-${i}`} />
                  <Label htmlFor={`${q.id}-${i}`}>{opt}</Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {q.type === 'checkboxes' && (
            <div className={err ? 'border border-red-500 rounded-md p-2 space-y-2' : 'space-y-2'}>
              {q.options.map((opt, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${q.id}-${i}`}
                    checked={val?.includes(opt)}
                    onChange={(checked) => handleCheckboxChange(q.id, opt, checked)}
                  />
                  <Label htmlFor={`${q.id}-${i}`}>{opt}</Label>
                </div>
              ))}
            </div>
          )}

          {q.type === 'dropdown' && (
            <Select value={val} onValueChange={(v) => handleAnswerChange(q.id, v)}>
              <SelectTrigger className={err ? 'border-red-500' : ''}>
                <SelectValue placeholder="Choose an option" />
              </SelectTrigger>
              <SelectContent>
                {q.options.map((opt, i) => (
                  <SelectItem key={i} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {q.type === 'date' && (
            <Input type="date" value={val} onChange={(e) => handleAnswerChange(q.id, e.target.value)} className={`w-48 ${err ? 'border-red-500' : ''}`} />
          )}

          {q.type === 'time' && (
            <Input type="time" value={val} onChange={(e) => handleAnswerChange(q.id, e.target.value)} className={`w-48 ${err ? 'border-red-500' : ''}`} />
          )}

          {err && <p className="text-sm text-red-500 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{err}</p>}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) return <div className="text-center py-20 text-gray-500">Loading...</div>;
  if (isError || !form) return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div>
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold">Form not found</h2>
        <p className="text-gray-500 mb-4">The form you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/')}>Back to Forms</Button>
      </div>
    </div>
  );

  if (isSubmitted) return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Response submitted</h2>
          <p className="text-gray-600 mb-6">Thank you for your response!</p>
          <div className="space-y-2">
            <Button onClick={() => navigate('/')} className="w-full">Back to Forms</Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsSubmitted(false);
                const initial = {};
                form.questions.forEach(q => {
                  initial[q.id] = q.type === 'checkboxes' ? [] : '';
                });
                setAnswers(initial);
              }}
              className="w-full"
            >
              Submit another response
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader className="border-l-4 border-l-purple-500">
            <CardTitle className="text-2xl font-bold">{form.title}</CardTitle>
            {form.description && <CardDescription className="mt-2">{form.description}</CardDescription>}
          </CardHeader>
        </Card>

        {form.questions.some(q => q.required) && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Fields marked with * are required.</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {form.questions.map(renderQuestion)}

          <div className="mt-8">
            <Button type="submit" size="lg" disabled={mutation.isLoading} className="bg-purple-600 hover:bg-purple-700">
              {mutation.isLoading ? 'Submitting...' : 'Submit'}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default FormFiller;