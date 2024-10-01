import { Request, Response } from 'express';
import { CustomError } from '../types';
import { User } from '../models/models';
import { getResponseWhenServerFailed } from '../util';
import { db } from '../src/initDb';
import { validateIfEmpty } from '../validators';

export const createUser = async (req: Request, res: Response) => {
  const { username } = req.body;

  if (validateIfEmpty(username, 'username', res)) {
    return;
  }

  let transformedUserName = username.trim();

  try {
    const result = await db.run('INSERT INTO Users (username) VALUES (?)', transformedUserName);

    const createdUserId = result.lastID;

    const user: User = {
      id: createdUserId,
      username: transformedUserName,
    };

    return res.status(201).json({
      message: 'User created',
      user: user,
    });
  } catch (err) {
    const error = err as CustomError;

    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({
        message: `User with username: ${username} already exits!`,
      });
    }

    return getResponseWhenServerFailed(res);
  }
};

export const getUsers = async (_: Request, res: Response) => {
  try {
    const users = await db.all('SELECT * FROM Users');

    return res.status(200).json({
      message: 'Users fetched successfully.',
      users: users,
    });
  } catch (err) {
    return getResponseWhenServerFailed(res);
  }
};
