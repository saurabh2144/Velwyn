import mongoose from 'mongoose';

export type User = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  verified: boolean;
  verificationToken?: string;
  verificationExpires?: Date;
};

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: { 
      type: Boolean, 
      required: true, 
      default: false 
    },
    verified: { 
      type: Boolean, 
      default: false 
    },
    verificationToken: { 
      type: String 
    },
    verificationExpires: { 
      type: Date 
    },
  },
  { 
    timestamps: true 
  },
);

// Add indexes for better performance
UserSchema.index({ verificationToken: 1 });
UserSchema.index({ verificationExpires: 1 }, { expireAfterSeconds: 0 });
UserSchema.index({ email: 1 }, { unique: true });

const UserModel = mongoose.models?.User || mongoose.model('User', UserSchema);

export default UserModel;