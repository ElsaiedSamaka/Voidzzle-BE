// Packages
import { promisify } from 'util';
import jwt from 'jsonwebtoken';

// Configs
import config from '../config/config';

// Utils
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';

// Models
import { User } from '../models/index';

const protect = catchAsync(async (req, res, next) => {
  // 1) Getting the token
  const cookieHeader = req.headers.cookie;

  // 2) Parse the cookie header
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split('=');
    acc[name] = value;
    return acc;
  }, {});

  // 3) Check if the access token exists
  const accessToken = cookies.access;

  // 4) Check if token does not exist
  if (!accessToken) {
    return next(
      new AppError('You are not logged in! Please login to get access.', 401)
    );
  }

  // 5) Token verification
  const decoded = await promisify(jwt.verify)(accessToken, config.jwt.secret);

  // 6) Extract user data from database
  const currentUser = await User.findById(decoded.sub);

  // 7) Check if user does not exist
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 8) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please login again!', 401)
    );
  }

  // 9) Assign currentUser to req.user
  req.user = currentUser;

  next();
});

export default protect;
