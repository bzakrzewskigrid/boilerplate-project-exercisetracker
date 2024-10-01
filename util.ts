import { Response } from 'express';

export const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const getResponseWhenServerFailed = (res: Response) => {
  return res.status(500).json({
    message: 'Something went wrong. Please try again later',
  });
};

export const isNumber = (value: any) => {
  return typeof value === 'number';
};

// https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number
export function isNumeric(str: string) {
  return !isNaN(+str) && !isNaN(parseFloat(str));
}

// https://stackoverflow.com/questions/18758772/how-do-i-validate-a-date-in-this-format-yyyy-mm-dd-using-jquery
export function isValidDateYYYYMMDD(dateString: string) {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) {
    return false;
  }

  const d = new Date(dateString);
  const dNum = d.getTime();
  if (!dNum && dNum !== 0) {
    return false;
  }
  return d.toISOString().slice(0, 10) === dateString;
}
