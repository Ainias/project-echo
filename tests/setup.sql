DROP TABLE IF EXISTS churchRegion;
DROP TABLE IF EXISTS eventRegion;
DROP TABLE IF EXISTS churchEvent;
DROP TABLE IF EXISTS event;
DROP TABLE IF EXISTS church;
DROP TABLE IF EXISTS region;
DROP TABLE IF EXISTS user_access;
DROP TABLE IF EXISTS roleAccess;
DROP TABLE IF EXISTS roleChildren;
DROP TABLE IF EXISTS userRole;
DROP TABLE IF EXISTS access;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS variable;

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
);

CREATE TABLE `event`
(
    `id`           int(11)      NOT NULL AUTO_INCREMENT,
    `createdAt`    datetime     NOT NULL,
    `updatedAt`    datetime     NOT NULL,
    `version`      int(11)      NOT NULL,
    `deleted`      tinyint(1)   NOT NULL,
    `startTime`    datetime     NOT NULL,
    `endTime`      datetime     NOT NULL,
    `names`        mediumtext   NOT NULL,
    `descriptions` mediumtext   NOT NULL,
    `places`       mediumtext   NOT NULL,
    `images`       mediumtext   NOT NULL,
    `type`         varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `region`
(
    `id`        int(11)      NOT NULL AUTO_INCREMENT,
    `createdAt` datetime     NOT NULL,
    `updatedAt` datetime     NOT NULL,
    `version`   int(11)      NOT NULL,
    `deleted`   tinyint(4)   NOT NULL,
    `name`      varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `churchRegion`
(
    `regionId` int(11) NOT NULL,
    `churchId` int(11) NOT NULL,
    PRIMARY KEY (`regionId`, `churchId`),
    KEY `IDX_0ad36b5609be54c388f80473bb` (`regionId`),
    KEY `IDX_9bef852c1c99ceba4c5bb3fc60` (`churchId`),
    CONSTRAINT `FK_0ad36b5609be54c388f80473bb5` FOREIGN KEY (`regionId`) REFERENCES `region` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT `FK_9bef852c1c99ceba4c5bb3fc609` FOREIGN KEY (`churchId`) REFERENCES `church` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE `eventRegion`
(
    `regionId` int(11) NOT NULL,
    `eventId`  int(11) NOT NULL,
    PRIMARY KEY (`regionId`, `eventId`),
    KEY `IDX_335ad984dab74830e8f996a595` (`regionId`),
    KEY `IDX_84862bb193c7f23798d7f07920` (`eventId`),
    CONSTRAINT `FK_335ad984dab74830e8f996a595e` FOREIGN KEY (`regionId`) REFERENCES `region` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT `FK_84862bb193c7f23798d7f079202` FOREIGN KEY (`eventId`) REFERENCES `event` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE `churchEvent`
(
    `eventId`  int(11) NOT NULL,
    `churchId` int(11) NOT NULL,
    PRIMARY KEY (`eventId`, `churchId`),
    KEY `IDX_f4b1a473c177d39e9b3adb72bb` (`eventId`),
    KEY `IDX_fc7c57d431d8815a4b511894f2` (`churchId`),
    CONSTRAINT `FK_f4b1a473c177d39e9b3adb72bb8` FOREIGN KEY (`eventId`) REFERENCES `event` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT `FK_fc7c57d431d8815a4b511894f21` FOREIGN KEY (`churchId`) REFERENCES `church` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
);

insert into `church` (id, createdAt, descriptions, website, places, deleted, version, names, updatedAt, images)
VALUES (1, '2020-04-09 19:41:00',
        '{\"de\":\"Lorem ipsum sit doloret. \\nHier werden dann ganz viele interessante Informationen über die Köln City Church stehen. Außerdem wird der Gottesdienst- Rhythmus in den wechselnden Locations erklärt.\", \"en\":\"Colone City Church description\"}',
        'www.citychurch.koeln',
        '[\"Köln City Church Headquarter\\nWaltherstraße 51\\nLESKAN Park, Halle 10\\n51069 Köln, Dellbrück\", \"Köln City Church \\n Campus Innenstadt (Cinedom)\\n Im Mediapark 1\\n50670 Köln\",\"Köln City Church \\nSenats Hotel \\nUnter Goldschmied 9-17 \\n50667 Köln \\nEingang über Laurenzplatz\"]',
        0, 1,
        '{\"de\":\"Köln City Church\", \"en\":\"Colone City Church\"}', '2020-04-09 19:41:00',
        '["https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]'),
       (2, '2020-04-09 19:41:00',
        '{\"de\":\"ABC City Church Beschreibung\", \"en\":\"Colone City Church description\"}', 'city-church.koeln',
        '[\"Cinedom Köln\"]', 0, 1,
        '{\"de\":\"A City Church\", \"en\":\"Colone City Church\"}', '2020-04-09 19:41:00',
        '["https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]'),
       (3, '2020-04-09 19:41:00',
        '{\"de\":\"B City Church Beschreibung\", \"en\":\"Colone City Church description\"}', 'city-church.koeln',
        '[\"Cinedom Köln\", \"Senatshalle Köln\"]', 0, 1,
        '{\"de\":\"B City Church\", \"en\":\"Colone City Church\"}', '2020-04-09 19:41:00',
        '["https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]'),
       (4, '2020-04-09 19:41:00',
        '{\"de\":\"Köln City Church Beschreibung\", \"en\":\"Colone City Church description\"}', 'city-church.koeln',
        '[\"Cinedom Köln\", \"Senatshalle Köln\"]', 0, 1,
        '{\"de\":\"D City Church\", \"en\":\"Colone City Church\"}', '2020-04-09 19:41:00',
        '["https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]'),
       (5, '2020-04-09 19:41:00',
        '{\"de\":\"Köln City Church Beschreibung\", \"en\":\"Colone City Church description\"}', 'city-church.koeln',
        '[\"Cinedom Köln\", \"Senatshalle Köln\"]', 0, 1,
        '{\"de\":\"E City Church\", \"en\":\"Colone City Church\"}', '2020-04-09 19:41:00',
        '["https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]'),
       (6, '2020-04-09 19:41:00',
        '{\"de\":\"Köln City Church Beschreibung\", \"en\":\"Colone City Church description\"}', 'city-church.koeln',
        '[\"Cinedom Köln\", \"Senatshalle Köln\"]', 0, 1,
        '{\"de\":\"D City Church\", \"en\":\"Colone City Church\"}', '2020-04-09 19:41:00',
        '["https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]'),
       (7, '2020-04-09 19:41:00',
        '{\"de\":\"Köln City Church Beschreibung\", \"en\":\"Colone City Church description\"}', 'city-church.koeln',
        '[\"Cinedom Köln\", \"Senatshalle Köln\"]', 0, 1,
        '{\"de\":\"Z City Church\", \"en\":\"Colone City Church\"}', '2020-04-09 19:41:00',
        '["https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]'),
       (8, '2020-04-09 19:41:00',
        '{\"de\":\"Köln City Church Beschreibung\", \"en\":\"Colone City Church description\"}', 'city-church.koeln',
        '[\"Cinedom Köln\", \"Senatshalle Köln\"]', 0, 1,
        '{\"de\":\"VW City Church\", \"en\":\"Colone City Church\"}', '2020-04-09 19:41:00',
        '["https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]'),
       (9, '2020-04-09 19:41:00',
        '{\"de\":\"Köln City Church Beschreibung\", \"en\":\"Colone City Church description\"}', 'city-church.koeln',
        '[\"Cinedom Köln\", \"Senatshalle Köln\"]', 0, 1,
        '{\"de\":\"V City Church\", \"en\":\"Colone City Church\"}', '2020-04-09 19:41:00',
        '["https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]'),
       (12, '2020-04-09 19:41:00',
        '{\"de\":\"Lorem ipsum sit doloret. \\nHier werden dann ganz viele interessante Informationen über die Köln City Church stehen. Außerdem wird der Gottesdienst- Rhythmus in den wechselnden Locations erklärt.\", \"en\":\"Colone City Church description\"}',
        'www.citychurch.koeln',
        '[\"CKöln City Church Headquarter\\nWaltherstraße 51\\nLESKAN Park, Halle 10\\n51069 Köln, Dellbrück\", \"Köln City Church \\n Campus Innenstadt (Cinedom)\\n Im Mediapark 1\\n50670 Köln\",\"Köln City Church \\nSenats Hotel \\nUnter Goldschmied 9-17 \\n50667 Köln \\nEingang über Laurenzplatz\"]',
        0, 1,
        '{\"de\":\"CKöln City Church\", \"en\":\"CAolone City Church\"}', '2020-04-09 19:41:00',
        '["https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]'),
       (11, '2020-04-09 19:41:00',
        '{\"de\":\"Lorem ipsum sit doloret. \\nHier werden dann ganz viele interessante Informationen über die Köln City Church stehen. Außerdem wird der Gottesdienst- Rhythmus in den wechselnden Locations erklärt.\", \"en\":\"Colone City Church description\"}',
        'www.citychurch.koeln',
        '[\"Köln City Church Headquarter\\nWaltherstraße 51\\nLESKAN Park, Halle 10\\n51069 Köln, Dellbrück\", \"Köln City Church \\n Campus Innenstadt (Cinedom)\\n Im Mediapark 1\\n50670 Köln\",\"Köln City Church \\nSenats Hotel \\nUnter Goldschmied 9-17 \\n50667 Köln \\nEingang über Laurenzplatz\"]',
        0, 1,
        '{\"de\":\"BKöln City Church\", \"en\":\"CBolone City Church\"}', '2020-04-09 19:41:00',
        '["https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]'),
       (10, '2020-04-09 19:41:00',
        '{\"de\":\"Lorem ipsum sit doloret. \\nHier werden dann ganz viele interessante Informationen über die Köln City Church stehen. Außerdem wird der Gottesdienst- Rhythmus in den wechselnden Locations erklärt.\", \"en\":\"Colone City Church description\"}',
        'www.citychurch.koeln',
        '[\"Köln City Church Headquarter\\nWaltherstraße 51\\nLESKAN Park, Halle 10\\n51069 Köln, Dellbrück\", \"Köln City Church \\n Campus Innenstadt (Cinedom)\\n Im Mediapark 1\\n50670 Köln\",\"Köln City Church \\nSenats Hotel \\nUnter Goldschmied 9-17 \\n50667 Köln \\nEingang über Laurenzplatz\"]',
        0, 1,
        '{\"de\":\"AKöln City Church\", \"en\":\"AColone City Church\"}', '2020-04-09 19:41:00',
        '["https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]');



insert into `region`
set name='Köln',
    deleted=0,
    version=1,
    updatedAt='2020-04-04 19:01:59',
    id=1,
    createdAt='2020-02-02 18:00:00';

insert into `region`
set name='Aachen',
    deleted=0,
    version=1,
    updatedAt='2020-04-04 19:01:59',
    id=2,
    createdAt='2020-02-02 18:00:00';

insert into `churchRegion`
set churchId=1,
    regionId=1;
insert into `churchRegion`
set churchId=2,
    regionId=2;
insert into `churchRegion`
set churchId=3,
    regionId=1;
insert into `churchRegion`
set churchId=4,
    regionId=1;
insert into `churchRegion`
set churchId=5,
    regionId=2;
insert into `churchRegion`
set churchId=6,
    regionId=1;
insert into `churchRegion`
set churchId=7,
    regionId=1;
insert into `churchRegion`
set churchId=8,
    regionId=1;
insert into `churchRegion`
set churchId=9,
    regionId=1;
insert into `churchRegion`
set churchId=8,
    regionId=2;
insert into `churchRegion`
set churchId=9,
    regionId=2;
insert into `churchRegion`
set churchId=10,
    regionId=2;
insert into `churchRegion`
set churchId=11,
    regionId=2;
insert into `churchRegion`
set churchId=12,
    regionId=2;

insert into `event`
set names='{\"de\":\"Geburtstagsparty Jonas Meier\"}',
    deleted=0,
    version=1,
    startTime='2019-05-11 19:30',
    endTime='2019-05-11 19:30',
    updatedAt='2020-05-05',
    places='[\"Ludwig-Jahn Straße 15\\n50858 Köln\"]',
    createdAt='2019-04-05',
    type='gottesdienst',
    descriptions='{\"de\":\"Geburtstagsparty von Jonas<br>consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\"}',
    images='["https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg"]';

insert into `event`
set names='{\"de\":\"Termin 1\"}',
    deleted=0,
    version=1,
    startTime='2019-03-25 12:45',
    endTime='2019-03-25 12:45',
    updatedAt='2020-05-05',
    places='[\"Köln City Church Headquarter\\nWaltherstraße 51\\nLESKAN Park, Halle 10\\n51069 Köln, Dellbrück\"]',
    createdAt='2019-04-05',
    type='gottesdienst',
    descriptions='{\"de\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\"}',
    images='["https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]';

insert into `event`
set names='{\"de\":\"Termin 2\"}',
    deleted=0,
    version=1,
    startTime='2019-03-25 18:00',
    endTime='2019-04-02 12:00',
    updatedAt='2020-05-05',
    places='[\"place 1\"]',
    createdAt='2019-04-05',
    type='konzert',
    descriptions='{\"de\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\"}',
    images='["https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]';

insert into `event`
set names='{\"de\":\"Termin 3\"}',
    deleted=0,
    version=1,
    startTime='2019-04-06 10:00',
    endTime='2019-04-06 12:00',
    updatedAt='2020-05-05',
    places='[\"place 1\"]',
    createdAt='2019-04-05',
    type='gottesdienst',
    descriptions='{\"de\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\"}',
    images='["https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]';

insert into `event`
set names='{\"de\":\"Termin 4\"}',
    deleted=0,
    version=1,
    startTime='2019-04-29 10:00',
    endTime='2019-05-06 12:00',
    updatedAt='2020-05-05',
    places='[\"place 1\"]',
    createdAt='2019-04-05',
    type='gottesdienst',
    descriptions='{\"de\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\"}',
    images='["https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]';

insert into `event`
set names='{\"de\":\"Termin 5\"}',
    deleted=0,
    version=1,
    startTime='2019-05-29 10:00',
    endTime='2019-05-29 10:00',
    updatedAt='2020-05-05',
    places='[\"place 1\"]',
    createdAt='2019-04-05',
    type='gottesdienst',
    descriptions='{\"de\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\"}',
    images='["https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]';

insert into `event`
set names='{\"de\":\"Termin 5.1\"}',
    deleted=0,
    version=1,
    startTime='2019-05-29 10:00',
    endTime='2019-05-29 10:00',
    updatedAt='2020-05-05',
    places='[\"place 1\"]',
    createdAt='2019-04-05',
    type='gottesdienst',
    descriptions='{\"de\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\"}',
    images='["https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]';
insert into `event`
set names='{\"de\":\"Termin 5.2\"}',
    deleted=0,
    version=1,
    startTime='2019-05-29 10:00',
    endTime='2019-05-29 10:00',
    updatedAt='2020-05-05',
    places='[\"place 1\"]',
    createdAt='2019-04-05',
    type='gottesdienst',
    descriptions='{\"de\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\"}',
    images='["https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]';

insert into `event`
set names='{\"de\":\"Termin 5.3\"}',
    deleted=0,
    version=1,
    startTime='2019-05-29 10:00',
    endTime='2019-05-29 10:00',
    updatedAt='2020-05-05',
    places='[\"place 1\"]',
    createdAt='2019-04-05',
    type='gottesdienst',
    descriptions='{\"de\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\"}',
    images='["https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]';

insert into `event`
set names='{\"de\":\"Termin 5.4\"}',
    deleted=0,
    version=1,
    startTime='2019-05-29 10:00',
    endTime='2019-05-29 10:00',
    updatedAt='2020-05-05',
    places='[\"place 1\"]',
    createdAt='2019-04-05',
    type='gottesdienst',
    descriptions='{\"de\":\"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\"}',
    images='[\"https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg\"]';
insert into `churchEvent`
set eventId=1,
    churchId=1;
insert into `churchEvent`
set eventId=2,
    churchId=1;
insert into `churchEvent`
set eventId=3,
    churchId=1;
insert into `churchEvent`
set eventId=4,
    churchId=1;
insert into `churchEvent`
set eventId=5,
    churchId=1;
insert into `churchEvent`
set eventId=6,
    churchId=1;
insert into `churchEvent`
set eventId=10,
    churchId=1;
insert into `churchEvent`
set eventId=7,
    churchId=1;
insert into `churchEvent`
set eventId=8,
    churchId=1;
insert into `churchEvent`
set eventId=9,
    churchId=1;

insert into `eventRegion`
set eventId=1,
    regionId=1;
insert into `eventRegion`
set eventId=2,
    regionId=1;
insert into `eventRegion`
set eventId=3,
    regionId=1;
insert into `eventRegion`
set eventId=4,
    regionId=1;
insert into `eventRegion`
set eventId=5,
    regionId=1;
insert into `eventRegion`
set eventId=6,
    regionId=1;
insert into `eventRegion`
set eventId=7,
    regionId=1;
insert into `eventRegion`
set eventId=8,
    regionId=1;
insert into `eventRegion`
set eventId=9,
    regionId=1;
insert into `eventRegion`
set eventId=10,
    regionId=1;