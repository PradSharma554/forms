import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

async function handleRequest(request) {
  try {
    const response = await request();
    return response.data;
  } catch (error) {
    console.error('API request error:', error);
    throw new Error(`API request failed: ${error.message}`);
  }
}

export const fetchForms = async (page = 1, limit = 9) => {
  return handleRequest(() => axios.get(`${API_BASE}/forms`, {
    params: { page, limit }
  }));
};

export const getFormById = async (formId) => {
  if (!formId) throw new Error('formId is required');
  return handleRequest(() => axios.get(`${API_BASE}/forms/${formId}`));
};

export const createForm = async (formData) => {
  if (!formData) throw new Error('formData is required');
  return handleRequest(() => axios.post(`${API_BASE}/forms`, formData));
};

export const updateForm = async ({ formId, updatedForm }) => {
  if (!formId || !updatedForm) throw new Error('formId and updatedForm are required');
  return handleRequest(() => axios.put(`${API_BASE}/forms/${formId}`, updatedForm));
};

export const deleteForm = async (formId) => {
  if (!formId) throw new Error('formId is required');
  return handleRequest(() => axios.delete(`${API_BASE}/forms/${formId}`));
};

export const submitFormResponse = async ({ formId, response }) => {
  if (!formId || !response) throw new Error('formId and response are required');
  return handleRequest(() => axios.post(`${API_BASE}/forms/${formId}/responses`, response));
};

export const fetchFormResponses = async (formId) => {
  if (!formId) throw new Error('formId is required');
  return handleRequest(() => axios.get(`${API_BASE}/forms/${formId}/responses`));
};