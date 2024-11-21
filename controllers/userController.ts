import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../types';
import { getResponseWhenServerFailed } from '../util';
import { db } from '../src/initDb';
import { validateIfEmpty } from '../validators';
import { User } from '../models/User';
import { RunResult } from 'sqlite3';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.body;

  if (validateIfEmpty(username, 'username', res)) {
    return;
  }

  const transformedUserName = username.trim();

  try {
    const result: RunResult = await db.run('INSERT INTO Users (username) VALUES (?)', transformedUserName);

    return res.status(201).json({
      message: 'User created',
      user: {
        id: result.lastID,
        username: transformedUserName,
      } as User,
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
