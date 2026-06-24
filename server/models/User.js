import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true, 
    },
    password: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

//Preventing hot-reload compilation errors in development
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;