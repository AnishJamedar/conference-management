-- MySQL dump 10.13  Distrib 9.0.1, for macos14.4 (arm64)
--
-- Host: localhost    Database: confio
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Message`
--

DROP TABLE IF EXISTS `Message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `senderId` int NOT NULL,
  `receiverId` int NOT NULL,
  `text` varchar(255) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `senderId` (`senderId`),
  KEY `receiverId` (`receiverId`),
  CONSTRAINT `message_ibfk_1` FOREIGN KEY (`senderId`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `message_ibfk_2` FOREIGN KEY (`receiverId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Message`
--

LOCK TABLES `Message` WRITE;
/*!40000 ALTER TABLE `Message` DISABLE KEYS */;
/*!40000 ALTER TABLE `Message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Messages`
--

DROP TABLE IF EXISTS `Messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `senderId` int NOT NULL,
  `receiverId` int NOT NULL,
  `text` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Messages`
--

LOCK TABLES `Messages` WRITE;
/*!40000 ALTER TABLE `Messages` DISABLE KEYS */;
INSERT INTO `Messages` VALUES (1,17,9,'hi','2024-11-09 16:42:37','2024-11-09 16:42:37');
/*!40000 ALTER TABLE `Messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Registrations`
--

DROP TABLE IF EXISTS `Registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Registrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `ticket_type` enum('general','vip','student') NOT NULL DEFAULT 'general',
  `payment_status` enum('Pending','Paid') NOT NULL DEFAULT 'Pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Registrations`
--

LOCK TABLES `Registrations` WRITE;
/*!40000 ALTER TABLE `Registrations` DISABLE KEYS */;
INSERT INTO `Registrations` VALUES (1,'Sam','samyakjain930@gmail.com','general','Paid','2024-11-05 17:45:30','2024-11-05 17:45:48');
/*!40000 ALTER TABLE `Registrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Reviews`
--

DROP TABLE IF EXISTS `Reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `submission_id` int NOT NULL,
  `reviewer_id` int NOT NULL,
  `rating` int NOT NULL,
  `feedback` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `status` varchar(255) DEFAULT 'Pending Review',
  PRIMARY KEY (`id`),
  KEY `reviewer_id` (`reviewer_id`),
  KEY `submission_id` (`submission_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`submission_id`) REFERENCES `Submissions` (`id`),
  CONSTRAINT `reviews_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Reviews`
--

LOCK TABLES `Reviews` WRITE;
/*!40000 ALTER TABLE `Reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `Reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Submissions`
--

DROP TABLE IF EXISTS `Submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Submissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `userId` INT NOT NULL,
  `email` varchar(255) NOT NULL,
  `conference_id` int NOT NULL,
  `filePath` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Submissions`
--

LOCK TABLES `Submissions` WRITE;
/*!40000 ALTER TABLE `Submissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `Submissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `email_19` (`email`),
  UNIQUE KEY `email_20` (`email`),
  UNIQUE KEY `email_21` (`email`),
  UNIQUE KEY `email_22` (`email`),
  UNIQUE KEY `email_23` (`email`),
  UNIQUE KEY `email_24` (`email`),
  UNIQUE KEY `email_25` (`email`),
  UNIQUE KEY `email_26` (`email`),
  UNIQUE KEY `email_27` (`email`),
  UNIQUE KEY `email_28` (`email`),
  UNIQUE KEY `email_29` (`email`),
  UNIQUE KEY `email_30` (`email`),
  UNIQUE KEY `email_31` (`email`),
  UNIQUE KEY `email_32` (`email`),
  UNIQUE KEY `email_33` (`email`),
  UNIQUE KEY `email_34` (`email`),
  UNIQUE KEY `email_35` (`email`),
  UNIQUE KEY `email_36` (`email`),
  UNIQUE KEY `email_37` (`email`),
  UNIQUE KEY `email_38` (`email`),
  UNIQUE KEY `email_39` (`email`),
  UNIQUE KEY `email_40` (`email`),
  UNIQUE KEY `email_41` (`email`),
  UNIQUE KEY `email_42` (`email`),
  UNIQUE KEY `email_43` (`email`),
  UNIQUE KEY `email_44` (`email`),
  UNIQUE KEY `email_45` (`email`),
  UNIQUE KEY `email_46` (`email`),
  UNIQUE KEY `email_47` (`email`),
  UNIQUE KEY `email_48` (`email`),
  UNIQUE KEY `email_49` (`email`),
  UNIQUE KEY `email_50` (`email`),
  UNIQUE KEY `email_51` (`email`),
  UNIQUE KEY `email_52` (`email`),
  UNIQUE KEY `email_53` (`email`),
  UNIQUE KEY `email_54` (`email`),
  UNIQUE KEY `email_55` (`email`),
  UNIQUE KEY `email_56` (`email`),
  UNIQUE KEY `email_57` (`email`),
  UNIQUE KEY `email_58` (`email`),
  UNIQUE KEY `email_59` (`email`),
  UNIQUE KEY `email_60` (`email`),
  UNIQUE KEY `email_61` (`email`),
  UNIQUE KEY `email_62` (`email`),
  UNIQUE KEY `email_63` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`


ALTER TABLE Users MODIFY role ENUM('user', 'admin', 'speaker') NOT NULL;

ALTER TABLE Users MODIFY COLUMN role ENUM('admin', 'user', 'speaker') NOT NULL DEFAULT 'user';

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (10,'sam','sam@gmail.com','$2a$10$dcmB45ku./XnpZuhgsHLaOfPZUSWFo5tT7fvA7VRwl2j2lc2XMdam','2024-10-07 22:33:40','2024-10-07 22:33:40','user'),(17,'sam','jain@gmail.com','$2a$10$rsNbfV8PuZbjjRiu5mFVZe3HU0qbc/7/lfGKveK9lhXTdzbG3c5/.','2024-11-09 14:17:23','2024-11-09 14:17:23','admin'),
(18,'Devaki','devakisj555@gmail.com','$2a$10$/LnksnlU4omZ0xTg8oviNel/RvOzX9vhBlH7ggklYSzn1YqaI6mkq','2024-10-07 22:33:40','2024-10-07 22:33:40','user', 1),
(21,'admin','teamconfio@gmail.com','$2a$10$Kx1QOtGLH7ftv8/aYmk5zOMUirtXKnmlzq4WHLeTpQrqCPiKrlAfK','admin', 1),
(29,'Speaker1','socialstroop@gmail.com','$2a$10$.t.4Pzddbw6gRGnllmBvQOccejw7pDv8E2eYKjwSRCWNQN736R6te','2024-10-07 22:33:40','2024-10-07 22:33:40','speaker', 2);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

--
-- Table structure for table `Conference`
--

DROP TABLE IF EXISTS `Conference`;
CREATE TABLE `Conference` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Conference`
--

LOCK TABLES `Conference` WRITE;
/*!40000 ALTER TABLE `Conference` DISABLE KEYS */;
INSERT INTO `Conference` VALUES
(1, 'Artificial Intelligence Conference', 'San Francisco', '2024-12-01 09:00:00'),
(2, 'Data Science Symposium', 'New York', '2024-12-15 10:00:00'),
(3, 'Cloud Innovations Forum', 'Seattle', '2024-12-20 11:00:00'),
(4, 'Cybersecurity Summit', 'Boston', '2024-12-05 09:30:00'),
(5, 'Quantum Computing Workshop', 'Austin', '2024-12-10 08:45:00');
/*!40000 ALTER TABLE `Conference` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Altering Submissions table to include foreign key constraint
--

ALTER TABLE `Submissions`
ADD CONSTRAINT `submissions_ibfk_1` FOREIGN KEY (`conference_id`) REFERENCES `Conference` (`id`) ON DELETE CASCADE;

CREATE TABLE `Sessions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `conference_id` INT NOT NULL,
  `day` VARCHAR(255) NOT NULL,
  `track` VARCHAR(255) NOT NULL,
  `time` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `speaker` VARCHAR(255) NOT NULL,
  `bio` TEXT NOT NULL,
  `education` VARCHAR(255) NOT NULL,
  `expertise` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`conference_id`) REFERENCES `Conference`(`id`) ON DELETE CASCADE
);

INSERT INTO `Sessions` 
(`conference_id`, `day`, `track`, `time`, `title`, `speaker`, `bio`, `education`, `expertise`, `description`)
VALUES
(1, 'Day 1', 'AI & Machine Learning', '10:00 AM', 'AI in Healthcare', 'Dr. John Smith', 
 'Expert in AI technologies applied to healthcare.', 
 'PhD in Computer Science from Stanford University, specialized in Artificial Intelligence.',
 'AI and Machine Learning, Healthcare Technologies',
 'Discussing the latest AI breakthroughs in the healthcare industry and how they are improving patient care and reducing costs.'),

(1, 'Day 1', 'AI & Machine Learning', '12:00 PM', 'Future of Data Science', 'Dr. Jane Doe', 
 'Data scientist specializing in predictive analytics.', 
 'PhD in Data Science from MIT, specialized in Predictive Analytics and Big Data.',
 'Data Science, Predictive Analytics, Big Data',
 'Exploring future trends and challenges in data science, including real-world applications of predictive analytics.'),

(2, 'Day 2', 'Data Science & Analytics', '10:00 AM', 'Data Mining Techniques', 'Dr. Michael Clark', 
 'Professor of Data Science and Machine Learning.', 
 'PhD in Data Science from UC Berkeley.',
 'Data Mining, Machine Learning, Data Science',
 'An overview of the latest data mining techniques used in research and industry, with a focus on scalability and accuracy.'),

(2, 'Day 2', 'Data Science & Analytics', '2:00 PM', 'Big Data in Business', 'Dr. Amanda Cooper', 
 'Expert in Business Data Analytics.', 
 'PhD in Business Analytics from Harvard University.',
 'Big Data, Business Intelligence',
 'How big data is transforming business operations and strategy.');


CREATE TABLE `LiveSessions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `conference_id` INT NOT NULL,
  `time` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `speaker` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`conference_id`) REFERENCES `Conference`(`id`) ON DELETE CASCADE
);

CREATE TABLE `RecordedSessions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `conference_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `watched` BOOLEAN NOT NULL DEFAULT FALSE,
  `link` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`conference_id`) REFERENCES `Conference`(`id`) ON DELETE CASCADE
);

INSERT INTO LiveSessions (conference_id, time, title, speaker)
VALUES
(1, '10:00 AM', 'AI in Healthcare', 'Dr. John Smith'),
(1, '12:00 PM', 'AI & ML Advances', 'Dr. Alice Brown');




CREATE TABLE Jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conference VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  applyLink VARCHAR(255) NOT NULL
);

ALTER TABLE Jobs DROP COLUMN conference;


ALTER TABLE Jobs
ADD COLUMN conference_id INT NOT NULL,
ADD FOREIGN KEY (conference_id) REFERENCES Conference(id) ON DELETE CASCADE;

INSERT INTO Jobs (conference_id, title, company, location, description, applyLink)
VALUES
(1, 'AI Research Scientist', 'Tech Innovators Inc.', 'San Francisco, CA', 'Seeking an AI Research Scientist to work on cutting-edge AI technologies.', 'https://americancenterforai.com/opportunities/ai-research-scientist/?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic'),
(1, 'Machine Learning Engineer', 'AI Solutions', 'Boston, MA', 'Develop and implement machine learning models for healthcare applications.', 'https://jobs.apple.com/en-us/details/200576437/machine-learning-engineer-strategic-data-solutions?team=SFTWR'),

(2, 'Data Scientist', 'Data Insights Corp.', 'New York, NY', 'Looking for a Data Scientist with expertise in machine learning and big data.', 'https://www.linkedin.com/jobs/view/data-scientist-continuous-improvement-at-dallas-college-4078408217/?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic'),
(2, 'Big Data Engineer', 'Analytics Wizards', 'Remote', 'Work with big data technologies to build scalable data pipelines.', 'https://www.ziprecruiter.com/c/Anblicks/Job/Senior-Big-Data-Engineer/-in-Irving,TX?jid=03832cff3fd7156c&utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic'),

(3, 'Cybersecurity Analyst', 'SecureNet Solutions', 'Remote', 'Hiring a Cybersecurity Analyst to help improve security protocols and incident response.', 'https://careers.gmfinancial.com/jobs/47663?lang=en-us&utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic'),
(3, 'Cloud Security Engineer', 'CloudShield Inc.', 'Austin, TX', 'Design and implement security measures for cloud-based applications.', 'https://careers.pnc.com/global/en/job/R171041/AWS-Security-Engineer-Cloud-Identity-Access?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic'),

(4, 'Cloud Architect', 'Cloud Innovators', 'Seattle, WA', 'Seeking a Cloud Architect to design and manage cloud infrastructures.', 'https://careers.gmfinancial.com/jobs/47965?lang=en-us&utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic'),
(4, 'IoT Cloud Engineer', 'IoT Solutions', 'Chicago, IL', 'Develop IoT applications with integration to cloud platforms.', 'https://www.dice.com/job-detail/9a3acda2-389d-48f6-87bd-1298b593d17b?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic'),

(5, 'Quantum Computing Researcher', 'Quantum Innovations', 'Cambridge, MA', 'Research and develop quantum algorithms for cryptography.', 'https://www.ziprecruiter.com/c/Unreal-Gigs/Job/Quantum-Research-Scientist-%28The-Quantum-Pioneer%29/-in-Austin,TX?jid=21aca85a82525193&utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic'),
(5, 'Quantum Software Developer', 'Qubit Labs', 'Remote', 'Develop quantum software applications for next-gen computing solutions.', 'https://www.ziprecruiter.com/c/Unreal-Gigs/Job/Quantum-Applications-Developer-%28The-Quantum-Innovator%29/-in-Austin,TX?jid=346db67cb6d9a1c1&utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic');

ALTER TABLE Jobs DROP COLUMN conference;



CREATE TABLE Resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  link VARCHAR(255) NOT NULL
);

INSERT INTO Resources (title, description, link)
VALUES
('Career Workshops', 'Hands-on workshops to help you build your professional skills, including resume building, interview techniques, and career planning.', 'https://jobfairx.com/job-fairs/texas/arlington/next-technology'),
('Webinars on Skill Development', 'Join our live and recorded webinars focusing on essential skills like leadership, communication, and technical expertise.', 'https://www.skillable.com/resources/on-demand-webinars/'),
('Resume Building Guide', 'A step-by-step guide to crafting a professional resume that stands out.', 'https://www.coursera.org/articles/how-to-make-a-resume'),
('Leadership Skills Webinar', 'Interactive webinar focused on building leadership and management skills.', 'https://leadership.global/whats-on/event-listing.html');

ALTER TABLE Users 
ADD COLUMN expertise VARCHAR(255) NULL;

ALTER TABLE livesessions ADD COLUMN youtube_link VARCHAR(255) DEFAULT NULL;

INSERT INTO livesessions (conference_id, time, title, speaker, youtube_link) 
VALUES (1, '12:00 PM', 'AI Live Coding Session', 'John Doe', '7Hlb8YX2-W8?si=zAzhIpTyHXX_oiZD');


ALTER TABLE Users ADD COLUMN youtube_link VARCHAR(255) DEFAULT NULL;

CREATE TABLE mentors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bio TEXT NOT NULL,
    conference_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


ALTER TABLE Reviews
ADD COLUMN authorId INT NOT NULL;

CREATE TABLE livechat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    username VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE mentor_slots (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    mentor_id INT NOT NULL, 
    date DATE NOT NULL, 
    time_slot VARCHAR(255) NOT NULL, 
    is_available BOOLEAN DEFAULT TRUE, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (mentor_id) REFERENCES mentors(id)
);


-- Inserting sample data for mentor slots

-- Mentor 1: Dr. John Smith (Conference 1)
INSERT INTO mentor_slots (mentor_id, date, time_slot, is_available)
VALUES
(1, '2024-11-24', '10:00 AM - 11:00 AM', TRUE),
(1, '2024-11-24', '11:00 AM - 12:00 PM', TRUE),
(1, '2024-11-25', '09:00 AM - 10:00 AM', TRUE);

-- Mentor 2: Dr. Jane Doe (Conference 2)
INSERT INTO mentor_slots (mentor_id, date, time_slot, is_available)
VALUES
(2, '2024-11-25', '02:00 PM - 03:00 PM', TRUE),
(2, '2024-11-25', '03:00 PM - 04:00 PM', TRUE),
(2, '2024-11-26', '10:00 AM - 11:00 AM', TRUE);

-- Mentor 3: Dr. Michael Clark (Conference 3)
INSERT INTO mentor_slots (mentor_id, date, time_slot, is_available)
VALUES
(3, '2024-11-26', '01:00 PM - 02:00 PM', TRUE),
(3, '2024-11-27', '02:00 PM - 03:00 PM', TRUE),
(3, '2024-11-27', '03:00 PM - 04:00 PM', TRUE);

-- Mentor 4: Dr. Sarah Johnson (Conference 4)
INSERT INTO mentor_slots (mentor_id, date, time_slot, is_available)
VALUES
(4, '2024-11-28', '10:00 AM - 11:00 AM', TRUE),
(4, '2024-11-28', '11:00 AM - 12:00 PM', TRUE),
(4, '2024-11-29', '09:00 AM - 10:00 AM', TRUE);

-- Mentor 5: Dr. Emily Brown (Conference 5)
INSERT INTO mentor_slots (mentor_id, date, time_slot, is_available)
VALUES
(5, '2024-11-29', '01:00 PM - 02:00 PM', TRUE),
(5, '2024-11-30', '02:00 PM - 03:00 PM', TRUE),
(5, '2024-11-30', '03:00 PM - 04:00 PM', TRUE);

INSERT INTO sessions (id, conference_id, day, track, time, title, speaker, bio, education, expertise, description, youtube_link)
VALUES
(5, 3, 'Day 3', 'Cloud Technologies', '10:00:00', 'The Future of Cloud Computing', 'Dr. Sarah Lopez', 
    'Cloud architect specializing in distributed systems.', 
    'PhD in Computer Science from Carnegie Mellon', 
    'Cloud Computing, Distributed Systems', 
    'Exploring advancements in cloud computing and emerging technologies.', 
    'https://www.youtube.com/embed/2vjPBrBU-TM'),
(6, 3, 'Day 3', 'Cloud Technologies', '14:00:00', 'Serverless Architectures', 'Mr. James Wright', 
    'Specialist in serverless computing solutions.', 
    'MS in Computer Engineering from UT Austin', 
    'Serverless Computing, Cloud Platforms', 
    'A deep dive into serverless computing and its impact on scalability and cost efficiency.', 
    'https://www.youtube.com/embed/XYJt6DYq0U0'),
(7, 4, 'Day 4', 'Cyber Threats', '10:00:00', 'Emerging Trends in Cyber Threats', 'Dr. Emily Zhang', 
    'Cybersecurity consultant with expertise in threat intelligence.', 
    'PhD in Information Security from Purdue', 
    'Cyber Threats, Threat Intelligence', 
    'Analyzing current and future trends in cybersecurity threats and response strategies.', 
    'https://www.youtube.com/embed/d8QqXLV8YwY'),
(8, 4, 'Day 4', 'Cyber Security Tools', '14:00:00', 'AI in Cybersecurity', 'Mr. Rahul Mehta', 
    'Engineer leveraging AI for threat detection.', 
    'MS in Cybersecurity from NYU', 
    'AI in Cybersecurity, Threat Detection', 
    'A discussion on how AI is revolutionizing cybersecurity tools and strategies.', 
    'https://www.youtube.com/embed/MhXYV_ZqTW4'),
(9, 5, 'Day 5', 'Quantum Algorithms', '10:00:00', 'Quantum Algorithms for AI', 'Dr. Alan Brown', 
    'Quantum computing researcher focusing on AI applications.', 
    'PhD in Quantum Computing from Caltech', 
    'Quantum Computing, AI', 
    'Insights into quantum algorithms and their transformative potential for artificial intelligence.', 
    'https://www.youtube.com/embed/Zy6vBxqlapw'),
(10, 5, 'Day 5', 'Quantum Systems', '14:00:00', 'Building Scalable Quantum Systems', 'Dr. Linda Green', 
    'Physicist specializing in scalable quantum systems.', 
    'PhD in Physics from ETH Zurich', 
    'Quantum Systems, Quantum Hardware', 
    'Exploring the challenges and advancements in building scalable and reliable quantum computing systems.', 
    'https://www.youtube.com/embed/OGIXg7OsNFw');

INSERT INTO livesessions (id, conference_id, time, title, speaker, youtube_link)
VALUES
-- Conference 2
(4, 2, '10:00:00', 'Data Mining Techniques', 'Dr. Michael Clark', 'civLio11SjQ?si=Ql-Qq7LWky9ULCAx'),
(5, 2, '14:00:00', 'Big Data in Business', 'Dr. Amanda Cooper', 'nflp-a91F6s?si=gjRySavGMGEYlonl'),
-- Conference 3
(6, 3, '10:00:00', 'The Future of Cloud Computing', 'Dr. Sarah Lopez', 'Aqu9KUlVwaw?si=bQRWfYGhG8zfr90M'),
(7, 3, '14:00:00', 'Serverless Architectures', 'Mr. James Wright', 'vxJobGtqKVM?si=Uf_4tEdWBNEMbsU4'),
-- Conference 4
(8, 4, '10:00:00', 'Emerging Trends in Cyber Threats', 'Dr. Emily Zhang', 'VNp35Uw_bSM?si=dTHPmUEOW2sS57V_'),
(9, 4, '14:00:00', 'AI in Cybersecurity', 'Mr. Rahul Mehta', 'qVET1vD3NtQ?si=E2TuR8RSNz9xoXPU'),
-- Conference 5
(10, 5, '10:00:00', 'Quantum Algorithms for AI', 'Dr. Alan Brown', 'NqHKr9CGWJ0?si=gKliEhwTcP49R7Jy'),
(11, 5, '14:00:00', 'Building Scalable Quantum Systems', 'Dr. Linda Green', 'TT3Nm5MbRVQ?si=hoql9lRLhBUY4gFa');

INSERT INTO recordedsessions (id, conference_id, title, watched, link)
VALUES
-- Conference 1
(1, 1, 'AI & Machine Learning', TRUE, 'https://www.youtube.com/watch?v=4RixMPF4xis&pp=ygUXYWkgYW5kIG1hY2hpbmUgbGVhcm5pbmc%3D'),
(2, 1, 'AI Ethics and Society', TRUE, 'https://www.youtube.com/watch?v=vwB-zwGTzGQ&pp=ygUVYWkgZXRoaWNzIGFuZCBzb2NpZXR5'),
-- Conference 2
(3, 2, 'Data Mining Techniques', TRUE, 'https://www.youtube.com/watch?v=dUm3ptTQr0Q&pp=ygUXZGF0YSBtaW5pbmcgdGVjaG5pcXVlcyA%3D'),
(4, 2, 'Big Data in Business', TRUE, 'https://www.youtube.com/watch?v=NIiHfLh4YwU&pp=ygUUYmlnIGRhdGEgaW4gYnVzaW5lc3M%3D'),
-- Conference 3
(5, 3, 'The Future of Cloud Computing', TRUE, 'https://www.youtube.com/watch?v=0uSdVynSZaw&pp=ygUddGhlIGZ1dHVyZSBvZiBjbG91ZCBjb21wdXRpbmc%3D'),
(6, 3, 'Serverless Architectures', TRUE, 'https://www.youtube.com/watch?v=RzsaM6kL1FU&pp=ygUXc2VydmVybGVzcyBhcmNoaXRlY3R1cmU%3D'),
-- Conference 4
(7, 4, 'Emerging Trends in Cyber Threats', TRUE, 'https://www.youtube.com/watch?v=ii09M-VsuPg'),
(8, 4, 'AI in Cybersecurity', TRUE, 'https://www.youtube.com/watch?v=4QzBdeUQ0Dc'),
-- Conference 5
(9, 5, 'Quantum Algorithms for AI', TRUE, 'https://www.youtube.com/watch?v=P7_SfxRrXTE'),
(10, 5, 'Building Scalable Quantum Systems', TRUE, 'https://www.youtube.com/watch?v=MlJGHNrIQ1Q');

ALTER TABLE mentors
ADD available_datetime1 DATETIME,
ADD available_datetime2 DATETIME;

INSERT INTO mentors (id, name, bio, conference_id, created_at, updated_at, available_datetime1, available_datetime2)
VALUES
(6, 'Dr. John Smith', 'PhD in Computer Science from MIT, 10 years of experience in AI. Author of multiple publications and keynote speaker at international conferences.', 1, '2024-11-23 01:52:57', '2024-11-23 23:42:40', '2024-12-01 09:00:00', '2024-12-02 15:00:00'),
(7, 'Dr. Jane Doe', 'PhD in Data Science from Stanford, specializing in predictive analytics. Recognized as a thought leader in predictive modeling and AI ethics.', 2, '2024-11-23 01:52:57', '2024-11-23 23:42:40', '2024-12-03 10:00:00', '2024-12-04 16:00:00'),
(8, 'Dr. Michael Clark', 'PhD in Information Security from Carnegie Mellon University, 15 years of industry experience. He has contributed significantly to the field of cybersecurity through innovative research.', 3, '2024-11-23 01:52:57', '2024-11-23 23:42:40', '2024-12-05 11:00:00', '2024-12-06 14:00:00'),
(9, 'Dr. Sarah Johnson', 'PhD in Cloud Computing from University of Cambridge, expertise in IoT integrations. Her projects focus on integrating IoT with cloud solutions for smart cities.', 4, '2024-11-23 01:52:57', '2024-11-23 23:42:40', '2024-12-07 09:30:00', '2024-12-08 16:30:00'),
(10, 'Dr. Emily Brown', 'PhD in Quantum Computing from MIT, leading research in cryptography and computing power. She is a pioneer in applying quantum computing to cryptography and artificial intelligence.', 5, '2024-11-23 01:52:57', '2024-11-23 23:42:40', '2024-12-09 10:00:00', '2024-12-10 15:00:00');




/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-09 11:03:25


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-09 11:03:25

