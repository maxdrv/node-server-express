const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {
        this.users = data
    }
}

const fsPromises = require('fs').promises;
const path = require('path');
const users = require("../model/users.json");

const handleLogout = async (req, res) => {
    // On client also delete the access token

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);  // No Content - no jwt in request and that ok since we were going to delete tokens anyway
    const refreshToken = cookies.jwt;

    const foundUser = users.find(person => person.refreshToken === refreshToken);
    if (!foundUser) {
        res.clearCookie('jwt', {httpOnly: true})
        return res.sendStatus(204);  // No Content - since we did not found user BUT that is ok
    }

    // deleting refresh token from db
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = {...foundUser, refreshToken: ''};
    usersDB.setUsers([...otherUsers, currentUser]);

    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(usersDB.users)
    )

    res.clearCookie('jwt', {httpOnly: true, secure: true, sameSite: 'None'});  // secure = true, that would make it only served on HTTPS, except dev server
    res.sendStatus(204);  // No Content to send back
};

module.exports = {handleLogout};
