import { Request, Response } from 'express';
import { Exercise, User } from '../models/models';
import { getResponseWhenServerFailed, isNumber, isNumeric, isValidDate } from '../util';
import { db } from '../src/initDb';

export const getLogs = async (req: Request, res: Response) => {
  const userId = req.params._id;

  try {
    const user: User = await db.get('SELECT * FROM Users WHERE id = ?', userId);

    if (!user) {
      return res.status(400).json({
        message: `User with id = ${userId} does not exist!`,
      });
    }

    let userExerciseLogs: Exercise[] = await db.all(
      `
      SELECT 
      Exercises.id, Exercises.description, Exercises.duration, Exercises.date FROM Exercises JOIN Users 
      ON (Users.id = Exercises.userId) 
      WHERE Users.id = ?
    `,
      userId
    );

    const { from, to, limit } = req.query;

    console.log(limit);

    if (limit && !isNumeric(limit as string)) {
      console.log(limit);
      return res.status(400).json({
        message: 'Limit is in the wrong format!',
      });
    } else if (limit && +limit <= 0) {
      return res.status(400).json({
        message: 'Limit cannot be less then 0!',
      });
    }

    if (from && !isValidDate(from as string)) {
      return res.status(400).json({
        message: "'From' date is in the wrong format!",
      });
    }

    if (to && !isValidDate(to as string)) {
      return res.status(400).json({
        message: "'To' date is in the wrong format!",
      });
    }

    if (limit) {
      userExerciseLogs = userExerciseLogs.slice(0, +limit);
    }

    if (from) {
      userExerciseLogs = userExerciseLogs.filter((exercise) => new Date(exercise.date) >= new Date(from as string));
    }

    if (to) {
      userExerciseLogs = userExerciseLogs.filter((exercise) => new Date(exercise.date) <= new Date(to as string));
    }

    const username = user.username;
    const count = userExerciseLogs.length;

    return res.status(201).json({
      message: "User's exercises fetched successfully",
      username: username,
      logs: userExerciseLogs,
      count: count,
    });
  } catch (err) {
    return getResponseWhenServerFailed(res);
  }
};
