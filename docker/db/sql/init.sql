USE psyexam;

CREATE TABLE patients
(
  id INT PRIMARY KEY,
  sex INT,
  birthdate DATE,
  initial CHAR(8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE exams
(
  id INT PRIMARY KEY,
  examname VARCHAR(255),
  cutoff INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE stacked_exams
(
  id INT PRIMARY KEY,
  patient_id INT,
  exam_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

CREATE TABLE results
(
  id INT PRIMARY KEY,
  patient_id INT,
  exam_id INT,
  item0 INT,
  item1 INT,
  item2 INT,
  item3 INT,
  item4 INT,
  item5 INT,
  item6 INT,
  item7 INT,
  item8 INT,
  item9 INT,
  free0 VARCHAR(2000),
  free1 VARCHAR(2000),
  free2 VARCHAR(2000),
  free3 VARCHAR(2000),
  free4 VARCHAR(2000),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

INSERT INTO patients (id, sex, birthdate, initial) VALUES (1234567, 1, '1989-11-07', 'DS');