const bcrypt = require('bcrypt');
const debug = require('debug')('photoapp:user_controller');
let models = require('../models');
const { matchedData, validationResult } = require('express-validator')

// Hämta alla users

// const getUsers = async (req, res) => {
//     try {
//         const get_users = await models.Users.fetchAll();
//         /* Hämta med relationer så hade det varit */
//         /*
//         .fetch({withRelatied: ['Photos']})
//         */
//         res.send({
//             status: 'success',
//             data: {
//                 users: get_users
//             }
//         })
//     } catch (error) {
//         res.status(500).send({
//             status: 'error',
//             message: 'Exception thrown in database when creating a new example.',
//         });
//         throw error;
//     }
// }

// Skapa en user

const createUser = async (req, res) => {

    // kollar ifall det fanns några fel
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).send({
            status: 'fail',
            data: errors.array()
        })
    }

    // den validerade datan från request
    const validData = matchedData(req);

    // hash och lite salt på lösenordet
    try {
        // Lösenordet saltas tio gånger
        // Skriver över lösenordet från req och validData med det 
        // hashade lösenordet
        validData.password = await bcrypt.hash(validData.password, 10)
    } catch (error) {
        res.status(418).send({
            status: 'error',
            message: 'Could not hash the password.',
        });
        throw error;
    }

    try {
        const newUser = await new models.Users(validData).save();
        res.status(200).send({
            status: 'success',
            data: {
                "email": validData.email,
                "first_name": validData.first_name,
                "last_name": validData.last_name
            }
        });
    } catch (error) {
        res.status(418).send({
            status: 'error',
            message: 'Exception thrown in database when creating a new example.',
        });
        throw error;
    }
}
// Hämta en user baserat på id

// const getSingleUser = async (req, res) => {
//     try {
//         const user = await new models.Users({ id: req.params.userId }).fetch();
//         res.send({
//             status: 'success',
//             data: {
//                 user
//             }
//         })

//     } catch (error) {
//         console.log(`Failed to fetch the user user data: ${error}`)
//     }
// }


module.exports = {
    createUser
}