import { Request, Response } from 'express';
import { Exercise, User } from '../models/models';
import { getResponseWhenServerFailed, getResponseWhenUserDoesNotExist } from '../util';
import { db } from '../src/initDb';
import { validateIfCorrectDateFormat, validateIfPositiveNumber } from '../validators';

export const getLogs = async (req: Request, res: Response) => {
  const userId = req.params._id;

  try {
    const user: User = await db.get('SELECT * FROM Users WHERE id = ?', userId);

    if (!user) {
      return getResponseWhenUserDoesNotExist(userId, res);
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

    const paramsArr: string[] = [];

    const query = [from, to];
    query.forEach((param) => param && paramsArr.push(param.toString()));

    const userExerciseLogs: Exercise[] = await db.all(selectLogsSqlStr, userId, ...paramsArr, limit);

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

    let selectCount: { count: number } = await db.get(selectCountSqlStr, userId, ...paramsArr);

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
