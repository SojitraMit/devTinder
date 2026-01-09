const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://sojitramit57757_db_user:mit%402026@namastenode.72heb66.mongodb.net/devTinder?retryWrites=true&w=majority"
  );
};

module.exports = connectDB;
