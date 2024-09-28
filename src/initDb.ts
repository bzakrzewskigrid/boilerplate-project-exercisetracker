import path from 'path';
import fs from 'fs';
import { Database } from 'sqlite3';
import { AsyncDatabase } from 'promised-sqlite3';

const DB_PATH = path.join(__dirname, '../db.db');
const DB_SQL_PATH = path.join(__dirname, '../initDb.sql');

const promisifySQLite3 = (db: Database) => {
  return new AsyncDatabase(db);
};

const runInitSqlQuery = (db: Database) => {
  const initSQL = fs.readFileSync(DB_SQL_PATH, 'utf-8');
  db.exec(initSQL, (err) => {
    if (err) {
      console.log('Failed to initialize database!');
    } else {
      console.log('Database initialized');
    }
  });
};

export const initDb = () => {
  const db = new Database(DB_PATH);
  runInitSqlQuery(db);
};

const getDB = () => {
  const db = new Database(DB_PATH);
  return promisifySQLite3(db);
};

export const db = getDB();
