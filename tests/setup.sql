-- MySQL dump 10.13  Distrib 5.7.26, for Linux (x86_64)
--
-- Host: localhost    Database: silas_echo
-- ------------------------------------------------------
-- Server version	5.7.26-0ubuntu0.18.04.1

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
    `deleted`      tinyint(4)   NOT NULL,
    `website`      varchar(255) NOT NULL,
    `names`        mediumtext   NOT NULL,
    `descriptions` mediumtext   NOT NULL,
    `places`       mediumtext   NOT NULL,
    `images`       mediumtext   NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 13
  DEFAULT CHARSET = latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `church`
--

LOCK TABLES `church` WRITE;
/*!40000 ALTER TABLE `church`
    DISABLE KEYS */;
INSERT INTO `church`
VALUES (1, '2020-04-09 19:41:00', '2020-04-09 19:41:00', 1, 0, 'www.citychurch.koeln',
        '{\"de\":\"Köln City Church\", \"en\":\"Colone City Church\"}',
        '{\"de\":\"Lorem ipsum sit doloret. Hier werden dann ganz viele interessante Informationen über die Köln City Church stehen. Außerdem wird der Gottesdienst- Rhythmus in den wechselnden Locations erklärt.\", \"en\":\"Colone City Church description\"}',
        '[\"Köln City Church Headquarter\\nWaltherstraße 51\\nLESKAN Park, Halle 10\\n51069 Köln, Dellbrück\", \"Köln City Church \\n Campus Innenstadt (Cinedom)\\n Im Mediapark 1\\n50670 Köln\",\"Köln City Church \\nSenats Hotel \\nUnter Goldschmied 9-17 \\n50667 Köln \\nEingang über Laurenzplatz\"]',
        '[\"https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]'),
       (2, '2020-04-09 19:41:00', '2020-04-09 19:41:00', 1, 0, 'city-church.koeln',
        '{\"de\":\"A City Church\", \"en\":\"Colone City Church\"}',
        '{\"de\":\"ABC City Church Beschreibung\", \"en\":\"Colone City Church description\"}', '[\"Cinedom Köln\"]',
        '[\"https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]'),
       (3, '2020-04-09 19:41:00', '2020-04-09 19:41:00', 1, 0, 'city-church.koeln',
        '{\"de\":\"B City Church\", \"en\":\"Colone City Church\"}',
        '{\"de\":\"B City Church Beschreibung\", \"en\":\"Colone City Church description\"}',
        '[\"Cinedom Köln\", \"Senatshalle Köln\"]',
        '[\"https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]'),
       (4, '2020-04-09 19:41:00', '2020-04-09 19:41:00', 1, 0, 'city-church.koeln',
        '{\"de\":\"D City Church\", \"en\":\"Colone City Church\"}',
        '{\"de\":\"Köln City Church Beschreibung\", \"en\":\"Colone City Church description\"}',
        '[\"Cinedom Köln\", \"Senatshalle Köln\"]',
        '[\"https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]'),
       (5, '2020-04-09 19:41:00', '2020-04-09 19:41:00', 1, 0, 'city-church.koeln',
        '{\"de\":\"E City Church\", \"en\":\"Colone City Church\"}',
        '{\"de\":\"Köln City Church Beschreibung\", \"en\":\"Colone City Church description\"}',
        '[\"Cinedom Köln\", \"Senatshalle Köln\"]',
        '[\"https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]'),
       (6, '2020-04-09 19:41:00', '2020-04-09 19:41:00', 1, 0, 'city-church.koeln',
        '{\"de\":\"D City Church\", \"en\":\"Colone City Church\"}',
        '{\"de\":\"Köln City Church Beschreibung\", \"en\":\"Colone City Church description\"}',
        '[\"Cinedom Köln\", \"Senatshalle Köln\"]',
        '[\"https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]'),
       (7, '2020-04-09 19:41:00', '2020-04-09 19:41:00', 1, 0, 'city-church.koeln',
        '{\"de\":\"Z City Church\", \"en\":\"Colone City Church\"}',
        '{\"de\":\"Köln City Church Beschreibung\", \"en\":\"Colone City Church description\"}',
        '[\"Cinedom Köln\", \"Senatshalle Köln\"]',
        '[\"https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]'),
       (8, '2020-04-09 19:41:00', '2020-04-09 19:41:00', 1, 0, 'city-church.koeln',
        '{\"de\":\"VW City Church\", \"en\":\"Colone City Church\"}',
        '{\"de\":\"Köln City Church Beschreibung\", \"en\":\"Colone City Church description\"}',
        '[\"Cinedom Köln\", \"Senatshalle Köln\"]',
        '[\"https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]'),
       (9, '2020-04-09 19:41:00', '2020-04-09 19:41:00', 1, 0, 'city-church.koeln',
        '{\"de\":\"V City Church\", \"en\":\"Colone City Church\"}',
        '{\"de\":\"Köln City Church Beschreibung\", \"en\":\"Colone City Church description\"}',
        '[\"Cinedom Köln\", \"Senatshalle Köln\"]',
        '[\"https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]'),
       (10, '2020-04-09 19:41:00', '2020-04-09 19:41:00', 1, 0, 'www.citychurch.koeln',
        '{\"de\":\"AKöln City Church\", \"en\":\"AColone City Church\"}',
        '{\"de\":\"Lorem ipsum sit doloret. Hier werden dann ganz viele interessante Informationen über die Köln City Church stehen. Außerdem wird der Gottesdienst- Rhythmus in den wechselnden Locations erklärt.\", \"en\":\"Colone City Church description\"}',
        '[\"Köln City Church Headquarter\\nWaltherstraße 51\\nLESKAN Park, Halle 10\\n51069 Köln, Dellbrück\", \"Köln City Church \\n Campus Innenstadt (Cinedom)\\n Im Mediapark 1\\n50670 Köln\",\"Köln City Church \\nSenats Hotel \\nUnter Goldschmied 9-17 \\n50667 Köln \\nEingang über Laurenzplatz\"]',
        '[\"https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]'),
       (11, '2020-04-09 19:41:00', '2020-04-09 19:41:00', 1, 0, 'www.citychurch.koeln',
        '{\"de\":\"BKöln City Church\", \"en\":\"CBolone City Church\"}',
        '{\"de\":\"Lorem ipsum sit doloret. Hier werden dann ganz viele interessante Informationen über die Köln City Church stehen. Außerdem wird der Gottesdienst- Rhythmus in den wechselnden Locations erklärt.\", \"en\":\"Colone City Church description\"}',
        '[\"Köln City Church Headquarter\\nWaltherstraße 51\\nLESKAN Park, Halle 10\\n51069 Köln, Dellbrück\", \"Köln City Church \\n Campus Innenstadt (Cinedom)\\n Im Mediapark 1\\n50670 Köln\",\"Köln City Church \\nSenats Hotel \\nUnter Goldschmied 9-17 \\n50667 Köln \\nEingang über Laurenzplatz\"]',
        '[\"https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]'),
       (12, '2020-04-09 19:41:00', '2020-04-09 19:41:00', 1, 0, 'www.citychurch.koeln',
        '{\"de\":\"CKöln City Church\", \"en\":\"CAolone City Church\"}',
        '{\"de\":\"Lorem ipsum sit doloret. Hier werden dann ganz viele interessante Informationen über die Köln City Church stehen. Außerdem wird der Gottesdienst- Rhythmus in den wechselnden Locations erklärt.\", \"en\":\"Colone City Church description\"}',
        '[\"CKöln City Church Headquarter\\nWaltherstraße 51\\nLESKAN Park, Halle 10\\n51069 Köln, Dellbrück\", \"Köln City Church \\n Campus Innenstadt (Cinedom)\\n Im Mediapark 1\\n50670 Köln\",\"Köln City Church \\nSenats Hotel \\nUnter Goldschmied 9-17 \\n50667 Köln \\nEingang über Laurenzplatz\"]',
        '[\"https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]');
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
       (12, 2);
