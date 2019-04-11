DROP TABLE IF EXISTS churchRegion;
DROP TABLE IF EXISTS church;
DROP TABLE IF EXISTS event;
DROP TABLE IF EXISTS region;

CREATE TABLE `church`
(
    `id`           int(11)      NOT NULL AUTO_INCREMENT,
    `createdAt`    datetime     NOT NULL,
    `updatedAt`    datetime     NOT NULL,
    `version`      int(11)      NOT NULL,
    `deleted`      tinyint(4)   NOT NULL,
    `website`      varchar(255) NOT NULL,
    `names`        text         NOT NULL,
    `descriptions` text         NOT NULL,
    `places`       text         NOT NULL,
    `images`       mediumtext   NOT NULL,
    PRIMARY KEY (`id`)
);
CREATE TABLE `event`
(
    `id`          int(11)      NOT NULL AUTO_INCREMENT,
    `createdAt`   datetime     NOT NULL,
    `updatedAt`   datetime     NOT NULL,
    `version`     int(11)      NOT NULL,
    `deleted`     tinyint(1)   NOT NULL,
    `name`        varchar(255) NOT NULL,
    `startTime`   datetime     NOT NULL,
    `endTime`     datetime     NOT NULL,
    `placesJson`  varchar(255) NOT NULL,
    `organiser`   varchar(255) NOT NULL,
    `description` varchar(255) NOT NULL,
    `deletedAt`   datetime DEFAULT NULL,
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

DELIMITER $$
insert into `church` (id, createdAt, descriptions, website, places, deleted, version, names, updatedAt, images)
VALUES (1, '2019-04-09 19:41:00',
        '{\"de\":\"Köln City Church Beschreibung\", \"en\":\"Colone City Church description\"}', 'city-church.;koeln',
        '[\"Cindeome Köln\", \"Senatshalle Köln\"]', 0, 1,
        '{\"de\":\"Köln City Church\", \"en\":\"Colone City Church\"}', '2019-04-09 19:41:00',
        '[\"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA8ADwAAD/4QNURXhpZgAATU0AKgAAAAgACQEPAAIAAAAFAAAAegEQAAIAAAAJAAAAgAESAAMAAAABAAEAAAEaAAUAAAABAAAAigEbAAUAAAABAAAAkgEoAAMAAAABAAIAAAExAAIAAAAwAAAAmgEyAAIAAAAUAAAAyodpAAQAAAABAAAA3gAAAABTT05ZAABJTENFLTdNMgAAAAAA8AAAAAEAAADwAAAAAUFkb2JlIFBob3Rvc2hvcCBMaWdodHJvb20gQ2xhc3NpYyA3LjIgKFdpbmRvd3MpADIwMTg6MDQ6MDIgMDk6NDc6MDYAACWCmgAFAAAAAQAAAqCCnQAFAAAAAQAAAqiIIgADAAAAAQABAACIJwADAAAAARkAAACIMAADAAAAAQACAACIMgAEAAAAAQAAGQCQAAAHAAAABDAyMzCQAwACAAAAFAAAArCQBAACAAAAFAAAAsSSAQAKAAAAAQAAAtiSAgAFAAAAAQAAAuCSAwAKAAAAAQAAAuiSBAAKAAAAAQAAAvCSBQAFAAAAAQAAAviSBwADAAAAAQAFAACSCAADAAAAAQAAAACSCQADAAAAAQAQAACSCgAFAAAAAQAAAwCgAQADAAAAAQABAACgAgAEAAAAAQAABdygAwAEAAAAAQAAA/U0mJikHgHGO1AHGQOcUn8KfU/zFTDoPoakgj24GPYnmmgnq2Dn1qd/vN/u1VP3R/n1oBjxg5z/OnBVz1Gfeox/T/Glf+H6D+lAkPAydw4J5pMAd+R2p4/x/mKib/Wfj/WkwYuNuCABjv9elIeB7j9KdL0H+6P5Uj/ef60iRc5++elJj2xmmt0qT+BfrQMYBnn15pcZHGcDtSR9R/un+tPT7tNAMyCM/hS4XupP0qPsf94VYT7gpAj//2Q==\"]');
END $$
DELIMITER ;