const controller=require('../controllers/crud-controller');
const {Router} =require("express");
const router =Router();

// create user route
router.post('/create-user',controller.createUser); 
// API route for create user
router.post('/api/users/create-user',controller.createUser);

// Get all user route
router.get('/find-user',controller.findUser);
// API route
router.get('/api/users/find-user',controller.findUser);
// Get user by id
router.get('find-user/:userId',controller.findUserByID);
// API route
router.get('/api/users/find-user/:userId',controller.findUserByID);
// update user by id
router.put('/update-user/:userId',controller.updateUser);
router.put('/api/users/update-user/:userId',controller.updateUser);
// Delate User by id
router.delete('/delete-user/:userId',controller.deleteUser);
router.delete('/api/users/delete-user/:userId',controller.deleteUser);



module.exports=router;