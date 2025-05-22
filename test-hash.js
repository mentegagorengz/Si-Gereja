// Buat file test-hash.js di root project
const CryptoJS = require('crypto-js');

const password = "123christy";
const hashedPassword = CryptoJS.SHA256(password).toString();

console.log("Original password:", password);
console.log("Hashed password:", hashedPassword);