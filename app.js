const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { body, validationResult, check } = require('express-validator'); //import validator
const { loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContact} = require('./utils/contacts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const app = express();
const port = 3000;

//gunakan ejs
app.set('view engine', 'ejs');
app.use(expressLayouts);

//build in middleware 
//agar bisa menggunakan semua yang ada di folder public
app.use(express.static('public'));
//agar bisa memparsing requestnya, biar input dari form tidak undefined
app.use(express.urlencoded({extended: true}));

// Konfigurasi flash
app.use(cookieParser('secret'));
app.use(
      session({
      cookie: { maxAge: 6000 },
      secret: 'secret',
      resave: true,
      saveUninitialized: true
   })
);
app.use(flash());

app.get('/', (req, res) => {
   res.render('index',{
      layout: 'layouts/main-layout', //biar bisa gunain main-layout.ejs
      nama:'Agung Ramadhani', 
      title:'Halaman Home',
   });
})

app.get('/about', (req, res) => {
   res.render('about',{
      layout: 'layouts/main-layout', //biar bisa gunain main-layout.ejs
      title:'Halaman About'
   });
})

app.get('/contact', (req, res) => {
   const contacts = loadContact();
   res.render('contact', {
      layout: 'layouts/main-layout',
      title:'Halaman Contact',
      contacts: contacts,
      msg: req.flash('msg'),
   });
})

// halaman form tambah data kontak
app.get('/contact/add', (req, res)=>{
   res.render('add-contact', {
      title: 'Form Tambah Data Contact',
      layout: 'layouts/main-layout'
   })
});

// proses tambah data kontak
app.post('/contact', [
   body('nama').custom((value)=>{
      const duplikat = findContact(value);
      if (duplikat) {
         throw new Error('Nama contact sudah digunakan!');
      }
      return true;
   }),
   check('nohp', 'No Hp tidak valid!').isMobilePhone('id-ID'),
   check('email', 'Email tidak valid!').isEmail() //yang ada di body merupakan name dari inputan
], (req, res)=>{
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
   //    return res.status(400).json({ errors: errors.array() });
      res.render('add-contact', {
         title: 'Form Tambah Data Contact',
         layout: 'layouts/main-layout',
         errors: errors.array(),
      });
   }else{
      addContact(req.body);
      //kirimkan flash message
      req.flash('msg', 'Data contact berhasil ditambahkan!');
      res.redirect('/contact');
   }
});

//proses delete contact
app.get('/contact/delete/:nama', (req, res)=>{
   const contact = findContact(req.params.nama);
   if (!contact) {
      res.status(404);
      res.send('<h1>404</h1>');
   }else{
      deleteContact(req.params.nama);
      //kirimkan flash message
      req.flash('msg', 'Data contact berhasil dihapus');
      res.redirect('/contact');
   }
});


//form ubah data contact
app.get('/contact/edit/:nama', (req, res)=>{
   const contact = findContact(req.params.nama);
   res.render('edit-contact', {
      title: 'Form Ubah Data Contact',
      layout: 'layouts/main-layout',
      contact: contact,
   })
});

//proses ubah data contact
app.post('/contact/update', [
   body('nama').custom((value, { req })=>{
      const duplikat = findContact(value);
      if (value !== req.body.oldNama && duplikat) {
         throw new Error('Nama contact sudah digunakan!');
      }
      return true;
   }),
   check('nohp', 'No Hp tidak valid!').isMobilePhone('id-ID'),
   check('email', 'Email tidak valid!').isEmail() //yang ada di body merupakan name dari inputan
], (req, res)=>{
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
   //    return res.status(400).json({ errors: errors.array() });
      res.render('edit-contact', {
         title: 'Form Ubah Data Contact',
         layout: 'layouts/main-layout',
         errors: errors.array(),
         contact: req.body,
      });
   }else{
      updateContact(req.body);
      //kirimkan flash message
      req.flash('msg', 'Data contact berhasil diubah!');
      res.redirect('/contact');
   }
});

// halaman detail kontak
app.get('/contact/:nama', (req, res) => {
   const contact = cekDuplikat(req.params.nama);
   res.render('detail', {
      layout: 'layouts/main-layout',
      title:'Halaman Detail Contact',
      contact: contact,
   });
})

app.use('/',(req, res) => {
   res.status(404);
   res.send('<h1>404</h1>');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})