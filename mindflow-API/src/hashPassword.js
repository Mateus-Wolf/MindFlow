const bcrypt = require('bcryptjs');

const password = 'senha123'; // Altere para a senha que você deseja hashear
const hash = bcrypt.hashSync(password, 8);

console.log(hash); // Isso imprimirá o hash da senha no console
