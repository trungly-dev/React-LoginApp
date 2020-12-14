const bcrypt = require('bcrypt');

let pswd = bcrypt.hashSync('12345', 9);
console.log(pswd);
