import mongoose from "mongoose";
const ProviderKeySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    provider: {
      type: String,
      required: true,
      enum: ["openai", "groq", "gemini"],
    },
    encryptedKey: { type: Buffer, required: true },
  },
  { timestamps: true }
);

ProviderKeySchema.index({ user: 1, provider: 1 }, { unique: true });
export default mongoose.model("ProviderKey", ProviderKeySchema);
