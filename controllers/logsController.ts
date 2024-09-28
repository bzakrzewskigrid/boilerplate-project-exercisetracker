import { Request, Response } from 'express';
import { Exercise, User } from '../models/models';
import { getResponseWhenServerFailed } from '../util';
import { db } from '../src/initDb';

// todo: Add params validity:
// todo: check: if limit is a number,  if from and to dates are correctly formatted
// todo: and if 'to' date is > then 'from' date
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
