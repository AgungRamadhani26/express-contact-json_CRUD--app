//Core Module
const fs = require('fs');

//Membuat folder data jika belum ada
const dirPath = './data';
if (!fs.existsSync(dirPath)) {
   fs.mkdirSync(dirPath);
}

//Membuat file contacts.json jika belum ada
const dataPath = './data/contacts.json';
if (!fs.existsSync(dataPath)) {
   fs.writeFileSync(dataPath, '[]', 'utf-8');
}

//ambil semua data di contacts.json
const loadContact = () => {
   const file = fs.readFileSync('data/contacts.json', 'utf-8');
   const contacts = JSON.parse(file);
   return contacts;
};

//cari contact berdasarkan nama
const findContact = (nama) => {
   const contacts = loadContact();
   const contact = contacts.find(
      (contact) => contact.nama.toLowerCase() === nama.toLowerCase()
   );
   return contact;
};

//menuliskan/menimpa file contact.json dengan data baru
const saveContacts = (contacts)=>{
   fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
}

//menambahkan data kontak baru
const addContact = (contact) => {
   const contacts = loadContact();
   contacts.push(contact);
   saveContacts(contacts);
}

//cek nama yang duplikat
const cekDuplikat = (nama) => {
   const contacts = loadContact();
   return contacts.find((contact) => contact.nama === nama);
};

//hapus contact
const deleteContact = (nama) => {
   const contacts = loadContact();
   const newContacts = contacts.filter((contact) => contact.nama !== nama);
   saveContacts(newContacts);
};

//mengubah data contact
const updateContact = (contactBaru) => {
   const contacts = loadContact();
   //hapus contact lama yang namanya sama dengan oldNama
   const newContacts = contacts.filter((contact) => contact.nama !== contactBaru.oldNama);
   //hapus oldNama dari object contactBaru
   delete contactBaru.oldNama;
   //tambahkan contactBaru ke array contacts
   newContacts.push(contactBaru);
   //simpan ke file contacts.json
   saveContacts(newContacts);
}


module.exports = { loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContact};
