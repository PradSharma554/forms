import express from 'express';
import {
  getForms,
  getFormById,
  createForm,
  updateForm,
  deleteForm,
  submitResponse,
  getResponses
} from '../controllers/formController.js';

const router = express.Router();

router.get('/forms', getForms);
router.get('/forms/:id', getFormById);
router.post('/forms', createForm);
router.put('/forms/:id', updateForm);
router.delete('/forms/:id', deleteForm);
router.post('/forms/:id/responses', submitResponse);
router.get('/forms/:id/responses', getResponses);

export default router;