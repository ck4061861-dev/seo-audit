import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema(
  {
    domain: { type: String, required: true, trim: true },
    overallScore: { type: Number, default: 0 },
    status: { type: String, default: 'completed' },
    reportUrl: { type: String, default: '' },
    generatedBy: { type: String, default: 'system' },
    runBy: { type: String, default: '' },
    data: { type: Object },
  },
  { timestamps: true }
);

const Audit = mongoose.model('Audit', auditSchema);
export default Audit;
