const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const { body, validationResult, check } = require("express-validator");
const methodOverride = require("method-override");

const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

require("./utils/db");
const Contact = require("./model/contact");

const app = express();
const port = 3000;

// setup method overide
app.use(methodOverride("_method"));

// gunakan ejs
app.set("view engine", "ejs");

// third party middleware
app.use(expressLayouts);

// built-in midleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// konfigurasi flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

//halaman home
app.get("/", (req, res) => {
  const mahasiswa = [
    {
      nama: "arifin",
      email: "arif@gmail.com",
    },
    {
      nama: "nur",
      email: "nur@gmail.com",
    },
    {
      nama: "bok",
      email: "bok@gmail.com",
    },
  ];
  res.render("index", {
    layout: "layouts/main-layout",
    nama: "Nur Arifin",
    title: "Halaman Index",
    mahasiswa,
  });
});

// halaman about
app.get("/about", (req, res) => {
  res.render("about", {
    layout: "layouts/main-layout",
    title: "Halaman About",
  });
});

// halaman contact
app.get("/contact", async (req, res) => {
  //   Contact.find().then((contact) => {
  //     res.send(contact);
  //   });

  const contacts = await Contact.find();

  res.render("contact", {
    layout: "layouts/main-layout",
    title: "Halaman Contact",
    contacts,
    msg: req.flash("msg"),
  });
});

// tambah kontak
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "form tambah",
    layout: "layouts/main-layout",
  });
});

//proses tambah data
app.post(
  "/contact",
  [
    body("nama").custom(async (value) => {
      const duplikat = await Contact.findOne({ nama: value });

      if (duplikat) {
        throw new Error("nama kontak sudah digunakan");
      }
      return true;
    }),
    check("email", "Email tidak valid").isEmail(),
    check("nohp", "No HP tidak valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render("add-contact", {
        title: "form tambah",
        layout: "layouts/main-layout",
        errors: errors.array(),
      });
    } else {
      Contact.insertMany(req.body, (error, result) => {
        // kirim flash
        req.flash("msg", "Data berhasil ditambahkan");
        res.redirect("/contact");
      });
    }
  }
);

// hapus kontak
// app.get("/contact/delete/:nama", async (req, res) => {
//   const contact = await Contact.findOne({ nama: req.params.nama });

//   // jika kontak tidak ada
//   if (!contact) {
//     res.status(404);
//     res.send("<h1>404</h1>");
//   } else {
//     // res.send("ok");
//     Contact.deleteOne({ _id: contact._id }).then((result) => {
//       req.flash("msg", "Data berhasil dihapus");
//       res.redirect("/contact");
//     });
//   }
// });

app.delete("/contact", (req, res) => {
  //   res.send(req.body);
  Contact.deleteOne({ nama: req.body.nama }).then((result) => {
    req.flash("msg", "Data berhasil dihapus");
    res.redirect("/contact");
  });
});

// ubah kontak
app.get("/contact/edit/:nama", async (req, res) => {
  const contact = await Contact.findOne({ nama: req.params.nama });

  res.render("edit-contact", {
    title: "form edit",
    layout: "layouts/main-layout",
    contact,
  });
});

// proses ubah
app.put(
  "/contact",
  [
    body("nama").custom(async (value, { req }) => {
      const duplikat = await Contact.findOne({ nama: value });

      if (value !== req.body.oldNama && duplikat) {
        throw new Error("nama kontak sudah digunakan");
      }
      return true;
    }),
    check("email", "Email tidak valid").isEmail(),
    check("nohp", "No HP tidak valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("edit-contact", {
        title: "form ubah",
        layout: "layouts/main-layout",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      Contact.updateOne(
        { _id: req.body._id },
        {
          $set: {
            nama: req.body.nama,
            email: req.body.email,
            nohp: req.body.nohp,
          },
        }
      ).then((result) => {
        // // kirim flash
        req.flash("msg", "Data berhasil diubah");
        res.redirect("/contact");
      });
    }
  }
);

// detail
app.get("/contact/:nama", async (req, res) => {
  const contact = await Contact.findOne({ nama: req.params.nama });

  res.render("detail", {
    title: "Halaman Detail",
    layout: "layouts/main-layout",
    contact,
  });
});

app.listen(port, () => {
  console.log(`Mongo contact app : listening at http://localhost:${port}`);
});
