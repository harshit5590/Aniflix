import mongoose, { Schema, Document } from 'mongoose';

// 1. Define the TypeScript Interface for the User
export interface IUser extends Document {
  fullName: string;
  email: string;
  password?: string; // Optional for Social Login users
  age?: number;
  dob?: string;
  profilePic: string; // Base64 string or URL
  role: 'user' | 'admin';
  favorites: mongoose.Types.ObjectId[]; // Array of Anime IDs for "My List"
  watchHistory: {
    animeId: mongoose.Types.ObjectId;
    watchedAt: Date;
    progress: number; // For "Resume Watching" feature
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// 2. Define the MongoDB Schema
const UserSchema: Schema = new Schema(
  {
    fullName: { 
      type: String, 
      required: [true, "Full name is required"],
      trim: true 
    },
    email: { 
      type: String, 
      required: [true, "Email is required"], 
      unique: true, 
      lowercase: true,
      trim: true 
    },
    password: { 
      type: String, 
      required: function(this: IUser) {
        // Only require password if it's not a social login
        return !this.profilePic.startsWith('http'); 
      }
    },
    age: { 
      type: Number 
    },
    dob: { 
      type: String 
    },
    profilePic: { 
      type: String, 
      default: "" 
    },
    role: { 
      type: String, 
      enum: ['user', 'admin'], 
      default: 'user' 
    },
    // Reference to the Anime model for the "My List" page
    favorites: [
      { 
        type: Schema.Types.ObjectId, 
        ref: 'Anime' 
      }
    ],
    // Store watch history
    watchHistory: [
      {
        animeId: { type: Schema.Types.ObjectId, ref: 'Anime' },
        watchedAt: { type: Date, default: Date.now },
        progress: { type: Number, default: 0 }
      }
    ]
  },
  { 
    timestamps: true // Automatically creates createdAt and updatedAt
  }
);

// 3. Create and Export the Model
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;