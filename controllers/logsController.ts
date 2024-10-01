import { Request, Response } from 'express';
import { Exercise, User } from '../models/models';
import { getResponseWhenServerFailed } from '../util';
import { db } from '../src/initDb';
import { validateIfCorrectDateFormat, validateIfPositiveNumber } from '../validators';

export const getLogs = async (req: Request, res: Response) => {
  const userId = req.params._id;

  try {
    const user: User = await db.get('SELECT * FROM Users WHERE id = ?', userId);

    if (!user) {
      return res.status(400).json({
        message: `User with id = ${userId} does not exist!`,
      });
    }

    const { from, to, limit } = req.query;

    if (limit && validateIfPositiveNumber(limit, 'limit', res)) {
      return;
    }

    if (from && validateIfCorrectDateFormat(from, "'From' date", res)) {
      return;
    }

    if (to && validateIfCorrectDateFormat(to, "'To' date", res)) {
      return;
    }

    const selectLogsSqlStr = `
    SELECT 
    Exercises.id, Exercises.description, Exercises.duration, Exercises.date FROM Exercises JOIN Users 
    ON (Users.id = Exercises.userId) 
    WHERE Users.id = ?
    ${
      from && to
        ? 'AND Exercises.date BETWEEN ? AND ?'
        : from
        ? 'AND Exercises.date >= ?'
        : to
        ? 'AND Exercises.date <= ?'
        : ''
    }
    ORDER BY Exercises.date ASC
    ${limit ? 'LIMIT ?' : ''}
    `;

    let userExerciseLogs: Exercise[];

    if (from && to) {
      userExerciseLogs = await db.all(selectLogsSqlStr, userId, from, to, limit);
    } else if (from) {
      userExerciseLogs = await db.all(selectLogsSqlStr, userId, from, limit);
    } else if (to) {
      userExerciseLogs = await db.all(selectLogsSqlStr, userId, to, limit);
    } else {
      userExerciseLogs = await db.all(selectLogsSqlStr, userId, limit);
    }

    const username = user.username;

    const selectCountSqlStr = `
      SELECT COUNT(id) as count FROM Exercises 
      WHERE Exercises.userId = ?
       ${
         from && to
           ? 'AND Exercises.date BETWEEN ? AND ?'
           : from
           ? 'AND Exercises.date >= ?'
           : to
           ? 'AND Exercises.date <= ?'
           : ''
       }
    `;

    let selectCount: { count: number };

    if (from && to) {
      selectCount = await db.get(selectCountSqlStr, userId, from, to);
    } else if (from) {
      selectCount = await db.get(selectCountSqlStr, userId, from);
    } else if (to) {
      selectCount = await db.get(selectCountSqlStr, userId, to);
    } else {
      selectCount = await db.get(selectCountSqlStr, userId);
    }

    return res.status(201).json({
      message: "User's exercises fetched successfully",
      username: username,
      logs: userExerciseLogs,
      count: selectCount.count,
    });
  } catch (err) {
    return getResponseWhenServerFailed(res);
  }
};
