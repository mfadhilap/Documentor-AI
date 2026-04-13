import mongoose from "mongoose";
import User from "./User.js";

function generateClassCode(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const classSchema = new mongoose.Schema(
  {
    classname: { type: String, required: true },
    classcode: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

classSchema.statics.createClass = async function (creatorId, classname) {
  let classcode;
  let exists = true;
  while (exists) {
    classcode = generateClassCode();
    exists = await this.exists({ classcode });
  }
  const newClass = new this({ classname, classcode, creator: creatorId, members: [creatorId] });
  await newClass.save();
  await User.findByIdAndUpdate(creatorId, {
    $addToSet: { joinedClasses: newClass._id, createdClasses: newClass._id },
  });
  return newClass;
};

classSchema.statics.joinClass = async function (memberID, classcode) {
  const existsClass = await this.findOne({ classcode });
  if (!existsClass) return { error: "Class not found" };

  const result = await existsClass.addMember(memberID);
  if (!result.includes("already")) {
    await User.findByIdAndUpdate(memberID, {
      $addToSet: { joinedClasses: existsClass._id },
    });
  }
  return { success: true, message: result };
};

classSchema.methods.addMember = async function (member) {
  if (!this.members.some((m) => m.equals(member))) {
    this.members.push(member);
    await this.save();
    return `${member} added successfully`;
  }
  return `${member} is already in the class`;
};

const ClassModel = mongoose.models.Class || mongoose.model("Class", classSchema);
export default ClassModel;
