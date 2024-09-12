import { signinSchema, normalSignupSchema, googleSignupSchema } from '../utils/validation.js';
import { uploadImageToCloudinary } from '../utils/uploadFile.js';
import User from '../models/user.js';
import dotenv from 'dotenv';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import Otp from '../models/otp.js';
import sendMail from '../utils/sendEmail.js';
import { clearUploadFolder } from '../utils/uploadFile.js';
dotenv.config();

export const verifyOtp = async (email, otp) => {
  const existingOtp = await Otp.findOne({ email, otp });

  if (!existingOtp) {
    return false;
  }

  await Otp.deleteOne({ _id: existingOtp._id });

  return true;
};

export const generateAndSendOtp = async (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);

  console.log('🚀 ~ generateAndSendOtp ~ otp:', otp);

  const newOtp = new Otp({
    email,
    otp,
  });

  await newOtp.save();

  await sendMail({
    to: email,
    subject: 'Your OTP for Signup',
    text: `Your OTP is ${otp}. It will expire in 30 seconds.`,
  });

  res.status(200).json({ message: 'OTP sent to email.' });
};

export const login = async (req, res) => {
  const { googleAccessToken, email, password } = req.body;
  try {
    signinSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json({
      message: 'Validation Error',
      errors: error.errors.map((e) => e.message),
    });
  }
  if (googleAccessToken) {
    try {
      const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
      });

      const {
        given_name: firstName,
        family_name: lastName,
        email,
        picture: avatar,
      } = response.data;

      let existingUser = await User.findOne({ email });

      if (!existingUser) {
        return res.status(404).json({ message: 'User does not exist!' });
      }

      const token = jwt.sign(
        { email: existingUser.email, id: existingUser._id },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h',
        }
      );

      res.status(200).json({ user: existingUser, token });
    } catch (err) {
      return res.status(400).json({ message: 'Invalid Google access token!' });
    }
  } else {
    if (!email || !password) {
      return res.status(400).json({ message: 'Invalid field!' });
    }

    try {
      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        return res.status(404).json({ message: 'User does not exist!' });
      }

      const isPasswordOk = await existingUser.comparePassword(password);

      if (!isPasswordOk) {
        return res.status(400).json({ message: 'Invalid credentials!' });
      }

      const token = jwt.sign(
        { email: existingUser.email, id: existingUser._id },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h',
        }
      );

      const userResponse = existingUser.toObject();
      delete userResponse.password;

      res.status(200).json({ user: existingUser, token });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Something went wrong!' });
    }
  }
};

export const signup = async (req, res) => {
  const { googleAccessToken, email, password, firstName, lastName, otp } = req.body;

  try {
    if (googleAccessToken) {
      googleSignupSchema.parse(req.body);
    } else {
      normalSignupSchema.parse(req.body);
    }
  } catch (error) {
    return res.status(400).json({
      message: 'Validation Error',
      errors: error.errors.map((e) => e.message),
    });
  }

  if (googleAccessToken) {
    try {
      const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
      });

      const {
        email,
        given_name: firstName,
        family_name: lastName,
        picture: avatar,
        sub: googleId,
      } = response.data;

      let existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(409).json({ message: 'User already exists!' });
      }

      const newUser = new User({
        firstName,
        lastName,
        email,
        avatar,
        googleId,
      });

      await newUser.save();

      const token = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      const userResponse = newUser.toObject();
      delete userResponse.password;

      res.status(201).json({ user: userResponse, token });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: 'Google OAuth failed!' });
    }
  } else {
    if (!email || !password || !otp) {
      return res.status(400).json({ message: 'Email, password, and OTP are required!' });
    }

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists!' });
    }

    const isOtpValid = await verifyOtp(email, otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: 'Invalid or expired OTP!' });
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
    });

    await newUser.save();

    const token = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    const user = newUser.toObject();
    delete user.password;
    res.status(201).json({ user, token });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const displayPicture = req.file;
    const userId = req.user.id;

    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );

    clearUploadFolder();

    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      { avatar: image.secure_url },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Image updated successfully',
      data: updatedProfile,
    });
  } catch (error) {
    console.error('Error updating display picture:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
