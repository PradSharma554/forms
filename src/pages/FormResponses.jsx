import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getFormById, fetchFormResponses } from '../../api/formsAPI';
import { Button } from '@/atoms/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/molecules/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../organisms/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../organisms/tabs';
import { Badge } from '@/atoms/badge';
import {
  ArrowLeft,
  Download, // Not used in the provided code, consider removing if truly unused
  Users,
  Calendar,
  BarChart3,
  FileText,
  Eye
} from 'lucide-react';

const FormResponses = () => {
  const { formId } = useParams();
  const navigate = useNavigate();

  // Fetch the specific form directly using getFormById
  const { data: form, isLoading: isLoadingForm, isError: isErrorForm } = useQuery({
    queryKey: ['form', formId],
    queryFn: () => getFormById(formId),
    enabled: !!formId,
  });

  const { data: responses = [], isLoading: isLoadingResponses, isError: isErrorResponses } = useQuery({
    queryKey: ['responses', formId],
    queryFn: () => fetchFormResponses(formId),
    enabled: !!formId,
  });

  const formatDate = (date) => {
    if (!date) return '-';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const formatAnswer = (answer, questionType) => {
    if (!answer) return '-';
    if (questionType === 'checkboxes' && Array.isArray(answer)) {
      return answer.length > 0 ? answer.join(', ') : '-';
    }
    return answer.toString();
  };

  const getQuestionStats = (questionId) => {
    const question = form?.questions.find(q => q.id === questionId);
    if (!question) return null;

    const answers = responses.map(response => response.answers[questionId]).filter(Boolean);

    if (['multiple-choice', 'dropdown'].includes(question.type)) {
      const stats = {};
      question.options.forEach(option => {
        stats[option] = answers.filter(answer => answer === option).length;
      });
      return stats;
    }

    if (question.type === 'checkboxes') {
      const stats = {};
      question.options.forEach(option => {
        stats[option] = answers.filter(answer => Array.isArray(answer) && answer.includes(option)).length;
      });
      return stats;
    }

    return null;
  };

  if (isLoadingForm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading form details...</p>
      </div>
    );
  }

  if (isErrorForm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error loading form</h2>
          <p className="text-gray-500 mb-4">There was an issue fetching the form data.</p>
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="!px-2">
            <ArrowLeft className="w-4 h-4 mr-2 px-0" />
            <span className="hidden sm:inline">Back</span>
          </Button>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Form not found</h2>
          <p className="text-gray-500 mb-4">The form you're looking for doesn't exist.</p>
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="!px-2">
            <ArrowLeft className="w-4 h-4 mr-2 px-0" />
            <span className="hidden sm:inline">Back</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="!px-2">
                <ArrowLeft className="w-4 h-4 mr-2 px-0" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{form.title}</h1>
                <p className="text-sm text-gray-500 hidden sm:inline">Responses</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => navigate(`/form/${formId}`)}>
                <Eye className="w-4 h-4 sm:mr-2 mx-auto" />
                <span className="hidden sm:inline">Preview</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{responses.length}</p>
                  <p className="text-sm text-gray-500">Total Responses</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{form.questions.length}</p>
                  <p className="text-sm text-gray-500">Questions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {responses.length > 0 ? formatDate(Math.max(...responses.map(r => new Date(r.submittedAt)))) : '-'}
                  </p>
                  <p className="text-sm text-gray-500">Last Response</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {isLoadingResponses ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-600">Loading responses...</p>
            </CardContent>
          </Card>
        ) : isErrorResponses ? (
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-xl font-semibold text-red-900 mb-2">Error loading responses</h3>
              <p className="text-gray-500 mb-6">There was an issue fetching the form responses.</p>
            </CardContent>
          </Card>
        ) : responses.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No responses yet</h3>
              <p className="text-gray-500 mb-6">Share your form to start collecting responses</p>
              <Button onClick={() => navigate(`/form/${formId}`)}>
                <Eye className="w-4 h-4 mr-2" />
                View Form
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="responses" className="space-y-6">
            <TabsList>
              <TabsTrigger value="responses">
                <FileText className="w-4 h-4 mr-2" />
                Responses
              </TabsTrigger>
              <TabsTrigger value="summary">
                <BarChart3 className="w-4 h-4 mr-2" />
                Summary
              </TabsTrigger>
            </TabsList>

            <TabsContent value="responses">
              <Card>
                <CardHeader>
                  <CardTitle>Individual Responses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-40">Timestamp</TableHead>
                          {form.questions.map((question) => (
                            <TableHead key={question.id} className="min-w-48">
                              {question.title}
                              {question.required && (
                                <Badge variant="secondary" className="ml-2 text-xs">Required</Badge>
                              )}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {responses.map((response) => (
                          <TableRow key={response.id}>
                            <TableCell className="font-medium">{formatDate(response.submittedAt)}</TableCell>
                            {form.questions.map((question) => (
                              <TableCell key={question.id}>{formatAnswer(response.answers[question.id], question.type)}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="summary">
              <div className="space-y-6">
                {form.questions.map((question) => {
                  const stats = getQuestionStats(question.id);
                  return (
                    <Card key={question.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{question.title}</CardTitle>
                        <p className="text-sm text-gray-500 capitalize">
                          {question.type.replace('-', ' ')} • {responses.length} responses
                        </p>
                      </CardHeader>
                      <CardContent>
                        {stats ? (
                          <div className="space-y-3">
                            {Object.entries(stats).map(([option, count]) => (
                              <div key={option} className="flex items-center justify-between">
                                <span className="text-sm">{option}</span>
                                <div className="flex items-center space-x-2">
                                  <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-purple-600 h-2 rounded-full"
                                      style={{ width: `${responses.length > 0 ? (count / responses.length) * 100 : 0}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium w-12 text-right">
                                    {count} ({responses.length > 0 ? Math.round((count / responses.length) * 100) : 0}%)
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {responses.map((response, index) => (
                              <div key={index} className="p-3 bg-gray-50 rounded-md">
                                <p className="text-sm">{formatAnswer(response.answers[question.id], question.type)}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default FormResponses;