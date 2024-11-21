import { Request, Response } from 'express';
import { Exercise, User, UserExerciseLog } from '../models/User';
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

    if (isAnyLogParamInvalid(req, res)) {
      return;
    }

    // todo: extract this to another getSelectLogsSql function
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
    [from, to].forEach((param) => param && paramsArr.push(param.toString()));

    const userExerciseLogs: Exercise[] = await db.all(selectLogsSqlStr, userId, ...paramsArr, limit);

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

    const selectCount: { count: number } = await db.get(selectCountSqlStr, userId, ...paramsArr);

    return res.status(201).json({
      message: "User's exercises fetched successfully",
      id: user.id,
      username: user.username,
      logs: userExerciseLogs,
      count: selectCount.count,
    } as UserExerciseLog & { message: string });
  } catch (err) {
    return getResponseWhenServerFailed(res);
  }
};

// todo: replace ifs with switch
const isAnyLogParamInvalid = (req: Request, res: Response) => {
  const { from, to, limit } = req.query;

  if (limit && validateIfPositiveNumber(limit, 'limit', res)) {
    return true;
  }

  if (from && validateIfCorrectDateFormat(from, "'From' date", res)) {
    return true;
  }

  if (to && validateIfCorrectDateFormat(to, "'To' date", res)) {
    return true;
  }

  return false;
};
