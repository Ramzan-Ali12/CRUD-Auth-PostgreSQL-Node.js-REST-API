const controller=require('../controllers/crud-controller');
const {signup,login,changeUserpassword,sendUserPasswordResetEmail,resetPassword}  =require('../controllers/auth-controller');
const userAuth=require('../middleware/user-auth');
const {Router} =require("express");
const router =Router();

// *
// Start CRUD REST API Routes
// */
// create user route
// router.post('/create-user',controller.createUser); 
// API route for create user
router.post('/users/create-user',controller.createUser);

// Get all user route
// router.get('/find-user',controller.findUser);
// API route
router.get('/users/find-user',controller.findUser);
// Get user by id
// router.get('find-user/:userId',controller.findUserByID);
// API route
router.get('/users/find-user/:userId',controller.findUserByID);
// update user by id
// router.put('/update-user/:userId',controller.updateUser);
router.put('/users/update-user/:userId',controller.updateUser);
// Delate User by id
// router.delete('/delete-user/:userId',controller.deleteUser);
router.delete('/api/users/delete-user/:userId',controller.deleteUser);

// *
// End CRUD REST API Routes
// */

// *
// Start the Auth API Routes
// */

// user check user Auth middleware
// router.post('/signup',userAuth.saveuser,signup);
// API Route for Signup
router.post('/auth/signup',userAuth.saveuser,signup);
// API Route for Login
router.post('/auth/login',userAuth.validateLoginInput,login);
// API Route for ChangeUserPassword
router.post('/auth/changepassword/',userAuth.checkUserAuth,changeUserpassword)
// API Route for forgePassword
router.post('/auth/send-reset-password-email/',sendUserPasswordResetEmail)
// API Route for resetPassword
router.post('/auth/resetPassword/',resetPassword)


module.exports=router;