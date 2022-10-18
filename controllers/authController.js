const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {
        this.users = data;
    }
}

const bcrypt = require('bcrypt');

const handleLogin = async (req, res) => {
    const {user, pwd} = req.body;
    if (!user || !pwd) return res.status(400).json({'message': 'Username and password are required'})

    const foundUser = usersDB.users.find(person => person.username === user);
    if (!foundUser) return res.status(401);  // Unauthorized

    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        // here we will create jwt in the future
        res.json({'success': `User ${user} is logged in!`})
    } else {
        res.sendStatus(401);  // Unauthorized
    }
}

module.exports = { handleLogin };