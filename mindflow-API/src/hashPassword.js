const bcrypt = require('bcryptjs');

const password = 'senha123';
const hash = bcrypt.hashSync(password, 8);

console.log(hash);
