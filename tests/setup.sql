DROP DATABASE IF EXISTS silas_test_echo;
CREATE DATABASE silas_test_echo;
USE silas_test_echo;

-- MySQL dump 10.13  Distrib 5.7.29, for Linux (x86_64)
--
-- Host: localhost    Database: silas_test_echo
-- ------------------------------------------------------
-- Server version	5.7.29-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT = @@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS = @@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION = @@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE = @@TIME_ZONE */;
/*!40103 SET TIME_ZONE = '+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, UNIQUE_CHECKS = 0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0 */;
/*!40101 SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES = @@SQL_NOTES, SQL_NOTES = 0 */;

--
-- Table structure for table `access`
--

DROP TABLE IF EXISTS `access`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `access`
(
    `id`          int(11)      NOT NULL AUTO_INCREMENT,
    `createdAt`   datetime     NOT NULL,
    `updatedAt`   datetime     NOT NULL,
    `version`     int(11)      NOT NULL,
    `deleted`     tinyint(4)   NOT NULL,
    `name`        varchar(255) NOT NULL,
    `description` varchar(255) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `IDX_8a974ab8bdb6b87311cd79cb8b` (`name`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 7
  DEFAULT CHARSET = latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `access`
--

LOCK TABLES `access` WRITE;
/*!40000 ALTER TABLE `access`
    DISABLE KEYS */;
INSERT INTO `access`
VALUES (1, '2019-06-18 18:11:24', '2019-06-18 18:11:24', 2, 0, 'default', 'everyone is allowed to do this!'),
       (2, '2019-06-18 18:11:24', '2019-06-18 18:11:24', 2, 0, 'offline', 'does not has internet access!'),
       (3, '2019-06-18 18:11:24', '2019-06-18 18:11:24', 2, 0, 'online', 'has internet access'),
       (4, '2019-06-18 18:11:24', '2019-06-18 18:11:24', 2, 0, 'loggedOut', 'for users, that are not logged in'),
       (5, '2019-06-18 18:11:24', '2019-06-18 18:11:24', 2, 0, 'loggedIn', 'for users, that are logged in'),
       (6, '2019-06-18 18:11:24', '2019-06-18 18:11:24', 2, 0, 'admin', 'Access for admins');
/*!40000 ALTER TABLE `access`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blocked_day`
--

DROP TABLE IF EXISTS `blocked_day`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blocked_day`
(
    `id`              int(11)    NOT NULL AUTO_INCREMENT,
    `createdAt`       datetime   NOT NULL,
    `updatedAt`       datetime   NOT NULL,
    `version`         int(11)    NOT NULL,
    `deleted`         tinyint(1) NOT NULL,
    `day`             datetime   NOT NULL,
    `repeatedEventId` int(11) DEFAULT NULL,
    `eventId`         int(11) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `IDX_blocked_day_repeatedEventId` (`repeatedEventId`),
    KEY `IDX_blocked_day_eventId` (`eventId`),
    CONSTRAINT `FK_blocked_day_eventId` FOREIGN KEY (`eventId`) REFERENCES `event` (`id`),
    CONSTRAINT `FK_blocked_day_repeatedEventId` FOREIGN KEY (`repeatedEventId`) REFERENCES `repeated_event` (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 4
  DEFAULT CHARSET = latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blocked_day`
--

LOCK TABLES `blocked_day` WRITE;
/*!40000 ALTER TABLE `blocked_day`
    DISABLE KEYS */;
INSERT INTO `blocked_day`
VALUES (1, '2020-04-05 00:00:00', '2020-04-05 00:00:00', 1, 0, '2019-07-23 00:00:00', 1, NULL),
       (2, '2020-04-05 00:00:00', '2020-04-05 00:00:00', 1, 0, '2019-07-16 00:00:00', 1, 14),
       (3, '2020-04-05 00:00:00', '2020-04-05 00:00:00', 1, 0, '2019-06-25 00:00:00', 2, 16);
/*!40000 ALTER TABLE `blocked_day`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `church`
--

DROP TABLE IF EXISTS `church`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `church`
(
    `id`           int(11)      NOT NULL AUTO_INCREMENT,
    `createdAt`    datetime     NOT NULL,
    `updatedAt`    datetime     NOT NULL,
    `version`      int(11)      NOT NULL,
    `deleted`      tinyint(1)   NOT NULL,
    `names`        mediumtext   NOT NULL,
    `descriptions` mediumtext   NOT NULL,
    `website`      varchar(255) NOT NULL,
    `places`       mediumtext   NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 15
  DEFAULT CHARSET = latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `church`
--

LOCK TABLES `church` WRITE;
/*!40000 ALTER TABLE `church`
    DISABLE KEYS */;
INSERT INTO `church`
VALUES (1, '2020-04-09 19:41:00', '2020-02-23 14:10:26', 1, 0,
        '{\"de\":\"Köln City Church\", \"en\":\"Colone City Church\"}',
        '{\"de\":\"Lorem ipsum sit doloret. Hier werden dann ganz viele interessante Informationen über die Köln City Church stehen. Außerdem wird der Gottesdienst- Rhythmus in den wechselnden Locations erklärt.\", \"en\":\"Colone City Church description\"}',
        'www.citychurch.koeln',
        '[\"Köln City Church Headquarter\\nWaltherstraße 51\\nLESKAN Park, Halle 10\\n51069 Köln, Dellbrück\", \"Köln City Church \\n Campus Innenstadt (Cinedom)\\n Im Mediapark 1\\n50670 Köln\",\"Köln City Church \\nSenats Hotel \\nUnter Goldschmied 9-17 \\n50667 Köln \\nEingang über Laurenzplatz\"]'),
       (2, '2020-04-09 19:41:00', '2020-02-23 14:10:26', 1, 0,
        '{\"de\":\"A City Church\", \"en\":\"Colone City Church\"}',
        '{\"de\":\"ABC City Church Beschreibung\", \"en\":\"Colone City Church description\"}', 'city-church.koeln',
        '[\"Cinedom Köln\"]'),
       (3, '2020-04-09 19:41:00', '2020-02-23 14:10:26', 1, 0,
        '{\"de\":\"B City Church\", \"en\":\"Colone City Church\"}',
        '{\"de\":\"B City Church Beschreibung\", \"en\":\"Colone City Church description\"}', 'city-church.koeln',
        '[\"Cinedom Köln\", \"Senatshalle Köln\"]'),
       (4, '2020-04-09 19:41:00', '2020-02-23 14:10:26', 1, 0,
        '{\"de\":\"D City Church\", \"en\":\"Colone City Church\"}',
        '{\"de\":\"Köln City Church Beschreibung\", \"en\":\"Colone City Church description\"}', 'city-church.koeln',
        '[\"Cinedom Köln\", \"Senatshalle Köln\"]'),
       (5, '2020-04-09 19:41:00', '2020-02-23 14:10:26', 1, 0,
        '{\"de\":\"E City Church\", \"en\":\"Colone City Church\"}',
        '{\"de\":\"Köln City Church Beschreibung\", \"en\":\"Colone City Church description\"}', 'city-church.koeln',
        '[\"Cinedom Köln\", \"Senatshalle Köln\"]'),
       (6, '2020-04-09 19:41:00', '2020-02-23 14:10:26', 1, 0,
        '{\"de\":\"D City Church\", \"en\":\"Colone City Church\"}',
        '{\"de\":\"Köln City Church Beschreibung\", \"en\":\"Colone City Church description\"}', 'city-church.koeln',
        '[\"Cinedom Köln\", \"Senatshalle Köln\"]'),
       (7, '2020-04-09 19:41:00', '2020-02-23 14:10:26', 1, 0,
        '{\"de\":\"Z City Church\", \"en\":\"Colone City Church\"}',
        '{\"de\":\"Köln City Church Beschreibung\", \"en\":\"Colone City Church description\"}', 'city-church.koeln',
        '[\"Cinedom Köln\", \"Senatshalle Köln\"]'),
       (8, '2020-04-09 19:41:00', '2020-02-23 14:10:26', 1, 0,
        '{\"de\":\"VW City Church\", \"en\":\"Colone City Church\"}',
        '{\"de\":\"Köln City Church Beschreibung\", \"en\":\"Colone City Church description\"}', 'city-church.koeln',
        '[\"Cinedom Köln\", \"Senatshalle Köln\"]'),
       (9, '2020-04-09 19:41:00', '2020-02-23 14:10:26', 1, 0,
        '{\"de\":\"V City Church\", \"en\":\"Colone City Church\"}',
        '{\"de\":\"Köln City Church Beschreibung\", \"en\":\"Colone City Church description\"}', 'city-church.koeln',
        '[\"Cinedom Köln\", \"Senatshalle Köln\"]'),
       (10, '2020-04-09 19:41:00', '2020-02-23 14:10:26', 1, 0,
        '{\"de\":\"AKöln City Church\", \"en\":\"AColone City Church\"}',
        '{\"de\":\"Lorem ipsum sit doloret. Hier werden dann ganz viele interessante Informationen über die Köln City Church stehen. Außerdem wird der Gottesdienst- Rhythmus in den wechselnden Locations erklärt.\", \"en\":\"Colone City Church description\"}',
        'www.citychurch.koeln',
        '[\"Köln City Church Headquarter\\nWaltherstraße 51\\nLESKAN Park, Halle 10\\n51069 Köln, Dellbrück\", \"Köln City Church \\n Campus Innenstadt (Cinedom)\\n Im Mediapark 1\\n50670 Köln\",\"Köln City Church \\nSenats Hotel \\nUnter Goldschmied 9-17 \\n50667 Köln \\nEingang über Laurenzplatz\"]'),
       (11, '2020-04-09 19:41:00', '2020-02-23 14:10:26', 1, 0,
        '{\"de\":\"BKöln City Church\", \"en\":\"CBolone City Church\"}',
        '{\"de\":\"Lorem ipsum sit doloret. Hier werden dann ganz viele interessante Informationen über die Köln City Church stehen. Außerdem wird der Gottesdienst- Rhythmus in den wechselnden Locations erklärt.\", \"en\":\"Colone City Church description\"}',
        'www.citychurch.koeln',
        '[\"Köln City Church Headquarter\\nWaltherstraße 51\\nLESKAN Park, Halle 10\\n51069 Köln, Dellbrück\", \"Köln City Church \\n Campus Innenstadt (Cinedom)\\n Im Mediapark 1\\n50670 Köln\",\"Köln City Church \\nSenats Hotel \\nUnter Goldschmied 9-17 \\n50667 Köln \\nEingang über Laurenzplatz\"]'),
       (12, '2020-04-09 19:41:00', '2020-02-23 14:10:26', 1, 0,
        '{\"de\":\"CKöln City Church\", \"en\":\"CAolone City Church\"}',
        '{\"de\":\"Lorem ipsum sit doloret. Hier werden dann ganz viele interessante Informationen über die Köln City Church stehen. Außerdem wird der Gottesdienst- Rhythmus in den wechselnden Locations erklärt.\", \"en\":\"Colone City Church description\"}',
        'www.citychurch.koeln',
        '[\"CKöln City Church Headquarter\\nWaltherstraße 51\\nLESKAN Park, Halle 10\\n51069 Köln, Dellbrück\", \"Köln City Church \\n Campus Innenstadt (Cinedom)\\n Im Mediapark 1\\n50670 Köln\",\"Köln City Church \\nSenats Hotel \\nUnter Goldschmied 9-17 \\n50667 Köln \\nEingang über Laurenzplatz\"]'),
       (13, '2020-01-09 19:41:00', '2020-02-23 14:10:26', 1, 0,
        '{\"de\":\"Bearbeiten der Kirche Test\", \"en\":\"Edit church test\"}',
        '{\"de\":\"Deutsche Beschreibung vor <b>Bearbeitung!</b>.\", \"en\":\"Englische Beschreibung\"}',
        'my-website.de',
        '[\"Ort vor Bearbeitung 1\", \"Zweiter Ort\",\"Köln City Church \\nSenats Hotel \\nUnter Goldschmied 9-17 \\n50667 Köln \\nEingang über Laurenzplatz\"]'),
       (14, '2020-01-09 19:41:00', '2020-02-23 14:10:26', 1, 0,
        '{\"de\":\"Löschen der Kirche Test\", \"en\":\"Delete church test\"}',
        '{\"de\":\"Deutsche Beschreibung vor <b>Löschung!</b>.\", \"en\":\"Englische Beschreibung vor Löschung\"}',
        'my-delete-website.de',
        '[\"Ort vor Löschung 1\", \"Zweiter Ort\",\"Köln City Church \\nSenats Hotel \\nUnter Goldschmied 9-17 \\n50667 Köln \\nEingang über Laurenzplatz\"]');
/*!40000 ALTER TABLE `church`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `churchEvent`
--

DROP TABLE IF EXISTS `churchEvent`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `churchEvent`
(
    `eventId`  int(11) NOT NULL,
    `churchId` int(11) NOT NULL,
    PRIMARY KEY (`eventId`, `churchId`),
    KEY `IDX_f4b1a473c177d39e9b3adb72bb` (`eventId`),
    KEY `IDX_fc7c57d431d8815a4b511894f2` (`churchId`),
    CONSTRAINT `FK_f4b1a473c177d39e9b3adb72bb8` FOREIGN KEY (`eventId`) REFERENCES `event` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT `FK_fc7c57d431d8815a4b511894f21` FOREIGN KEY (`churchId`) REFERENCES `church` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `churchEvent`
--

LOCK TABLES `churchEvent` WRITE;
/*!40000 ALTER TABLE `churchEvent`
    DISABLE KEYS */;
INSERT INTO `churchEvent`
VALUES (2, 1),
       (4, 1),
       (5, 1),
       (6, 1),
       (7, 1),
       (8, 1),
       (9, 1),
       (10, 1),
       (11, 1),
       (12, 2),
       (13, 1),
       (13, 2),
       (15, 2),
       (17, 2),
       (17, 1),
       (18, 2),
       (18, 1),
       (19, 1),
       (20, 3),
       (21, 5);
/*!40000 ALTER TABLE `churchEvent`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `churchImages`
--

DROP TABLE IF EXISTS `churchImages`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `churchImages`
(
    `churchId`     int(11) NOT NULL,
    `fileMediumId` int(11) NOT NULL,
    PRIMARY KEY (`churchId`, `fileMediumId`),
    KEY `IDX_churchFileMedium_churchId` (`churchId`),
    KEY `IDX_churchFileMedium_fileMediumId` (`fileMediumId`),
    CONSTRAINT `FK_churchFileMedium_churchId` FOREIGN KEY (`churchId`) REFERENCES `church` (`id`) ON DELETE CASCADE,
    CONSTRAINT `FK_churchFileMedium_fileMediumId` FOREIGN KEY (`fileMediumId`) REFERENCES `file_medium` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `churchImages`
--

LOCK TABLES `churchImages` WRITE;
/*!40000 ALTER TABLE `churchImages`
    DISABLE KEYS */;
INSERT INTO `churchImages`
VALUES (1, 16),
       (2, 17),
       (3, 18),
       (4, 19),
       (5, 20),
       (6, 21),
       (7, 22),
       (8, 23),
       (9, 24),
       (10, 25),
       (11, 26),
       (12, 27),
       (13, 28),
       (14, 29);
/*!40000 ALTER TABLE `churchImages`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `churchRegion`
--

DROP TABLE IF EXISTS `churchRegion`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `churchRegion`
(
    `regionId` int(11) NOT NULL,
    `churchId` int(11) NOT NULL,
    PRIMARY KEY (`regionId`, `churchId`),
    KEY `IDX_0ad36b5609be54c388f80473bb` (`regionId`),
    KEY `IDX_9bef852c1c99ceba4c5bb3fc60` (`churchId`),
    CONSTRAINT `FK_0ad36b5609be54c388f80473bb5` FOREIGN KEY (`regionId`) REFERENCES `region` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT `FK_9bef852c1c99ceba4c5bb3fc609` FOREIGN KEY (`churchId`) REFERENCES `church` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `churchRegion`
--

LOCK TABLES `churchRegion` WRITE;
/*!40000 ALTER TABLE `churchRegion`
    DISABLE KEYS */;
INSERT INTO `churchRegion`
VALUES (1, 1),
       (1, 3),
       (1, 4),
       (1, 6),
       (1, 7),
       (1, 8),
       (1, 9),
       (1, 13),
       (1, 14),
       (2, 2),
       (2, 5),
       (2, 8),
       (2, 9),
       (2, 10),
       (2, 11),
       (2, 12);
/*!40000 ALTER TABLE `churchRegion`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event`
(
    `id`              int(11)    NOT NULL AUTO_INCREMENT,
    `createdAt`       datetime   NOT NULL,
    `updatedAt`       datetime   NOT NULL,
    `version`         int(11)    NOT NULL,
    `deleted`         tinyint(1) NOT NULL,
    `names`           mediumtext,
    `descriptions`    mediumtext,
    `places`          mediumtext,
    `startTime`       datetime            DEFAULT NULL,
    `endTime`         datetime            DEFAULT NULL,
    `isTemplate`      tinyint(1) NOT NULL DEFAULT '0',
    `type`            varchar(255)        DEFAULT 'gottesdienst',
    `repeatedEventId` int(11)             DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `IDX_event_repeatedEventId` (`repeatedEventId`),
    CONSTRAINT `FK_event_repeatedEventId` FOREIGN KEY (`repeatedEventId`) REFERENCES `repeated_event` (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 17
  DEFAULT CHARSET = latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event`
    DISABLE KEYS */;
INSERT INTO `event`
VALUES (2, '2019-04-05 00:00:00', '2020-02-23 14:10:27', 1, 0, '{\"de\":\"Termin 1\"}',
        '{\"de\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\"}',
        '[\"Köln City Church Headquarter\\nWaltherstraße 51\\nLESKAN Park, Halle 10\\n51069 Köln, Dellbrück\"]',
        '2019-03-25 12:45:00', '2019-03-25 12:45:00', 0, 'gottesdienst', NULL),
       (4, '2019-04-05 00:00:00', '2020-02-23 14:10:27', 1, 0, '{\"de\":\"Termin 3\"}',
        '{\"de\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\"}',
        '[\"place 1\"]', '2019-04-06 10:00:00', '2019-04-06 12:00:00', 0, 'gottesdienst', NULL),
       (5, '2019-04-05 00:00:00', '2020-02-23 14:10:27', 3, 0, '{\"de\":\"Termin 4\",\"en\":\"Event 4\"}',
        '{\"de\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\",\"en\":\"English dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\"}',
        '{\"place 1\":\"place 1\"}', '2019-04-29 15:00:00', '2019-05-02 10:00:00', 0, 'gottesdienst', NULL),
       (6, '2019-04-05 00:00:00', '2020-02-23 14:10:27', 3, 0, '{\"de\":\"Termin 5\",\"en\":\"Event 5\"}',
        '{\"de\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\",\"en\":\"English ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\"}',
        '{\"place 1\":\"place 1\"}', '2019-05-29 10:00:00', '2019-05-29 10:00:00', 0, 'gottesdienst', NULL),
       (7, '2019-04-05 00:00:00', '2020-02-23 14:10:27', 1, 0, '{\"de\":\"Termin 5.1\"}',
        '{\"de\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\"}',
        '[\"place 1\"]', '2019-05-29 10:00:00', '2019-05-29 10:00:00', 0, 'gottesdienst', NULL),
       (8, '2019-04-05 00:00:00', '2020-02-23 14:10:27', 1, 0, '{\"de\":\"Termin 5.2\"}',
        '{\"de\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\"}',
        '[\"place 1\"]', '2019-05-29 10:00:00', '2019-05-29 10:00:00', 0, 'gottesdienst', NULL),
       (9, '2019-04-05 00:00:00', '2020-02-23 14:10:27', 1, 0, '{\"de\":\"Termin 5.3\"}',
        '{\"de\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\"}',
        '[\"place 1\"]', '2019-05-29 10:00:00', '2019-05-29 10:00:00', 0, 'gottesdienst', NULL),
       (10, '2019-04-05 00:00:00', '2020-02-23 14:10:27', 1, 0, '{\"de\":\"Termin 5.4\"}',
        '{\"de\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\"}',
        '[\"place 1\"]', '2019-05-29 10:00:00', '2019-05-29 10:00:00', 0, 'gottesdienst', NULL),
       (11, '2019-04-05 00:00:00', '2020-02-23 14:10:27', 1, 0, '{\"de\":\"Termin later\"}',
        '{\"de\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\"}',
        '[\"place 1\"]', '2019-06-29 10:00:00', '2019-06-29 12:00:00', 0, 'konzert', NULL),
       (12, '2019-04-05 00:00:00', '2020-02-23 14:10:27', 1, 0, '{\"de\":\"Termin later 2\"}',
        '{\"de\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\"}',
        '[\"place 1\"]', '2019-06-29 10:00:00', '2019-06-29 12:00:00', 0, 'hauskreis', NULL),
       (13, '2019-04-05 00:00:00', '2020-02-23 14:10:27', 1, 0, '{\"de\":\"Template Termin\"}',
        '{\"de\":\"My Description\"}', '[\"place 1\"]', '2019-07-29 10:00:00', '2019-07-29 12:00:00', 1, 'hauskreis',
        1),
       (14, '2019-04-05 00:00:00', '2020-02-23 14:10:27', 1, 0, '{\"de\":\"Template Termin\"}',
        '{\"de\":\"My changed Description\"}', '[\"place 2\"]', '2019-07-17 10:00:00', '2019-07-17 12:00:00', 0,
        'hauskreis', 1),
       (15, '2019-04-05 00:00:00', '2020-02-23 14:10:27', 1, 0, '{\"de\":\"Template Termin 2\"}',
        '{\"de\":\"My Description\"}', '[\"place 1\"]', '2018-06-29 11:00:00', '2018-06-29 12:00:00', 1, 'konzert', 2),
       (16, '2019-04-05 00:00:00', '2020-02-23 14:10:27', 1, 0, NULL, NULL, NULL, '2019-06-27 11:00:00',
        '2019-06-27 12:00:00', 0, NULL, 2),
       (17, '2019-04-05 00:00:00', '2020-02-23 14:10:27', 1, 0, '{\"de\":\"Termin zum bearbeiten\"}',
        '{\"de\":\"My Description\"}', '[\"place 1\"]', '2019-06-05 11:00:00', '2019-06-05 12:00:00', 0, 'sport', NULL),
       (18, '2019-04-05 00:00:00', '2020-02-23 14:10:27', 1, 0, '{\"de\":\"Termin zum bearbeiten wiederholend\"}',
        '{\"de\":\"My Description\"}', '[\"place 1\"]', '2019-06-05 11:00:00', '2019-06-05 12:00:00', 1, 'sport', 3),
       (19, '2019-04-05 00:00:00', '2020-02-23 14:10:27', 1, 0, '{\"de\":\"Termin zum löschen\"}',
        '{\"de\":\"My Description\"}', '[\"place 1\"]', '2019-06-11 10:00:00', '2019-06-11 12:00:00', 0, 'sport',
        NULL),
       (20, '2019-04-05 00:00:00', '2020-02-23 14:10:27', 1, 0, '{\"de\":\"Termin zum löschen wiederholend\"}',
        '{\"de\":\"My Description\"}', '[\"place 1\"]', '2019-06-11 11:00:00', '2019-06-11 12:00:00', 1, 'sport',
        4),
       (21, '2019-04-05 00:00:00', '2020-02-23 14:10:27', 1, 0, '{\"de\":\"Termin zum bearbeiten single wiederholend\"}',
        '{\"de\":\"My Description\"}', '[\"place 1\"]', '2019-06-11 11:00:00', '2019-06-11 12:00:00', 1, 'sport',
        5);
/*!40000 ALTER TABLE `event`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventImages`
--

DROP TABLE IF EXISTS `eventImages`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `eventImages`
(
    `eventId`      int(11) NOT NULL,
    `fileMediumId` int(11) NOT NULL,
    PRIMARY KEY (`eventId`, `fileMediumId`),
    KEY `IDX_eventFileMedium_eventId` (`eventId`),
    KEY `IDX_eventFileMedium_fileMediumId` (`fileMediumId`),
    CONSTRAINT `FK_eventFileMedium_eventId` FOREIGN KEY (`eventId`) REFERENCES `event` (`id`) ON DELETE CASCADE,
    CONSTRAINT `FK_eventFileMedium_fileMediumId` FOREIGN KEY (`fileMediumId`) REFERENCES `file_medium` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventImages`
--

LOCK TABLES `eventImages` WRITE;
/*!40000 ALTER TABLE `eventImages`
    DISABLE KEYS */;
INSERT INTO `eventImages`
VALUES (2, 32),
       (4, 34),
       (5, 35),
       (6, 36),
       (7, 37),
       (8, 38),
       (9, 39),
       (10, 40),
       (11, 41),
       (12, 42),
       (13, 43),
       (14, 44),
       (15, 45),
       (16, 46),
       (17, 48),
       (18, 49),
       (19, 50),
       (20, 51),
       (21, 52);
/*!40000 ALTER TABLE `eventImages`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventRegion`
--

DROP TABLE IF EXISTS `eventRegion`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `eventRegion`
(
    `regionId` int(11) NOT NULL,
    `eventId`  int(11) NOT NULL,
    PRIMARY KEY (`regionId`, `eventId`),
    KEY `IDX_335ad984dab74830e8f996a595` (`regionId`),
    KEY `IDX_84862bb193c7f23798d7f07920` (`eventId`),
    CONSTRAINT `FK_335ad984dab74830e8f996a595e` FOREIGN KEY (`regionId`) REFERENCES `region` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT `FK_84862bb193c7f23798d7f079202` FOREIGN KEY (`eventId`) REFERENCES `event` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventRegion`
--

LOCK TABLES `eventRegion` WRITE;
/*!40000 ALTER TABLE `eventRegion`
    DISABLE KEYS */;
INSERT INTO `eventRegion`
VALUES (1, 2),
       (1, 4),
       (1, 5),
       (1, 6),
       (1, 7),
       (1, 8),
       (1, 9),
       (1, 10),
       (1, 11),
       (1, 12),
       (1, 13),
       (1, 15),
       (1, 17),
       (1, 18),
       (1, 19),
       (1, 20),
       (1, 21);
/*!40000 ALTER TABLE `eventRegion`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `file_medium`
--

DROP TABLE IF EXISTS `file_medium`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `file_medium`
(
    `id`          int(11)    NOT NULL AUTO_INCREMENT,
    `createdAt`   datetime   NOT NULL,
    `updatedAt`   datetime   NOT NULL,
    `version`     int(11)    NOT NULL,
    `deleted`     tinyint(1) NOT NULL,
    `src`         mediumtext NOT NULL,
    `saveOffline` tinyint(1) NOT NULL DEFAULT '1',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 46
  DEFAULT CHARSET = latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file_medium`
--

LOCK TABLES `file_medium` WRITE;
/*!40000 ALTER TABLE `file_medium`
    DISABLE KEYS */;
INSERT INTO `file_medium`
VALUES (1, '2020-02-23 14:10:25', '2020-02-23 14:10:25', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (2, '2020-02-23 14:10:25', '2020-02-23 14:10:25', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (3, '2020-02-23 14:10:25', '2020-02-23 14:10:25', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (4, '2020-02-23 14:10:25', '2020-02-23 14:10:25', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (5, '2020-02-23 14:10:25', '2020-02-23 14:10:25', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (6, '2020-02-23 14:10:25', '2020-02-23 14:10:25', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (7, '2020-02-23 14:10:25', '2020-02-23 14:10:25', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (8, '2020-02-23 14:10:25', '2020-02-23 14:10:25', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (9, '2020-02-23 14:10:25', '2020-02-23 14:10:25', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (10, '2020-02-23 14:10:25', '2020-02-23 14:10:25', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (11, '2020-02-23 14:10:25', '2020-02-23 14:10:25', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (12, '2020-02-23 14:10:25', '2020-02-23 14:10:25', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (13, '2020-02-23 14:10:25', '2020-02-23 14:10:25', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (14, '2020-02-23 14:10:25', '2020-02-23 14:10:25', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (16, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (17, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (18, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (19, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (20, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (21, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (22, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (23, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (24, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (25, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (26, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (27, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (28, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (29, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (32, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (34, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (35, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (36, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (37, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (38, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (39, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (40, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (41, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (42, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (43, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (44, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (45, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (46, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (47, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (48, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (49, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (50, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (51, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1),
       (52, '2020-02-23 14:10:26', '2020-02-23 14:10:26', 1, 0,
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg', 1);
/*!40000 ALTER TABLE `file_medium`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fsj`
--

DROP TABLE IF EXISTS `fsj`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fsj`
(
    `id`           int(11)      NOT NULL AUTO_INCREMENT,
    `createdAt`    datetime     NOT NULL,
    `updatedAt`    datetime     NOT NULL,
    `version`      int(11)      NOT NULL,
    `deleted`      tinyint(1)   NOT NULL,
    `names`        mediumtext   NOT NULL,
    `descriptions` mediumtext   NOT NULL,
    `website`      varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 15
  DEFAULT CHARSET = latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fsj`
--

LOCK TABLES `fsj` WRITE;
/*!40000 ALTER TABLE `fsj`
    DISABLE KEYS */;
INSERT INTO `fsj`
VALUES (1, '2020-04-05 00:00:00', '2020-02-23 14:10:26', 1, 0, '{\"de\":\"Mein FSJ\",\"en\":\"my FSJ en\"}',
        '{\"de\":\"mein FSJ 1\",\"en\":\"my FSJ en\"}', 'silas.link'),
       (2, '2020-04-05 00:00:00', '2020-02-23 14:10:26', 1, 0, '{\"de\":\"AMeine FSJ\",\"en\":\"my FSJ en\"}',
        '{\"de\":\"Amein FSJ 1\",\"en\":\"my FSJ en\"}', 'silas.link'),
       (3, '2020-04-05 00:00:00', '2020-02-23 14:10:26', 1, 0, '{\"de\":\"CMeine FSJ\",\"en\":\"my FSJ en\"}',
        '{\"de\":\"Cmein FSJ 1\",\"en\":\"my FSJ en\"}', 'silas.link'),
       (4, '2020-04-05 00:00:00', '2020-02-23 14:10:26', 1, 0, '{\"de\":\"DMeine FSJ\",\"en\":\"my FSJ en\"}',
        '{\"de\":\"Dmein FSJ 1\",\"en\":\"my FSJ en\"}', 'silas.link'),
       (5, '2020-04-05 00:00:00', '2020-02-23 14:10:26', 1, 0, '{\"de\":\"FMein FSJ\",\"en\":\"my FSJ en\"}',
        '{\"de\":\"Fmein FSJ 1\",\"en\":\"my FSJ en\"}', 'silas.link'),
       (6, '2020-04-05 00:00:00', '2020-02-23 14:10:26', 1, 0, '{\"de\":\"FMein FSJ\",\"en\":\"my FSJ en\"}',
        '{\"de\":\"Fmein FSJ 1\",\"en\":\"my FSJ en\"}', 'silas.link'),
       (7, '2020-04-05 00:00:00', '2020-02-23 14:10:26', 1, 0, '{\"de\":\"LMein FSJ\",\"en\":\"my FSJ en\"}',
        '{\"de\":\"Fmein FSJ 1\",\"en\":\"my FSJ en\"}', 'silas.link'),
       (8, '2020-04-05 00:00:00', '2020-02-23 14:10:26', 1, 0, '{\"de\":\"KMein FSJ\",\"en\":\"my FSJ en\"}',
        '{\"de\":\"Fmein FSJ 1\",\"en\":\"my FSJ en\"}', 'silas.link'),
       (9, '2020-04-05 00:00:00', '2020-02-23 14:10:26', 1, 0, '{\"de\":\"PMein FSJ\",\"en\":\"my FSJ en\"}',
        '{\"de\":\"Fmein FSJ 1\",\"en\":\"my FSJ en\"}', 'silas.link'),
       (10, '2020-04-05 00:00:00', '2020-02-23 14:10:26', 1, 0, '{\"de\":\"OMein FSJ\",\"en\":\"my FSJ en\"}',
        '{\"de\":\"Fmein FSJ 1\",\"en\":\"my FSJ en\"}', 'silas.link'),
       (11, '2020-04-05 00:00:00', '2020-02-23 14:10:26', 1, 0, '{\"de\":\"HMein FSJ\",\"en\":\"my FSJ en\"}',
        '{\"de\":\"Fmein FSJ 1\",\"en\":\"my FSJ en\"}', 'silas.link'),
       (12, '2020-04-05 00:00:00', '2020-02-23 14:10:26', 1, 0, '{\"de\":\"VMein FSJ\",\"en\":\"my FSJ en\"}',
        '{\"de\":\"Fmein FSJ 1\",\"en\":\"my FSJ en\"}', 'silas.link'),
       (13, '2020-04-05 00:00:00', '2020-02-23 14:10:26', 1, 0, '{\"de\":\"VMein zweites FSJ\",\"en\":\"my FSJ en\"}',
        '{\"de\":\"Fmein FSJ 1\",\"en\":\"my FSJ en\"}', 'silas.link'),
       (14, '2020-04-05 00:00:00', '2020-02-23 14:10:26', 1, 0, '{\"de\":\"ZMein FSJ\",\"en\":\"my FSJ en\"}',
        '{\"de\":\"Fmein FSJ 1\",\"en\":\"my FSJ en\"}', 'silas.link'),
       (15, '2020-04-05 00:00:00', '2020-02-23 14:10:26', 1, 0,
        '{\"de\":\"Bearbeiten des FSJ Test\",\"en\":\"Edit fsj test\"}',
        '{\"de\":\"Deutsche Beschreibung vor <b>Bearbeitung!</b>.\",\"en\":\"Englische Beschreibung\"}',
        'my-website.de'),
       (16, '2020-04-05 00:00:00', '2020-02-23 14:10:26', 1, 0,
        '{\"de\":\"Löschen des FSJ Test\",\"en\":\"Edit fsj test\"}',
        '{\"de\":\"Deutsche Beschreibung vor <b>Bearbeitung!</b>.\",\"en\":\"Englische Beschreibung\"}',
        'delete.fsj.de');
/*!40000 ALTER TABLE `fsj`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fsjImages`
--

DROP TABLE IF EXISTS `fsjImages`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fsjImages`
(
    `fsjId`        int(11) NOT NULL,
    `fileMediumId` int(11) NOT NULL,
    PRIMARY KEY (`fsjId`, `fileMediumId`),
    KEY `IDX_fsjFileMedium_fsjId` (`fsjId`),
    KEY `IDX_fsjFileMedium_fileMediumId` (`fileMediumId`),
    CONSTRAINT `FK_fsjFileMedium_fileMediumId` FOREIGN KEY (`fileMediumId`) REFERENCES `file_medium` (`id`) ON DELETE CASCADE,
    CONSTRAINT `FK_fsjFileMedium_fsjId` FOREIGN KEY (`fsjId`) REFERENCES `fsj` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fsjImages`
--

LOCK TABLES `fsjImages` WRITE;
/*!40000 ALTER TABLE `fsjImages`
    DISABLE KEYS */;
INSERT INTO `fsjImages`
VALUES (1, 1),
       (2, 2),
       (3, 3),
       (4, 4),
       (5, 5),
       (6, 6),
       (7, 7),
       (8, 8),
       (9, 9),
       (10, 10),
       (11, 11),
       (12, 12),
       (13, 13),
       (14, 14),
       (15, 46),
       (16, 47);
/*!40000 ALTER TABLE `fsjImages`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations`
(
    `id`        int(11)      NOT NULL AUTO_INCREMENT,
    `timestamp` bigint(20)   NOT NULL,
    `name`      varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 8
  DEFAULT CHARSET = latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations`
    DISABLE KEYS */;
INSERT INTO `migrations`
VALUES (1, 1000000000000, 'SetupSchema1000000000000'),
       (2, 1000000001000, 'SetupUserManagement1000000001000'),
       (3, 1000000005000, 'Data1000000005000'),
       (4, 1000000006000, 'FsjSchema1000000006000'),
       (5, 1000000007000, 'AddRepeatedEvent1000000007000'),
       (6, 1000000010000, 'ImagesSchema1000000010000'),
       (7, 1000000011000, 'ImagesSchemaDownload1000000011000');
/*!40000 ALTER TABLE `migrations`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post`
(
    `id`        int(11)    NOT NULL AUTO_INCREMENT,
    `createdAt` datetime   NOT NULL,
    `updatedAt` datetime   NOT NULL,
    `version`   int(11)    NOT NULL,
    `deleted`   tinyint(4) NOT NULL,
    `texts`     mediumtext NOT NULL,
    `priority`  int(11)    NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 6
  DEFAULT CHARSET = latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post`
    DISABLE KEYS */;
INSERT INTO `post`
VALUES (1, '2020-04-05 00:00:00', '2020-04-05 00:00:00', 1, 0,
        '{\"de\":\"<p>first post</p>\",\"en\":\"<p>muhahah</p>\"}', 0),
       (2, '2020-04-06 00:00:00', '2020-04-05 00:00:00', 1, 0,
        '{\"de\":\"<p>second post</p>\",\"en\":\"<p>muhahah</p>\"}', 0),
       (3, '2020-04-04 00:00:00', '2020-04-05 00:00:00', 1, 0,
        '{\"de\":\"<p>third post</p>\",\"en\":\"<p>muhahah</p>\"}', 0),
       (4, '2020-05-04 00:00:00', '2020-04-05 00:00:00', 1, 0, '{\"de\":\"<p>4 post</p>\",\"en\":\"<p>muhahah</p>\"}',
        -1),
       (5, '2019-04-05 00:00:00', '2020-04-05 00:00:00', 1, 0, '{\"de\":\"<p>5 post</p>\",\"en\":\"<p>muhahah</p>\"}',
        10);
/*!40000 ALTER TABLE `post`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `postRegion`
--

DROP TABLE IF EXISTS `postRegion`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `postRegion`
(
    `postId`   int(11) NOT NULL,
    `regionId` int(11) NOT NULL,
    PRIMARY KEY (`postId`, `regionId`),
    KEY `IDX_feabafc505806120d9f9180008` (`postId`),
    KEY `IDX_378c7294789334bb1a3216ceaf` (`regionId`),
    CONSTRAINT `FK_378c7294789334bb1a3216ceafd` FOREIGN KEY (`regionId`) REFERENCES `region` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT `FK_feabafc505806120d9f9180008c` FOREIGN KEY (`postId`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `postRegion`
--

LOCK TABLES `postRegion` WRITE;
/*!40000 ALTER TABLE `postRegion`
    DISABLE KEYS */;
INSERT INTO `postRegion`
VALUES (1, 1),
       (2, 1),
       (3, 1),
       (4, 1),
       (5, 1);
/*!40000 ALTER TABLE `postRegion`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `region`
--

DROP TABLE IF EXISTS `region`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `region`
(
    `id`        int(11)      NOT NULL AUTO_INCREMENT,
    `createdAt` datetime     NOT NULL,
    `updatedAt` datetime     NOT NULL,
    `version`   int(11)      NOT NULL,
    `deleted`   tinyint(4)   NOT NULL,
    `name`      varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 3
  DEFAULT CHARSET = latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `region`
--

LOCK TABLES `region` WRITE;
/*!40000 ALTER TABLE `region`
    DISABLE KEYS */;
INSERT INTO `region`
VALUES (1, '2020-02-02 18:00:00', '2020-04-04 19:01:59', 1, 0, 'Köln'),
       (2, '2020-02-02 18:00:00', '2020-04-04 19:01:59', 1, 0, 'Aachen');
/*!40000 ALTER TABLE `region`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `repeated_event`
--

DROP TABLE IF EXISTS `repeated_event`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `repeated_event`
(
    `id`                 int(11)    NOT NULL AUTO_INCREMENT,
    `createdAt`          datetime   NOT NULL,
    `updatedAt`          datetime   NOT NULL,
    `version`            int(11)    NOT NULL,
    `deleted`            tinyint(1) NOT NULL,
    `repeatUntil`        datetime DEFAULT NULL,
    `startDate`          datetime   NOT NULL,
    `repeatingStrategy`  int(11)    NOT NULL,
    `repeatingArguments` text       NOT NULL,
    `originalEventId`    int(11)  DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `IDX_repeated_event_originalEventId` (`originalEventId`),
    CONSTRAINT `FK_repeated_event_originalEventId` FOREIGN KEY (`originalEventId`) REFERENCES `event` (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 3
  DEFAULT CHARSET = latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `repeated_event`
--

LOCK TABLES `repeated_event` WRITE;
/*!40000 ALTER TABLE `repeated_event`
    DISABLE KEYS */;
INSERT INTO `repeated_event`
VALUES (1, '2020-04-05 00:00:00', '2020-04-05 00:00:00', 1, 0, NULL, '2019-07-05 00:00:00', 0, '2,4', 13),
       (2, '2020-04-05 00:00:00', '2020-04-05 00:00:00', 1, 0, NULL, '2019-06-05 00:00:00', 0, '2', 15),
       (3, '2020-04-05 00:00:00', '2020-04-05 00:00:00', 1, 0, NULL, '2019-06-05 00:00:00', 0, '1,5', 18),
       (4, '2020-04-05 00:00:00', '2020-04-05 00:00:00', 1, 0, NULL, '2019-06-05 00:00:00', 0, '1,5,6', 20),
       (5, '2020-04-05 00:00:00', '2020-04-05 00:00:00', 1, 0, NULL, '2019-06-05 00:00:00', 0, '3', 21);
/*!40000 ALTER TABLE `repeated_event`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role`
(
    `id`          int(11)      NOT NULL AUTO_INCREMENT,
    `createdAt`   datetime     NOT NULL,
    `updatedAt`   datetime     NOT NULL,
    `version`     int(11)      NOT NULL,
    `deleted`     tinyint(4)   NOT NULL,
    `name`        varchar(255) NOT NULL,
    `description` varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 6
  DEFAULT CHARSET = latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role`
    DISABLE KEYS */;
INSERT INTO `role`
VALUES (1, '2019-06-18 18:11:24', '2019-06-18 18:11:24', 2, 0, 'offlineRole', 'role for user that are offline'),
       (2, '2019-06-18 18:11:24', '2019-06-18 18:11:24', 2, 0, 'onlineRole', 'role for user that are online'),
       (3, '2019-06-18 18:11:25', '2019-06-18 18:11:25', 2, 0, 'visitorRole',
        'role for user that are online, but not logged in'),
       (4, '2019-06-18 18:11:25', '2019-06-18 18:11:25', 2, 0, 'memberRole',
        'role for user that are online and logged in'),
       (5, '2019-06-18 18:11:25', '2019-06-18 18:11:25', 2, 0, 'Admin',
        'Role for Admins (online, logged in and admin)');
/*!40000 ALTER TABLE `role`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roleAccess`
--

DROP TABLE IF EXISTS `roleAccess`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roleAccess`
(
    `roleId`   int(11) NOT NULL,
    `accessId` int(11) NOT NULL,
    PRIMARY KEY (`roleId`, `accessId`),
    KEY `IDX_38300dd4683a436f8db90b42bd` (`roleId`),
    KEY `IDX_bd55fc382ad2480f75a17e33cb` (`accessId`),
    CONSTRAINT `FK_38300dd4683a436f8db90b42bd9` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT `FK_bd55fc382ad2480f75a17e33cb5` FOREIGN KEY (`accessId`) REFERENCES `access` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roleAccess`
--

LOCK TABLES `roleAccess` WRITE;
/*!40000 ALTER TABLE `roleAccess`
    DISABLE KEYS */;
INSERT INTO `roleAccess`
VALUES (1, 1),
       (1, 2),
       (2, 1),
       (2, 3),
       (3, 4),
       (4, 5),
       (5, 6);
/*!40000 ALTER TABLE `roleAccess`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roleChildren`
--

DROP TABLE IF EXISTS `roleChildren`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roleChildren`
(
    `childId`  int(11) NOT NULL,
    `parentId` int(11) NOT NULL,
    PRIMARY KEY (`childId`, `parentId`),
    KEY `IDX_030234c342756c67cefa480687` (`childId`),
    KEY `IDX_35741f2d68a65c2765047705f8` (`parentId`),
    CONSTRAINT `FK_030234c342756c67cefa4806876` FOREIGN KEY (`childId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT `FK_35741f2d68a65c2765047705f8d` FOREIGN KEY (`parentId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roleChildren`
--

LOCK TABLES `roleChildren` WRITE;
/*!40000 ALTER TABLE `roleChildren`
    DISABLE KEYS */;
INSERT INTO `roleChildren`
VALUES (3, 2),
       (4, 2),
       (5, 4);
/*!40000 ALTER TABLE `roleChildren`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test`
--

DROP TABLE IF EXISTS `test`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `test`
(
    `id`        int(11)    NOT NULL AUTO_INCREMENT,
    `createdAt` datetime   NOT NULL,
    `updatedAt` datetime   NOT NULL,
    `version`   int(11)    NOT NULL,
    `deleted`   tinyint(1) NOT NULL,
    `deletedAt` datetime DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test`
--

LOCK TABLES `test` WRITE;
/*!40000 ALTER TABLE `test`
    DISABLE KEYS */;
/*!40000 ALTER TABLE `test`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user`
(
    `id`        int(11)      NOT NULL AUTO_INCREMENT,
    `createdAt` datetime     NOT NULL,
    `updatedAt` datetime     NOT NULL,
    `version`   int(11)      NOT NULL,
    `deleted`   tinyint(4)   NOT NULL,
    `username`  varchar(255) NOT NULL,
    `email`     varchar(255) NOT NULL,
    `password`  varchar(255) NOT NULL,
    `activated` tinyint(4)   NOT NULL,
    `blocked`   tinyint(4)   NOT NULL,
    `salt`      varchar(255) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `IDX_78a916df40e02a9deb1c4b75ed` (`username`),
    UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 2
  DEFAULT CHARSET = latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user`
    DISABLE KEYS */;
INSERT INTO `user`
VALUES (1, '2019-06-18 18:11:25', '2019-06-18 18:11:25', 2, 0, 'admin', 'echo@silas.link',
        'e1dd5be9f357f989e2c6ca683c1fe7910ce048c4b311a4300261a82a9db1694813e8cdab1d62b2bb5cb068cc3fa8e78c6da22b38961ef10a67a84b34d496e5bf',
        1, 0, '50c220dc3b51');
/*!40000 ALTER TABLE `user`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userRole`
--

DROP TABLE IF EXISTS `userRole`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userRole`
(
    `userId` int(11) NOT NULL,
    `roleId` int(11) NOT NULL,
    PRIMARY KEY (`userId`, `roleId`),
    KEY `IDX_bc794a2ac3d2f53fc2bc04c3cf` (`userId`),
    KEY `IDX_aa72ae0c32996d476c28f12eb7` (`roleId`),
    CONSTRAINT `FK_aa72ae0c32996d476c28f12eb78` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT `FK_bc794a2ac3d2f53fc2bc04c3cf4` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userRole`
--

LOCK TABLES `userRole` WRITE;
/*!40000 ALTER TABLE `userRole`
    DISABLE KEYS */;
INSERT INTO `userRole`
VALUES (1, 5);
/*!40000 ALTER TABLE `userRole`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_access`
--

DROP TABLE IF EXISTS `user_access`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_access`
(
    `id`       int(11) NOT NULL AUTO_INCREMENT,
    `accessId` int(11) DEFAULT NULL,
    `userId`   int(11) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `FK_8c375776a832305b238dee207d8` (`accessId`),
    KEY `FK_95da52cd2e73d533819048acfba` (`userId`),
    CONSTRAINT `FK_8c375776a832305b238dee207d8` FOREIGN KEY (`accessId`) REFERENCES `access` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `FK_95da52cd2e73d533819048acfba` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB
  AUTO_INCREMENT = 5
  DEFAULT CHARSET = latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_access`
--

LOCK TABLES `user_access` WRITE;
/*!40000 ALTER TABLE `user_access`
    DISABLE KEYS */;
INSERT INTO `user_access`
VALUES (1, 6, 1),
       (2, 5, 1),
       (3, 1, 1),
       (4, 3, 1);
/*!40000 ALTER TABLE `user_access`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variable`
--

DROP TABLE IF EXISTS `variable`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `variable`
(
    `id`        int(11)      NOT NULL AUTO_INCREMENT,
    `createdAt` datetime     NOT NULL,
    `updatedAt` datetime     NOT NULL,
    `version`   int(11)      NOT NULL,
    `deleted`   tinyint(4)   NOT NULL,
    `name`      varchar(255) NOT NULL,
    `value`     text         NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 3
  DEFAULT CHARSET = latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variable`
--

LOCK TABLES `variable` WRITE;
/*!40000 ALTER TABLE `variable`
    DISABLE KEYS */;
INSERT INTO `variable`
VALUES (2, '2019-06-18 18:11:24', '2019-06-29 21:36:20', 47, 0, 'dbVersion', '1');
/*!40000 ALTER TABLE `variable`
    ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE = @OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE = @OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT = @OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS = @OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION = @OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES = @OLD_SQL_NOTES */;

-- Dump completed on 2020-02-23 14:12:19
