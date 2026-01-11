import mongoose from "mongoose";
import { encryptKey, decryptKey } from "../utils/encryption.js";

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


ProviderKeySchema.pre("save", function (next) {
  if (typeof this.encryptedKey === "string") {
    this.encryptedKey = encryptKey(this.encryptedKey);
  }
  next();
});

ProviderKeySchema.methods.getDecryptedKey = function () {
  return decryptKey(this.encryptedKey);
};

export default mongoose.model("ProviderKey", ProviderKeySchema);
