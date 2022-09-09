import express from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser, getAuth, Register, Login, Logout } from '../controllers/UserController.js';
import { verifyToken } from '../middleware/VerifyToken.js';
import { refreshToken } from '../controllers/RefreshToken.js';

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/auth', verifyToken, getAuth);
router.post('/auth', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);

export default router;
