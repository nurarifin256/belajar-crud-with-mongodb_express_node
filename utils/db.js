const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/wpu", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //   useCreateIndex: true,
});

// membuat schema
// const Contact = mongoose.model("Contact", {
//   nama: {
//     type: String,
//     required: true,
//   },
//   nohp: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//   },
// });

// tambah 1 data
// const contact1 = new Contact({
//   nama: "nur",
//   nohp: "0874655656",
//   email: "nurarifin@gmail.com",
// });

// simpan  data
// contact1.save().then((contact) => {
//   console.log(contact);
// });
