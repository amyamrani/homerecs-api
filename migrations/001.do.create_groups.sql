CREATE TABLE groups (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    access_code TEXT NOT NULL
);