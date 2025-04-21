import { Inngest } from "inngest";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "electro-next" });

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true},
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
  cartItems: { type: Object, default: {} },
}, { minimize: false });

const User = mongoose.models.user || mongoose.model("user", userSchema);

// Inngest Function to save user data from clerk to database
export const syncUserCreation = inngest.createFunction(
  { id: 'sync-user-from-clerk' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    }
    await connectDB();
    await User.create(userData);
  }
);

// Inngest Function to update user data from clerk to database
export const syncUserUpdation = inngest.createFunction(
  { id: 'update-user-from-clerk' },
  { event: 'clerk/user.updated' },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    }
    await connectDB();
    await User.findByIdAndUpdate(id, userData);
  }
);

// Inngest Function to delete user data from database
export const syncUserDeletion = inngest.createFunction(
  { id: 'delete-user-with-clerk' },
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    const { id } = event.data;
    await connectDB();
    await User.findByIdAndDelete(id);
  }
);