/*!40000 ALTER TABLE `churchEvent`
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
    `id`           int(11)      NOT NULL AUTO_INCREMENT,
    `createdAt`    datetime     NOT NULL,
    `updatedAt`    datetime     NOT NULL,
    `version`      int(11)      NOT NULL,
    `deleted`      tinyint(4)   NOT NULL,
    `startTime`    datetime     NOT NULL,
    `endTime`      datetime     NOT NULL,
    `names`        mediumtext   NOT NULL,
    `descriptions` mediumtext   NOT NULL,
    `places`       mediumtext   NOT NULL,
    `images`       mediumtext   NOT NULL,
    `type`         varchar(255) NOT NULL DEFAULT 'gottesdienst',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 19
  DEFAULT CHARSET = latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event`
    DISABLE KEYS */;
INSERT INTO `event`
VALUES (2, '2019-04-05 00:00:00', '2020-05-05 00:00:00', 1, 0, '2019-03-25 12:45:00', '2019-03-25 12:45:00',
        '{\"de\":\"Termin 1\"}',
        '{\"de\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\"}',
        '[\"Köln City Church Headquarter\\nWaltherstraße 51\\nLESKAN Park, Halle 10\\n51069 Köln, Dellbrück\"]',
        '[\"https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]', 'gottesdienst'),
       (4, '2019-04-05 00:00:00', '2020-05-05 00:00:00', 1, 0, '2019-04-06 10:00:00', '2019-04-06 12:00:00',
        '{\"de\":\"Termin 3\"}',
        '{\"de\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\"}',
        '[\"place 1\"]', '[\"https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]',
        'gottesdienst'),
       (5, '2019-04-05 00:00:00', '2019-06-29 21:43:39', 3, 0, '2019-04-29 15:00:00', '2019-05-02 10:00:00',
        '{\"de\":\"Termin 4\",\"en\":\"Event 4\"}',
        '{\"de\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\",\"en\":\"English dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\"}',
        '{\"place 1\":\"place 1\"}',
        '[\"https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]', 'gottesdienst'),
       (6, '2019-04-05 00:00:00', '2019-06-29 21:42:37', 3, 0, '2019-05-29 10:00:00', '2019-05-29 10:00:00',
        '{\"de\":\"Termin 5\",\"en\":\"Event 5\"}',
        '{\"de\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\",\"en\":\"English ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\"}',
        '{\"place 1\":\"place 1\"}',
        '[\"https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]', 'gottesdienst'),
       (7, '2019-04-05 00:00:00', '2020-05-05 00:00:00', 1, 0, '2019-05-29 10:00:00', '2019-05-29 10:00:00',
        '{\"de\":\"Termin 5.1\"}',
        '{\"de\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\"}',
        '[\"place 1\"]', '[\"https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]',
        'gottesdienst'),
       (8, '2019-04-05 00:00:00', '2020-05-05 00:00:00', 1, 0, '2019-05-29 10:00:00', '2019-05-29 10:00:00',
        '{\"de\":\"Termin 5.2\"}',
        '{\"de\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\"}',
        '[\"place 1\"]', '[\"https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]',
        'gottesdienst'),
       (9, '2019-04-05 00:00:00', '2020-05-05 00:00:00', 1, 0, '2019-05-29 10:00:00', '2019-05-29 10:00:00',
        '{\"de\":\"Termin 5.3\"}',
        '{\"de\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\"}',
        '[\"place 1\"]', '[\"https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]',
        'gottesdienst'),
       (10, '2019-04-05 00:00:00', '2020-05-05 00:00:00', 1, 0, '2019-05-29 10:00:00', '2019-05-29 10:00:00',
        '{\"de\":\"Termin 5.4\"}',
        '{\"de\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\"}',
        '[\"place 1\"]', '[\"https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]',
        'gottesdienst'),
       (11, '2019-04-05 00:00:00', '2020-05-05 00:00:00', 1, 0, '2019-06-29 10:00:00', '2019-06-29 12:00:00',
        '{\"de\":\"Termin later\"}',
        '{\"de\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\"}',
        '[\"place 1\"]', '[\"https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]',
        'konzert'),
       (12, '2019-04-05 00:00:00', '2020-05-05 00:00:00', 1, 0, '2019-06-29 10:00:00', '2019-06-29 12:00:00',
        '{\"de\":\"Termin later 2\"}',
        '{\"de\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\"}',
        '[\"place 1\"]', '[\"https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]',
        'hauskreis');
/*!40000 ALTER TABLE `event`
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
       (1, 12);
/*!40000 ALTER TABLE `eventRegion`
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

-- Dump completed on 2019-06-29 21:47:16