import mongoose, { Schema, Document } from "mongoose";

export interface IBannerCache {
  year: number;
  term: number;
  level: number;
  data: string;
  lastUpdated: Date;
}

export interface IBannerCacheDocument extends Document, IBannerCache {}

export const BannerCacheSchema = new Schema<IBannerCacheDocument>({
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

export default mongoose.model<IBannerCacheDocument>(
  "BannerCache",
  BannerCacheSchema
);
