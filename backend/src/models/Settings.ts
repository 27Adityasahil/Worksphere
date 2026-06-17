import mongoose, { Document, Schema } from 'mongoose';
export interface ISettings extends Document {
  geofenceCenter: {
    lat: number;
    lng: number;
  };
  geofenceRadius: number; 
}
const settingsSchema = new Schema<ISettings>(
  {
    geofenceCenter: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    geofenceRadius: {
      type: Number,
      default: 100, 
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model<ISettings>('Settings', settingsSchema);
