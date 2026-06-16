import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  skills: { type: String, default: '' },
  parsedText: { type: String, default: '' },
  generatedQuestions: { type: String, default: '' }, // JSON string of generated questions list
  timestamp: { type: Date, default: Date.now }
});

ResumeSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

ResumeSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

export default mongoose.model('Resume', ResumeSchema);
