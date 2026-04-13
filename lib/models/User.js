import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  joinedClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
  createdClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
});

userSchema.statics.registerUser = async function (username, name, Password) {
  const exists = await this.findOne({ username });
  if (!exists) {
    const password = await bcrypt.hash(Password, 10);
    const newUser = new this({ username, name, password });
    await newUser.save();
    return "User registered successfully";
  }
  return "User already registered";
};

userSchema.statics.loginUser = async function (username, Password) {
  const user = await this.findOne({ username });
  if (!user) return { error: "User not found" };

  const match = await bcrypt.compare(Password, user.password);
  if (!match) return { error: "Incorrect password" };

  return user;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
