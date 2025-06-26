import { v4 as uuidv4 } from 'uuid';
import Form from '../models/Form.js';
import Response from '../models/Response.js';

export const getForms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const forms = await Form.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalForms = await Form.countDocuments();

    res.status(200).json({
      forms,
      totalForms,
      totalPages: Math.ceil(totalForms / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFormById = async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.id });
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createForm = async (req, res) => {
  try {
    const form = new Form({
      _id: uuidv4(),
      ...req.body
    });
    await form.save();
    res.status(201).json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateForm = async (req, res) => {
  try {
    const updated = await Form.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Form not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteForm = async (req, res) => {
  try {
    await Form.findOneAndDelete({ _id: req.params.id });
    await Response.deleteMany({ formId: req.params.id });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitResponse = async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.id }); // <-- Use findOne
    if (!form) return res.status(404).json({ message: 'Form not found' });

    const response = new Response({
      formId: form._id,
      answers: req.body
    });
    await response.save();
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getResponses = async (req, res) => {
  try {
    const responses = await Response.find({ formId: req.params.id });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};