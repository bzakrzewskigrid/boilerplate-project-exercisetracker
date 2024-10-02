import { Request, Response } from 'express';
import { CreatedExerciseResponse } from '../models/models';
import { formatDateToYYYYMMDDString, getResponseWhenServerFailed } from '../util';
import { db } from '../src/initDb';
import { validateIfCorrectDateFormat, validateIfEmpty, validateIfPositiveNumber } from '../validators';

export const createExercise = async (req: Request, res: Response) => {
  const userId = req.params._id;

  try {
    const user = await db.get('SELECT * FROM Users WHERE id = ?', userId);

    if (!user) {
      return res.status(400).json({
        message: `User with ${userId} does not exist!`,
      });
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
