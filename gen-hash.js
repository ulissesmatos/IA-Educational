const bcrypt = require('bcrypt');

bcrypt.hash('admin123456', 12).then(hash => {
  console.log(hash);
});
