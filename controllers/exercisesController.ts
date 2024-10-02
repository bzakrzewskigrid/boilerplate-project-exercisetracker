import { Request, Response } from 'express';
import { CreatedExerciseResponse, User } from '../models/models';
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

    if (validateIfEmpty(description, 'description', res)) {
      return;
    }

    if (validateIfEmpty(duration, 'duration', res) || validateIfPositiveNumber(duration, 'duration', res)) {
      return;
    }

    if (date && validateIfCorrectDateFormat(date, 'date', res)) {
      return;
    }

    let transformedDescription = description.toString().trim();
    let transformedDate = date ? date.toString() : formatDateToYYYYMMDDString(new Date());
    let transformedDuration = +duration;

    const result = await db.run(
      'INSERT INTO Exercises (description, duration, date, userId) VALUES (?, ?, ?, ?)',
      transformedDescription,
      transformedDuration,
      transformedDate,
      userId
    );

    const createdExercise: CreatedExerciseResponse = {
      userId: +userId,
      exerciseId: result.lastID,
      duration: transformedDuration,
      description: transformedDescription,
      date: transformedDate,
    };

    return res.status(201).json({
      message: 'Exercise created',
      exercise: createdExercise,
    });
  } catch (err) {
    return getResponseWhenServerFailed(res);
  }
};
