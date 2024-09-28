import { Request, Response } from 'express';
import { CreatedExerciseResponse } from '../models/models';
import { formatDate, getResponseWhenServerFailed, isNumber, isValidDate } from '../util';
import { db } from '../src/initDb';

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

    if (!description || !description.trim()) {
      return res.status(400).json({
        message: 'No description provided!',
      });
    }

    if (!duration) {
      return res.status(400).json({
        message: 'No duration provided!',
      });
    }

    if (!isNumber(duration)) {
      return res.status(400).json({
        message: 'Duration is in the wrong format!',
      });
    } else if (duration <= 0) {
      return res.status(400).json({
        message: 'Duration cannot be less then 0!',
      });
    }

    if (!isValidDate(date)) {
      return res.status(400).json({
        message: 'Date is in the wrong format!',
      });
    }

    let transformedDescription = description.trim();
    let transformedDate = date || formatDate(new Date());

    const result = await db.run(
      'INSERT INTO Exercises (description, duration, date, userId) VALUES (?, ?, ?, ?)',
      transformedDescription,
      duration,
      transformedDate,
      userId
    );

    const createdExercise: CreatedExerciseResponse = {
      userId: +userId,
      exerciseId: result.lastID,
      duration: duration,
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
