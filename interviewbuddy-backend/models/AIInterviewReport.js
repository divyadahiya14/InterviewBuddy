import mongoose from 'mongoose';

const AIInterviewReportSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  questionType: { type: String },
  questionStatement: { type: String },
  starterCode: { type: String },
  submittedCode: { type: String },
  expectedSolution: { type: String },
  timeComplexity: { type: String },
  spaceComplexity: { type: String },
  codeQuality: { type: String },
  feedback: { type: String },
  score: { type: Number },
  difficulty: { type: String },
  language: { type: String },
  status: { type: String, default: 'pending' },
  retryCount: { type: Number, default: 0 },
  attempts: { type: Number, default: 1 },
  hintsUsed: { type: Number, default: 0 },
  scores: { type: [Number], default: [] },
  timestamp: { type: Date, default: Date.now }
});

AIInterviewReportSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

AIInterviewReportSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

export default mongoose.model('AIInterviewReport', AIInterviewReportSchema);
