import { Response } from 'express';
import { User } from './models/models';

export const formatDateToYYYYMMDDString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const getResponseWhenServerFailed = (res: Response) => {
  return res.status(500).json({
    message: 'Something went wrong. Please try again later',
  });
};

export const getResponseWhenUserDoesNotExist = (userId: string, res: Response) => {
  return res.status(400).json({
    message: `User with ${userId} does not exist!`,
  });
};

export function isNumeric(value: any): boolean {
  return !isNaN(+value);
}

export const isStringContainingOnlyWhiteSpace = (str: string) => {
  return !str.trim();
};

const isCorrectDate = (dateString: string) => {
  const d = new Date(dateString);

  const dNum = d.getTime();
  if (!dNum && dNum !== 0) {
    return false;
  }
  return d.toISOString().slice(0, 10) === dateString;
};

export function isValidDateYYYYMMDD(dateString: string): boolean {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateString.match(regEx)) {
    return false;
  }

  return isCorrectDate(dateString);
}
