PRAGMA foreign_keys = ON;

CREATE TABLE
  IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY ASC,
    username VARCHAR(255) UNIQUE
  );

CREATE TABLE
  IF NOT EXISTS Exercises (
    id INTEGER PRIMARY KEY ASC,
    description VARCHAR(255),
    duration INTEGER, -- duration in seconds
    date DATE,
    userId INTEGER,
    FOREIGN KEY (userId) REFERENCES Users (id)
  );