import { Response } from 'express';
import { capitalizeFirstLetter, isNumeric, isValidDateYYYYMMDD } from './util';

export const validateIfEmpty = (param: any, name: string, res: Response) => {
  if (!param || !param.toString().trim()) {
    return res.status(400).json({
      message: `No ${name} provided!`,
    });
  }

  return false;
};

export const validateIfPositiveNumber = (param: any, name: string, res: Response) => {
  const paramStr = param.toString();

  if (!isNumeric(paramStr)) {
    return res.status(400).json({
      message: `${capitalizeFirstLetter(name)} is in the wrong format!`,
    });
  } else if (+paramStr <= 0) {
    return res.status(400).json({
      message: `${capitalizeFirstLetter(name)} cannot be less or equal to 0!`,
    });
  }

  return false;
};

export const validateIfCorrectDateFormat = (param: any, name: string, res: Response) => {
  if (param && !isValidDateYYYYMMDD(param.toString())) {
    return res.status(400).json({
      message: `${capitalizeFirstLetter(name)} is in the wrong format!`,
    });
  }

  return false;
};
