const bcrypt = require('bcrypt');
// Funktion för manuellt hasha ett lösenord, som sedan manuellt lades till i mongoDB för admin-usern
const hashPassword = async () => {
  const plainPassword = '123456'; 
  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    console.log('Hashat lösenord:', hashedPassword);
  } catch (error) {
    console.error('Error hashing password:', error);
  }
};

hashPassword();
