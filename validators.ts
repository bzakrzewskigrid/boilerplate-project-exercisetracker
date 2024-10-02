import { Response } from 'express';
import { capitalizeFirstLetter, isNumeric, isStringContainingOnlyWhiteSpace, isValidDateYYYYMMDD } from './util';

export const validateIfEmpty = (param: any, name: string, res: Response) => {
  if (!param || (typeof param === 'string' && isStringContainingOnlyWhiteSpace(param))) {
    return res.status(400).json({
      message: `No ${name} provided!`,
    });
  }

  return false;
};

export const validateIfPositiveNumber = (param: any, name: string, res: Response) => {
  if (!isNumeric(param)) {
    return res.status(400).json({
      message: `${capitalizeFirstLetter(name)} is in the wrong format!`,
    });
  } else if (+param <= 0) {
    return res.status(400).json({
      message: `${capitalizeFirstLetter(name)} cannot be less or equal to 0!`,
    });
  }

  return false;
};

export const validateIfCorrectDateFormat = (param: any, name: string, res: Response) => {
  if (!isValidDateYYYYMMDD(param.toString())) {
    return res.status(400).json({
      message: `${capitalizeFirstLetter(name)} is in the wrong format!`,
    });
  }

  return false;
};
