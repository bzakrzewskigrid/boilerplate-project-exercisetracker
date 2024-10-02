import { Request, Response } from 'express';
import { CreatedExerciseResponse, User } from '../models/User';
import { formatDateToYYYYMMDDString, getResponseWhenServerFailed, getResponseWhenUserDoesNotExist } from '../util';
import { db } from '../src/initDb';
import { validateIfCorrectDateFormat, validateIfEmpty, validateIfPositiveNumber } from '../validators';

export const createExercise = async (req: Request, res: Response) => {
  const userId = req.params._id;

  try {
    const user: User | undefined = await db.get('SELECT * FROM Users WHERE id = ?', userId);

    if (!user) {
      return getResponseWhenUserDoesNotExist(userId, res);
    }

    const { description, duration, date } = req.body;

    if (isAnyCreateExerciseBodyParamsInValid(req, res)) {
      return;
    }

    const transformedDescription = description.toString().trim();
    const transformedDate = date || formatDateToYYYYMMDDString(new Date());
    const transformedDuration = +duration;

    const result = await db.run(
      'INSERT INTO Exercises (description, duration, date, userId) VALUES (?, ?, ?, ?)',
      transformedDescription,
      transformedDuration,
      transformedDate,
      userId
    );

    return res.status(201).json({
      message: 'Exercise created',

      exercise: {
        userId: +userId,
        exerciseId: result.lastID,
        duration: transformedDuration,
        description: transformedDescription,
        date: transformedDate,
      } as CreatedExerciseResponse,
    });
  } catch (err) {
    return getResponseWhenServerFailed(res);
  }
};

// todo: replace ifs with switch
const isAnyCreateExerciseBodyParamsInValid = (req: Request, res: Response) => {
  const { description, duration, date } = req.body;

  if (validateIfEmpty(description, 'description', res)) {
    return true;
  }

  if (validateIfEmpty(duration, 'duration', res) || validateIfPositiveNumber(duration, 'duration', res)) {
    return true;
  }

  if (date && validateIfCorrectDateFormat(date, 'date', res)) {
    return true;
  }

  return false;
};
