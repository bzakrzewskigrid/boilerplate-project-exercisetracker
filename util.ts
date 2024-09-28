import { Response } from 'express';

export const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export const getResponseWhenServerFailed = (res: Response) => {
  return res.status(500).json({
    message: 'Something went wrong. Please try again later',
  });
};

export const isNumber = (value: any) => {
  return typeof value === 'number';
};

// https://stackoverflow.com/questions/18758772/how-do-i-validate-a-date-in-this-format-yyyy-mm-dd-using-jquery
export const isValidDate = (dateString: string) => {
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) return false; // Invalid format
  var d = new Date(dateString);
  var dNum = d.getTime();
  if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0, 10) === dateString;
};
