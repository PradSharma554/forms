import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  id: String,
  title: String,
  type: String,
  options: [String],
  required: Boolean
}, { _id: false });

const formSchema = new mongoose.Schema({
  _id: String,
  title: { type: String, required: true },
  description: String,
  questions: [questionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Form', formSchema);