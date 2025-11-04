import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginDto, RegisterDto, AuthResponse } from '@shared/types/auth.type';
import { ApiResponse } from '@shared/types/api-response.type';
import { User } from '../models/user.model';

const router = Router();

// Đăng ký
router.post(
  '/register',
  async (req: Request<{}, {}, RegisterDto>, res: Response<ApiResponse<AuthResponse>>) => {
    try {
      const { username, password } = req.body;

      const existing = await User.findOne({ where: { user_name: username } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Username already registered',
          data: null as any,
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        user_name: username,
        password: hashedPassword,
        role: '',
      });

      const token = jwt.sign({ id: newUser.user_id, username }, process.env['JWT_SECRET']!, {
        expiresIn: '7d',
      });

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          token,
          user: {
            id: newUser.user_id,
            username,
          },
        },
      });
    } catch (error) {
      console.error('Register error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error registering user',
        data: null as any,
      });
    }
  }
);

// Đăng nhập
router.post(
  '/login',
  async (req: Request<{}, {}, LoginDto>, res: Response<ApiResponse<AuthResponse>>) => {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ where: { user_name: username } });
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: 'User not found', data: null as any });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res
          .status(400)
          .json({ success: false, message: 'Invalid credentials', data: null as any });

      const token = jwt.sign({ id: user.user_id, username }, process.env['JWT_SECRET']!, {
        expiresIn: '7d',
      });

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user.user_id,
            username: user.user_name,
          },
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error logging in',
        data: null as any,
      });
    }
  }
);

export default router;
