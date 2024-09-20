const express = require('express');
const user = require('../Controllers/user');
const router = express.Router();

//Get
router.get('/',user.defaultRoute);
router.get('/estates',user.getEstates);

//Post
router.post('/add-user', user.addUser)
router.post('/login', user.userLogin)
router.post('/add-estate', user.addEstate)

//Update
router.put('/update-estate/:_id',user.updateEstate)

//Delete
router.delete('/delete-estate/:_id',user.deleteEstate)


module.exports = router;