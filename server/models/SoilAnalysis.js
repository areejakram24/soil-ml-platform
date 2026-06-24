import mongoose from 'mongoose';

const soilAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // the 7 soil metrics
    nitrogen: {
      type: Number,
      required: true,
    },
    phosphorus: {
      type: Number,
      required: true,
    },
    potassium: {
      type: Number,
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    humidity: {
      type: Number,
      required: true,
    },
    ph: {
      type: Number,
      required: true,
      min: 0,
      max: 14, //basic verification for pH scale limits
    },
    rainfall: {
      type: Number,
      required: true,
    },
    // ML Inference
    predictedCrop: {
      type: String,
      default: '', 
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Preventing hot-reload model compilation errors
const SoilAnalysis = mongoose.models.SoilAnalysis || mongoose.model('SoilAnalysis', soilAnalysisSchema);

export default SoilAnalysis;