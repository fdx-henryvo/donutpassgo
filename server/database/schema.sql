DROP DATABASE IF EXISTS test_db;   
CREATE DATABASE IF NOT EXISTS test_db;   
USE test_db; 

DROP TABLE IF EXISTS team; 

CREATE TABLE IF NOT EXISTS team 
  ( 
     id         INT PRIMARY KEY auto_increment, 
     name       VARCHAR(25) UNIQUE NOT NULL
  ); 

DROP TABLE IF EXISTS team_member; 

CREATE TABLE IF NOT EXISTS team_member 
  ( 
     id           VARCHAR(50) PRIMARY KEY UNIQUE NOT NULL, 
     teamId      INT NOT NULL, 
     name         VARCHAR(50) NOT NULL,
     donutCount  INT DEFAULT 0,
     FOREIGN KEY (teamId) REFERENCES team(id)
  ); 

INSERT INTO team (id, name) VALUES (1, 'Portal');
INSERT INTO team (id, name) VALUES (2, 'TaskX');

INSERT IGNORE INTO team_member (id, teamId, name, donutCount) VALUES ('039343a8-9772-4d9c-ad25-8701a1ac1068', 1, 'Henry Vo', 0);
INSERT IGNORE INTO team_member (id, teamId, name, donutCount) VALUES ('7a5ca07f-31f5-4b60-934e-d69edb7304ef', 1, 'Spencer Porteous', 0);
INSERT IGNORE INTO team_member (id, teamId, name, donutCount) VALUES ('4dc5a69d-395f-4b49-8bd9-ae08fbab9458', 1, 'Shani Abergil', 0);
INSERT IGNORE INTO team_member (id, teamId, name, donutCount) VALUES ('3a0a25e5-28f1-4f8f-81b5-7152fa1200af', 1, 'Kunal Patel', 0);
INSERT IGNORE INTO team_member (id, teamId, name, donutCount) VALUES ('90d12078-a0be-4a21-80a8-24bbe5328956', 1, 'James Spielvogel', 0);
INSERT IGNORE INTO team_member (id, teamId, name, donutCount) VALUES ('bd610057-b2a9-42e2-91a7-4a9ff889b7b5', 1, 'Sachit Malhotra', 0);
INSERT IGNORE INTO team_member (id, teamId, name, donutCount) VALUES ('fda44a57-9432-40df-bbff-82d002e9ef0a', 1, 'Peter Fotinis', 0);
INSERT IGNORE INTO team_member (id, teamId, name, donutCount) VALUES ('b21d3b64-31bb-41b0-a576-9f2fce335545', 1, 'Kuan Lee', 0);
INSERT IGNORE INTO team_member (id, teamId, name, donutCount) VALUES ('2701e0df-f4f1-4da2-b181-eb4c936c996f', 1, 'Patricia McCarthy', 0);
INSERT IGNORE INTO team_member (id, teamId, name, donutCount) VALUES ('d63615b8-b854-4909-bb02-69b659607bd4', 1, 'Johnny Le', 0);
INSERT IGNORE INTO team_member (id, teamId, name, donutCount) VALUES ('65f4ed87-bb1f-4fd2-b7f6-80e6c0444f2e', 1, 'Suja Horne', 0);