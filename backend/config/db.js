import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://nimharachalana_food_del:Chalana2002@cluster0.wijqlot.mongodb.net/Food-Del').then(()=>console.log("DB Connected"));
}