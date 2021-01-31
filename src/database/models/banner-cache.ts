import mongoose, { Schema, Document } from "mongoose";

export interface IBannerCache extends Document {
  year: number;
  term: number;
  level: number;
  data: string;
  lastUpdated: Date;
}

const BannerCacheSchema = new Schema({
  year: { type: Number, required: true },
  term: { type: Number, required: true },
  level: { type: Number, required: true },
  data: { type: String, required: true },
  lastUpdated: {
    type: Date,
    default: new Date(),
    required: true,
  },
});

export default mongoose.model<IBannerCache>("BannerCache", BannerCacheSchema);
