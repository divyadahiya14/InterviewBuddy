import mongoose from 'mongoose';

const AvailabilitySchema = new mongoose.Schema({
  date: { type: String, required: true },
  timeSlots: { type: [String], default: [] }
});

const InterviewerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String },
  email: { type: String, unique: true, index: true },
  password: { type: String },
  intro: { type: String },
  speciality: { type: String },
  experience: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  linkedin: { type: String },
  github: { type: String },
  bio: { type: String },
  languages: { type: String },
  rating: { type: String, default: "0.0" },
  ratingsList: { type: [Number], default: [] },
  upiId: { type: String },
  availability: { type: [AvailabilitySchema], default: [] }
});

// Duplicate the id field from _id to keep compatibility with UI
InterviewerSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
InterviewerSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

export default mongoose.model('Interviewer', InterviewerSchema);
