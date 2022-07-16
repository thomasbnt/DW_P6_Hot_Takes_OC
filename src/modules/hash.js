const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
class hash {
    // hash password
    async gen(password) {
        return await bcrypt.hash(password, salt);
    }
}

module.exports = new hash();
