import React from 'react';
import { Routes, Route } from 'react-router-dom';

import FormsList from '../pages/FormsList';
import FormBuilder from '../pages/FormBuilder';
import FormFiller from '../pages/FormFiller';
import FormResponses from '../pages/FormResponses';
import MainLayout from '../template/MainLayout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<FormsList />} />
        <Route path="create" element={<FormBuilder />} />
        <Route path="edit/:formId" element={<FormBuilder />} />
        <Route path="form/:formId" element={<FormFiller />} />
        <Route path="responses/:formId" element={<FormResponses />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;