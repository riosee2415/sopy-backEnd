import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Video = new Schema(
  {
    thumbnailPath: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model(`Video`, Video, `Video`);
