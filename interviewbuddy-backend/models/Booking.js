import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  intervieweeEmail: { type: String, required: true },
  interviewerEmail: { type: String, required: true },
  interviewerId: { type: String, required: true },
  date: { type: String, required: true },
  selectedSlot: { type: String, required: true },
  paymentId: { type: String },
  orderId: { type: String },
  status: { type: String, default: 'PENDING' },
  meetLink: { type: String }
});

// Virtual id matching Spring Boot
BookingSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

BookingSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

export default mongoose.model('Booking', BookingSchema);
