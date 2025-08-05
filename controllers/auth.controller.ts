import mongoose from 'mongoose'
import bcrypt from 'bcryptjs';
const jwt = require('jsonwebtoken');
import {Request, Response, NextFunction} from 'express'
import User from '../models/user.model';

import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env';

// export const signUp = async (req: Request, res: Response) => {
//   console.log('✅ SignUp route hit');
//   return res.status(200).json({ message: 'Signup route works' });
// };


export const signUp = async (req: Request, res: Response, next: NextFunction) => {
   const session = await mongoose.startSession();
   session.startTransaction();

   try {
     const { name, email, password } = req.body;

     // To check if the user already exists

     const existingUser = await User.findOne({email});

     if(existingUser) {
       const error = new Error('User already exists') as any;
       error.statusCode = 409;
       throw error
     }

     // Hash Password
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(password, salt);

     const newUsers = await User.create([{name, email, password: hashedPassword}], {session});

     if (!JWT_SECRET) {
       throw new Error('JWT_SECRET is not defined');
     }

     const createdUser = newUsers[0];

     if (!createdUser) {
       throw new Error('User creation failed');
     }   

     const token = jwt.sign({ userId: createdUser._id.toString()}, JWT_SECRET, {
       expiresIn: JWT_EXPIRES_IN,
     });

     await session.commitTransaction();
     session.endSession();

     res.status(201).json({
       success: true,
       message: 'User created successfully',
       data: {
         token,
         user: newUsers[0],
       }
     })
   } catch (error) {
     await session.commitTransaction();
     session.endSession();
     next(error);
   }
}

export const signIn = async ( req: Request, res: Response, next: NextFunction) => {
   try {
     const { email, password } = req.body;

     const user = await User.findOne({email})

     if(!user) {
      const error = new Error('User not found') as any;
      error.statusCode = 404;
      throw error
     }

     const isPasswordValid = await bcrypt.compare(password, user.password);

     if(!isPasswordValid) {
       const error = new Error('invalid Password') as any;
       error.statusCode = 401;
       throw error
     }

      const token = jwt.sign({ userId: user._id.toString()}, JWT_SECRET, {
       expiresIn: JWT_EXPIRES_IN,
      });

      res.status(200).json({
        success: true,
        message: 'User signed in successfully',
        data: [
          token,
          user,  
        ]    
      });
   } catch (error) {
     next(error);
   }
}

export const signOut = async ( req: Request, res: Response, next: NextFunction) => {

}