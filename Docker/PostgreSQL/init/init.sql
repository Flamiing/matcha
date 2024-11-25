CREATE TYPE gender_enum AS ENUM('Male', 'Female');
CREATE TYPE gender_preference_enum AS ENUM('Male', 'Female', 'Bisexual');

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	email VARCHAR(255) UNIQUE NOT NULL,
	username VARCHAR(50) UNIQUE NOT NULL,
	first_name VARCHAR(50),
	last_name VARCHAR(50),
	password VARCHAR(255) NOT NULL,
	age INTEGER CHECK (age >= 0),
	biography TEXT,
	profile_picture INTEGER,
	location VARCHAR(100),
	fame INTEGER DEFAULT 0,
	last_online TIMESTAMP,
	is_online BOOLEAN DEFAULT FALSE,
	gender gender_enum,
	sexual_preference gender_preference_enum
);

CREATE TABLE images (
	id SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
	image VARCHAR(255) NOT NULL
);

CREATE TABLE tags (
	id SERIAL PRIMARY KEY,
	value VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE user_tags (
	id SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
	tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
	UNIQUE(user_id, tag_id)
);

CREATE TABLE likes (
	id SERIAL PRIMARY KEY,
	liked_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
	liked_to INTEGER REFERENCES users(id) ON DELETE CASCADE,
	time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UNIQUE(liked_by, liked_to)
);

CREATE TABLE visit_history (
	id SERIAL PRIMARY KEY,
	viewer INTEGER REFERENCES users(id) ON DELETE CASCADE,
	viewed INTEGER REFERENCES users(id) ON DELETE CASCADE,
	time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blocked_users (
	id SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
	blocked_user INTEGER REFERENCES users(id) ON DELETE CASCADE,
	UNIQUE(user_id, blocked_user)
);

CREATE TABLE reports (
	id SERIAL PRIMARY KEY,
	reporter INTEGER REFERENCES users(id) ON DELETE CASCADE,
	reported INTEGER REFERENCES users(id) ON DELETE CASCADE,
	time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UNIQUE(reporter, reported)
);

CREATE TABLE chats (
    id SERIAL PRIMARY KEY,
    user1 INTEGER REFERENCES users(id) ON DELETE CASCADE,
    user2 INTEGER REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user1, user2)
);

CREATE TABLE message (
    id SERIAL PRIMARY KEY,
    chat_id INTEGER REFERENCES chats(id) ON DELETE CASCADE,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content TEXT NOT NULL
);

ALTER TABLE users
ADD CONSTRAINT fk_profile_picture
FOREIGN KEY (profile_picture) REFERENCES images(id) ON DELETE SET NULL;