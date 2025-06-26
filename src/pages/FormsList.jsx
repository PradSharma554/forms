import React, { useState, useEffect, useCallback, useRef, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient, useMutation, useInfiniteQuery } from '@tanstack/react-query';
import { Button } from '@/atoms/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/molecules/card';
import { Plus, FileText, Users, Calendar, MoreVertical, Eye, Edit, Loader2 } from 'lucide-react';
import Navbar from '@/organisms/NavBar';
import { fetchForms, deleteForm as deleteFormAPI, fetchFormResponses } from '../../api/formsAPI';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/molecules/dropdown-menu';

import { Dialog, Transition } from '@headlessui/react';

const FormsList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isRedirecting, setIsRedirecting] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ['forms'],
    queryFn: ({ pageParam = 1 }) => fetchForms(pageParam, 9),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const forms = data ? data.pages.flatMap(page => page.forms) : [];

  const deleteMutation = useMutation({
    mutationFn: deleteFormAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['forms']);
      setIsConfirmOpen(false);
      setFormToDelete(null);
    },
    onError: (error) => {
      console.error("Error deleting form:", error);
      setIsConfirmOpen(false);
      setFormToDelete(null);
    }
  });

  const [responsesMap, setResponsesMap] = useState({});
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredForms, setFilteredForms] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (isFetchingNextPage || !hasNextPage) return;

      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.body.offsetHeight - 100; // 100px from the bottom

      if (scrollPosition >= threshold) {
        fetchNextPage();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]); // Dependencies for the effect

  // CORRECTED: Removed responsesMap from dependency array
  useEffect(() => {
    const fetchResponsesForForms = async () => {
      if (!forms.length) return;
      const newResponsesBatch = {};
      const formsToProcess = forms.filter(
        form => form && form._id && responsesMap[form._id] === undefined
      );
      if (!formsToProcess.length) return;
      for (const form of formsToProcess) {
        try {
          const responses = await fetchFormResponses(form._id);
          newResponsesBatch[form._id] = Array.isArray(responses) ? responses.length : 0;
        } catch (e) {
          newResponsesBatch[form._id] = 0;
        }
      }
      setResponsesMap(prevMap => ({ ...prevMap, ...newResponsesBatch }));
    };
    fetchResponsesForForms();
  }, [forms]); // Only re-run when `forms` changes

  const handleCreateForm = () => navigate('/create');
  const handleEditForm = (formId) => navigate(`/edit/${formId}`);
  const handleViewForm = (formId) => navigate(`/form/${formId}`);

  const handleViewResponses = (formId) => {
    setIsRedirecting(true);
    setTimeout(() => navigate(`/responses/${formId}`), 100);
  };

  const handleDeleteForm = (formId) => {
    setFormToDelete(forms.find(form => form._id === formId));
    setIsConfirmOpen(true);
  };

  const confirmDeleteAction = () => {
    if (formToDelete) {
      deleteMutation.mutate(formToDelete._id);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const handleGlobalKeyDown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      setSearchOpen(true);
      setSearchQuery('');
      // When opening search, ensure filteredForms is set to all forms
      setFilteredForms(forms);
    } else if (e.key === 'Escape') {
      setSearchOpen(false);
      setIsConfirmOpen(false);
    }
  }, [forms]); // `forms` is needed here to initialize `filteredForms` when search opens

  useEffect(() => {
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleGlobalKeyDown]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredForms(forms);
      return;
    }
    const q = searchQuery.toLowerCase();
    const matched = forms.filter(f =>
      (f?.title || '').toLowerCase().includes(q) ||
      (f?.description || '').toLowerCase().includes(q)
    );
    setFilteredForms(matched);
    setActiveIndex(0);
  }, [searchQuery, forms]);

  const handleResultKeyDown = (e) => {
    if (filteredForms.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filteredForms.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filteredForms.length) % filteredForms.length);
    } else if (e.key === 'Enter') {
      if (filteredForms[activeIndex]) {
        handleViewForm(filteredForms[activeIndex]._id);
        setSearchOpen(false);
      }
    }
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setSearchOpen(false);
    }
  };

  useEffect(() => {
    if (searchOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    } else {
      window.removeEventListener('mousedown', handleClickOutside);
    }
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [searchOpen]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
        <p className="mt-4 text-lg text-gray-700">Loading forms...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-red-600">Error loading forms: {error.message}</p>
      </div>
    );
  }

  if (isRedirecting) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
        <p className="mt-4 text-lg text-gray-700">Loading responses...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      {searchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-start justify-center pt-20 px-4">
          <div ref={modalRef} className="bg-white w-full max-w-lg rounded-xl shadow-lg p-4">
            <input
              autoFocus
              onKeyDown={handleResultKeyDown}
              className="w-full border px-3 py-2 rounded mb-4 text-sm outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Search forms (Cmd/Ctrl + K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredForms.length === 0 && searchQuery.trim() !== '' ? (
                <p className="text-sm text-gray-500 text-center">No matching forms found.</p>
              ) : (
                filteredForms.map((form, idx) => (
                  <div
                    key={form._id}
                    onClick={() => {
                      handleViewForm(form._id);
                      setSearchOpen(false);
                    }}
                    className={`cursor-pointer border px-4 py-2 rounded hover:bg-purple-50 ${
                      idx === activeIndex ? 'bg-purple-100' : ''
                    }`}
                  >
                    <div className="font-medium text-gray-800 truncate">{form.title}</div>
                    <div className="text-sm text-gray-500 truncate">
                      {form.description || 'No description'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end items-center mb-6">
          <input
            onClick={() => {
              setSearchOpen(true);
              setSearchQuery('');
              setFilteredForms(forms);
            }}
            readOnly
            placeholder="Search forms... (Cmd/Ctrl + K)"
            className="w-72 border rounded px-3 py-2 text-sm cursor-pointer text-gray-600 bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Start a new form</h2>
          <div className="flex space-x-4 justify-center">
            <Card
              className="w-48 h-32 cursor-pointer hover:shadow-md transition-shadow border-2 border-gray-300 hover:border-purple-400"
              onClick={handleCreateForm}
            >
              <CardContent className="flex flex-col items-center justify-center h-full">
                <Plus className="w-8 h-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Blank form</span>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent forms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {forms.map((form) => {
              const responseCount = responsesMap[form._id] ?? 0;
              return (
                <Card key={form._id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle
                          className="flex justify-start text-lg font-semibold text-gray-900 truncate group-hover:text-purple-600 transition-colors"
                          onClick={() => handleViewForm(form._id)}
                        >
                          {form.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500 mt-1 text-left line-clamp-2">
                          {form.description || 'No description'}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewForm(form._id)}>View Form</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditForm(form._id)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewResponses(form._id)}>
                            View Responses ({responseCount})
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteForm(form._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(form.createdAt)}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {responseCount} responses
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleViewForm(form._id)} className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" onClick={() => handleEditForm(form._id)} className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Loading indicator for infinite scroll */}
          {isFetchingNextPage && (
            <div className="flex justify-center mt-6">
              <Loader2 className="h-6 w-6 text-purple-600 animate-spin" />
              <p className="ml-2 text-gray-700">Loading more forms...</p>
            </div>
          )}

          {/* Message when all forms are loaded */}
          {!hasNextPage && forms.length > 0 && (
            <p className="text-center text-gray-500 mt-6">No more forms to load.</p>
          )}
        </div>
      </div>

      <Transition appear show={isConfirmOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsConfirmOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold text-gray-900 leading-6 mb-2"
                  >
                    Delete form?
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-4">
                      Are you sure you want to delete <strong>{formToDelete?.title}</strong>? This action cannot be undone.
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      onClick={() => setIsConfirmOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={confirmDeleteAction}
                      disabled={deleteMutation.isPending}
                      className="hover:bg-gray-200"
                    >
                      {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>

        </Dialog>
      </Transition>
    </div>
  );
};

export default FormsList;