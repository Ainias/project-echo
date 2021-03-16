const find = require("../../lib/PromiseSelector");
const $ = find.one;
const $$ = find.multiple;
const functions = require("../../lib/functions");
const path = require("path");

describe("edit event", () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000;

    let baseUrl = null;
    beforeAll(async () => {
        if (browser.config.baseUrl.trim() !== "") {
            baseUrl = browser.config.baseUrl;
        } else {
            baseUrl = await browser.getUrl();
        }

        browser.setTimeout({
            implicit: 5000
        });
    });

    beforeEach(async function () {
        await browser.setWindowSize(1600, 900);

        await functions.setCurrentDate();
        await functions.login("echo@silas.link", "123456");
        await functions.setCurrentDate();
        await browser.pause(1000);

        await browser.waitUntil(async () => {
            let element = $("#main-content");
            return await element.isDisplayed()
        });
    });

    afterEach(async function () {
        await functions.logout();
    });

    it("new event", async function () {
        let imagePath = path.join(__dirname, "../../misc/img/church.jpeg");

        await $("span=Neuer Termin").click();

        let editors = $$(".ck.ck-content");

        await editors.get(0).setValue(" Meine Beschreibung");
        await editors.get(1).setValue(" Meine Beschreibung");

        await functions.setFormValues({
            "name-de": "Neues Event",
            "name-en": "New Event",
            "image": imagePath,
            "place-name-1": "Köln",
            "church-1": "1",
            "church-4": "4",
            "type": "konzert",
            // "start": "2020-04-09 12:00",
            // "end": "2020-04-09 14:30",
        });

        // await browser.debug();

        await $("input[name=start]").click();
        await functions.pause(200);
        await $$(".flatpickr-day=16").get(0).click();
        await $(".flatpickr-hour").setValue(11);
        await $(".flatpickr-minute").setValue(10);


        await functions.pause(2000);
        await $("input[name=end]").click();
        // await browser.debug();
        await functions.pause(200);
        await $$(".flatpickr-day=16").get(1).click();
        // await browser.debug();
        await $$(".flatpickr-hour").get(1).setValue(13);
        await $$(".flatpickr-minute").get(1).setValue(59);

        // await browser.debug();

        await $("#add-place").click();
        await $("#add-place").click();

        await functions.setFormValues({
            "place-name-2": "Aachen",
            "place-name-3": "Remscheid City",
        });

        await $("button.button=Speichern").click();

        expect(await $("h1#name=Neues Event").isDisplayed()).toBeTruthy();

        let data = await functions.queryDatabase("SELECT * FROM event WHERE names LIKE '%Neues Event%New Event%' LIMIT 1");
        data = data[0];

        expect(data["names"]).toEqual("{\"de\":\"Neues Event\",\"en\":\"New Event\"}");
        expect(data["type"]).toEqual("konzert");
        expect(data["startTime"].getTime()).toEqual(new Date(2019, 5, 16, 11, 10).getTime());
        expect(data["endTime"].getTime()).toEqual(new Date(2019, 5, 16, 13, 59).getTime());
        expect(data["descriptions"]).toEqual("{\"de\":\"<p>Meine Beschreibung</p>\",\"en\":\"<p>Meine Beschreibung</p>\"}");
        expect(data["places"]).toEqual("{\"Köln\":\"Köln\",\"Aachen\":\"Aachen\",\"Remscheid City\":\"Remscheid City\"}");
        expect(data["isTemplate"]).toEqual(0);
        expect(data["repeatedEventId"]).toEqual(null);

        let id = data["id"];

        data = await functions.queryDatabase("SELECT * FROM churchEvent WHERE eventId = " + id + " ORDER BY churchId");
        expect(data.length).toEqual(2);
        expect(data[0]["churchId"]).toEqual(1);
        expect(data[1]["churchId"]).toEqual(4);

        data = await functions.queryDatabase("SELECT * FROM eventRegion WHERE eventId = " + id);
        data = data[0];
        expect(data["regionId"]).toEqual(1);

        data = await functions.queryDatabase("SELECT * FROM eventImages INNER JOIN file_medium ON fileMediumId = file_medium.id WHERE eventId = " + id);
        expect(data.length).toEqual(1);

        data = data[0];
        let savedImagePath = path.join(__dirname, "../../../src/server/uploads/img_" + data["src"]);
        await functions.compareFiles(imagePath, savedImagePath);

        await $(".footer .icon.home").click();
    });

    it("new repeated event", async function () {
        let imagePath = path.join(__dirname, "../../misc/img/church.jpeg");

        await $("span=Neuer Termin").click();

        let editors = $$(".ck.ck-content");

        await editors.get(0).setValue(" Meine Beschreibung");
        await editors.get(1).setValue(" Meine Beschreibung");

        await functions.setFormValues({
            "name-de": "Neues wiederholendes Event",
            "name-en": "New repeating Event",
            "image": imagePath,
            "place-name-1": "Aachen",
            "church-2": "2",
            "church-5": "5",
            "type": "sport",
        });

        await $("input[name=start]").click();
        await functions.pause(200);
        await $$(".flatpickr-day=16").get(0).click();
        await $(".flatpickr-hour").setValue(11);
        await $(".flatpickr-minute").setValue(10);

        await $("input[name=end]").click();
        await functions.pause(200);
        await $$(".flatpickr-day=16").get(1).click();
        await $$(".flatpickr-hour").get(1).setValue(13);
        await $$(".flatpickr-minute").get(1).setValue(59);

        await $("#add-place").click();
        await $("#add-place").click();

        await functions.setFormValues({
            "place-name-2": "Aachen",
            "place-name-3": "Remscheid City",
        });

        await $("#repeatable-checkbox").click();

        await functions.setFormValues({
            "repeat-2": "2",
            "repeat-3": "3",
            "repeat-6": "6",
        });

        await $("input[name=repeat-until]").click();
        await functions.pause(500);
        await $$(".flatpickr-day=25").get(2).click();
        // await functions.pause(5000);
        await $$(".flatpickr-hour").get(2).setValue(23);
        await $$(".flatpickr-minute").get(2).setValue(58);

        await $("button.button=Speichern").click();

        expect(await $("#event-name=Neues wiederholendes Event").isDisplayed()).toBeTruthy();

        let data = await functions.queryDatabase("SELECT * FROM event WHERE names LIKE '%Neues wiederholendes Event%New repeating Event%' LIMIT 1");
        data = data[0];

        expect(data["names"]).toEqual("{\"de\":\"Neues wiederholendes Event\",\"en\":\"New repeating Event\"}");
        expect(data["type"]).toEqual("sport");
        expect(data["startTime"].getTime()).toEqual(new Date(2019, 5, 16, 11, 10).getTime());
        expect(data["endTime"].getTime()).toEqual(new Date(2019, 5, 16, 13, 59).getTime());
        expect(data["descriptions"]).toEqual("{\"de\":\"<p>Meine Beschreibung</p>\",\"en\":\"<p>Meine Beschreibung</p>\"}");
        expect(data["places"]).toEqual("{\"Aachen\":\"Aachen\",\"Remscheid City\":\"Remscheid City\"}");
        expect(data["isTemplate"]).toEqual(1);
        let repeatedEventId = data["repeatedEventId"];

        let id = data["id"];

        data = await functions.queryDatabase("SELECT * FROM churchEvent WHERE eventId = " + id + " ORDER BY churchId");
        expect(data.length).toEqual(2);
        expect(data[0]["churchId"]).toEqual(2);
        expect(data[1]["churchId"]).toEqual(5);

        data = await functions.queryDatabase("SELECT * FROM eventRegion WHERE eventId = " + id);
        data = data[0];
        expect(data["regionId"]).toEqual(1);

        data = await functions.queryDatabase("SELECT * FROM eventImages INNER JOIN file_medium ON fileMediumId = file_medium.id WHERE eventId = " + id);
        expect(data.length).toEqual(1);

        data = data[0];
        let savedImagePath = path.join(__dirname, "../../../src/server/uploads/img_" + data["src"]);
        await functions.compareFiles(imagePath, savedImagePath);

        data = await functions.queryDatabase("SELECT * FROM repeated_event WHERE id = " + repeatedEventId);
        expect(data.length).toEqual(1);
        data = data[0];

        expect(data["repeatingStrategy"]).toEqual(0);
        expect(data["repeatUntil"].getTime()).toEqual(new Date(2019, 5, 25, 23, 58).getTime());
        expect(data["repeatingArguments"]).toEqual("2,3,6");

        await $(".footer .icon.home").click();
    });

    it("edit normal event", async function () {
        let imagePath = path.join(__dirname, "../../misc/img/church.jpeg");

        await $(".footer .icon.calendar").click();
        await $(".day-number=5").click();
        await $("div.name=Termin zum bearbeiten").click();

        expect(await $(".admin-panel").isDisplayed()).toBeTruthy();

        await $("#modify-event").click();

        let editors = $$(".ck.ck-content");

        await functions.verifyFormValues({
            "name-de": "Termin zum bearbeiten",
            "name-en": "",
            "description-de": "My Description",
            "description-en": "",
            "image-before": "https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg",
            "place-name-1": "place 1",
            "church-1": "1",
            "church-2": "2",
        });

        await editors.get(0).setValue(" Meine bearbeitete Beschreibung");
        await editors.get(1).setValue(" Meine english Beschreibung");

        await functions.setFormValues({
            "name-de": "Bearbeiteter Termin",
            "name-en": "Edited Event",
            "image": imagePath,
            "place-name-1": "bearbeitet",
            "type": "konzert"
        });

        await $("[name=church-1]").click();
        await $("[name=church-3]").click();

        await $("input[name=start]").click();
        await functions.pause(200);
        await $$(".flatpickr-day=18").get(0).click();
        await $(".flatpickr-hour").setValue(11);
        await $(".flatpickr-minute").setValue(10);

        await $("input[name=end]").click();
        await functions.pause(200);
        await $$(".flatpickr-day=18").get(1).click();
        await $$(".flatpickr-hour").get(1).setValue(13);
        await $$(".flatpickr-minute").get(1).setValue(59);

        await $("button.button=Speichern").click();

        expect(await $("#event-name=Bearbeiteter Termin").isDisplayed()).toBeTruthy();

        let data = await functions.queryDatabase("SELECT * FROM event WHERE names LIKE '%Bearbeiteter Termin%Edited Event%' LIMIT 1");

        data = data[0];

        expect(data["names"]).toEqual("{\"de\":\"Bearbeiteter Termin\",\"en\":\"Edited Event\"}");
        expect(data["descriptions"]).toEqual("{\"de\":\"<p>Meine bearbeitete BeschreibungMy Description</p>\",\"en\":\"<p>Meine english Beschreibung</p>\"}");
        expect(data["places"]).toEqual("{\"bearbeitet\":\"bearbeitet\"}");
        expect(data["type"]).toEqual("konzert");
        expect(data["startTime"].getTime()).toEqual(new Date(2019, 5, 18, 11, 10).getTime());
        expect(data["endTime"].getTime()).toEqual(new Date(2019, 5, 18, 13, 59).getTime());
        expect(data["isTemplate"]).toEqual(0);

        let id = data["id"];

        data = await functions.queryDatabase("SELECT * FROM churchEvent WHERE eventId = " + id + " ORDER BY churchId");
        expect(data.length).toEqual(2);
        expect(data[0]["churchId"]).toEqual(2);
        expect(data[1]["churchId"]).toEqual(3);

        data = await functions.queryDatabase("SELECT * FROM eventRegion WHERE eventId = " + id);
        data = data[0];
        expect(data["regionId"]).toEqual(1);

        data = await functions.queryDatabase("SELECT * FROM eventImages INNER JOIN file_medium ON fileMediumId = file_medium.id WHERE eventId = " + id);
        expect(data.length).toEqual(1);

        data = data[0];
        let savedImagePath = path.join(__dirname, "../../../src/server/uploads/img_" + data["src"]);
        await functions.compareFiles(imagePath, savedImagePath);
    });

    it("edit repeating event", async function () {
        let imagePath = path.join(__dirname, "../../misc/img/church.jpeg");

        await $(".footer .icon.calendar").click();
        await $(".day-number=10").click();
        await $(".name=Termin zum bearbeiten wiederholend").click();

        expect(await $(".admin-panel").isDisplayed()).toBeTruthy();

        await $("#modify-event").click();
        await $("button.button=Serie").click();
        // await browser.pause(5000);

        let editors = $$(".ck.ck-content");

        await functions.verifyFormValues({
            "name-de": "Termin zum bearbeiten wiederholend",
            "name-en": "",
            "description-de": "My Description",
            "description-en": "",
            "image-before": "https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg",
            "place-name-1": "place 1",
            "church-1": "1",
            "church-2": "2",
        });

        await editors.get(0).setValue(" Meine bearbeitete Beschreibung wiederholend");
        await editors.get(1).setValue(" Meine english Beschreibung wiederholend");

        await functions.setFormValues({
            "name-de": "Bearbeiteter Termin wiederholend",
            "name-en": "Edited Event wiederholend",
            "image": imagePath,
            "place-name-1": "bearbeitet wiederholend",
            "type": "konferenz"
        });

        await $("[name=church-1]").click();
        await $("[name=church-9]").click();

        await $("input[name=start]").click();
        await functions.pause(200);
        await $$(".flatpickr-day=19").get(0).click();
        await $(".flatpickr-hour").setValue(11);
        await $(".flatpickr-minute").setValue(10);

        await $("input[name=end]").click();
        await functions.pause(200);
        await $$(".flatpickr-day=19").get(1).click();
        await $$(".flatpickr-hour").get(1).setValue(13);
        await $$(".flatpickr-minute").get(1).setValue(59);

        await $("button.button=Speichern").click();
        expect(await $("#event-name=Bearbeiteter Termin wiederholend").isDisplayed()).toBeTruthy();

        let data = await functions.queryDatabase("SELECT * FROM event WHERE names LIKE '%Bearbeiteter Termin wiederholend%Edited Event wiederholend%' LIMIT 1");

        data = data[0];

        expect(data["names"]).toEqual("{\"de\":\"Bearbeiteter Termin wiederholend\",\"en\":\"Edited Event wiederholend\"}");
        expect(data["descriptions"]).toEqual("{\"de\":\"<p>Meine bearbeitete Beschreibung wiederholendMy Description</p>\",\"en\":\"<p>Meine english Beschreibung wiederholend</p>\"}");
        expect(data["places"]).toEqual("{\"bearbeitet wiederholend\":\"bearbeitet wiederholend\"}");
        expect(data["type"]).toEqual("konferenz");
        expect(data["startTime"].getTime()).toEqual(new Date(2019, 5, 19, 11, 10).getTime());
        expect(data["endTime"].getTime()).toEqual(new Date(2019, 5, 19, 13, 59).getTime());
        expect(data["isTemplate"]).toEqual(1);

        let id = data["id"];
        let repeatedEventId = data["repeatedEventId"];

        data = await functions.queryDatabase("SELECT * FROM churchEvent WHERE eventId = " + id + " ORDER BY churchId");
        expect(data.length).toEqual(2);
        expect(data[0]["churchId"]).toEqual(2);
        expect(data[1]["churchId"]).toEqual(9);

        data = await functions.queryDatabase("SELECT * FROM eventRegion WHERE eventId = " + id);
        data = data[0];
        expect(data["regionId"]).toEqual(1);

        data = await functions.queryDatabase("SELECT * FROM eventImages INNER JOIN file_medium ON fileMediumId = file_medium.id WHERE eventId = " + id);
        expect(data.length).toEqual(1);

        data = data[0];
        let savedImagePath = path.join(__dirname, "../../../src/server/uploads/img_" + data["src"]);
        await functions.compareFiles(imagePath, savedImagePath);

        data = await functions.queryDatabase("SELECT * FROM repeated_event WHERE id = " + repeatedEventId);
        expect(data.length).toEqual(1);
        data = data[0];

        expect(data["repeatingStrategy"]).toEqual(0);
        expect(data["repeatUntil"]).toEqual(null);
        expect(data["repeatingArguments"]).toEqual("1,5");

        await $(".footer .icon.home").click();
    });

    it("edit repeating single event", async function () {
        let imagePath = path.join(__dirname, "../../misc/img/church.jpeg");

        await $(".footer .icon.calendar").click();
        await $(".day-number=19").click();
        await $(".name=Termin zum bearbeiten single wiederholend").click();

        expect(await $(".admin-panel").isDisplayed()).toBeTruthy();

        await $("#modify-event").click();
        await $("button.button=Veranstaltung").click();
        // await browser.pause(5000);

        let editors = $$(".ck.ck-content");

        await functions.verifyFormValues({
            "name-de": "Termin zum bearbeiten single wiederholend",
            "name-en": "",
            "description-de": "My Description",
            "description-en": "",
            "image-before": "https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg",
            "place-name-1": "place 1",
            "church-1": "1",
            "church-2": "2",
        });

        await editors.get(0).setValue(" Meine bearbeitete Beschreibung wiederholend");
        await editors.get(1).setValue(" Meine english Beschreibung wiederholend");

        await functions.setFormValues({
            "name-de": "Bearbeiteter Termin wiederholend single",
            "name-en": "Edited Event wiederholend",
            "image": imagePath,
            "place-name-1": "bearbeitet wiederholend",
            "type": "konferenz"
        });

        await $("[name=church-5]").click();
        await $("[name=church-9]").click();
        await $("[name=church-7]").click();

        await $("input[name=start]").click();
        await functions.pause(200);
        await $$(".flatpickr-day=19").get(0).click();
        await $(".flatpickr-hour").setValue(11);
        await $(".flatpickr-minute").setValue(10);

        await $("input[name=end]").click();
        await functions.pause(200);
        await $$(".flatpickr-day=19").get(1).click();
        await $$(".flatpickr-hour").get(1).setValue(13);
        await $$(".flatpickr-minute").get(1).setValue(59);

        await $("button.button=Speichern").click();

        await functions.pause(250);
        expect(await $("#name=Bearbeiteter Termin wiederholend single").isDisplayed()).toBeTruthy();

        let data = await functions.queryDatabase("SELECT * FROM event WHERE names LIKE '%Bearbeiteter Termin wiederholend single%Edited Event wiederholend%' LIMIT 1");

        data = data[0];

        expect(data["names"]).toEqual("{\"de\":\"Bearbeiteter Termin wiederholend single\",\"en\":\"Edited Event wiederholend\"}");
        expect(data["descriptions"]).toEqual("{\"de\":\"<p>Meine bearbeitete Beschreibung wiederholendMy Description</p>\",\"en\":\"<p>Meine english Beschreibung wiederholend</p>\"}");
        expect(data["places"]).toEqual("{\"bearbeitet wiederholend\":\"bearbeitet wiederholend\"}");
        expect(data["type"]).toEqual("konferenz");
        expect(data["startTime"].getTime()).toEqual(new Date(2019, 5, 19, 11, 10).getTime());
        expect(data["endTime"].getTime()).toEqual(new Date(2019, 5, 19, 13, 59).getTime());
        expect(data["isTemplate"]).toEqual(0);

        let id = data["id"];
        let repeatedEventId = data["repeatedEventId"];

        data = await functions.queryDatabase("SELECT * FROM churchEvent WHERE eventId = " + id + " ORDER BY churchId");
        expect(data.length).toEqual(2);
        expect(data[0]["churchId"]).toEqual(7);
        expect(data[1]["churchId"]).toEqual(9);

        data = await functions.queryDatabase("SELECT * FROM eventRegion WHERE eventId = " + id);
        data = data[0];
        expect(data["regionId"]).toEqual(1);

        data = await functions.queryDatabase("SELECT * FROM eventImages INNER JOIN file_medium ON fileMediumId = file_medium.id WHERE eventId = " + id);
        expect(data.length).toEqual(1);

        data = data[0];
        let savedImagePath = path.join(__dirname, "../../../src/server/uploads/img_" + data["src"]);
        await functions.compareFiles(imagePath, savedImagePath);

        data = await functions.queryDatabase("SELECT * FROM repeated_event WHERE id = " + repeatedEventId);
        expect(data.length).toEqual(1);
        data = data[0];

        expect(data["repeatingStrategy"]).toEqual(0);
        expect(data["repeatUntil"]).toEqual(null);
        expect(data["repeatingArguments"]).toEqual("3");

        await $(".footer .icon.home").click();
    });

    it("delete normal event", async function () {
        await $(".footer .icon.calendar").click();
        await $(".day-number=11").click();
        await $(".name=Termin zum löschen").click();

        expect(await $(".admin-panel").isDisplayed()).toBeTruthy();

        await $("#delete-event").click();
        await $(".button=OK").click();

        await functions.pause(1000);

        let data = await functions.queryDatabase("SELECT * FROM event WHERE names LIKE '%Termin zum löschen%' LIMIT 1");
        data = data[0];
        expect(data["deleted"]).toEqual(1);
    });

    it("delete repeated event", async function () {
        await $(".footer .icon.calendar").click();
        await $(".day-number=15").click();
        await $(".name=Termin zum löschen wiederholend").click();

        expect(await $(".admin-panel").isDisplayed()).toBeTruthy();

        await $("#delete-event").click();
        await $(".button=Serie").click();

        await functions.pause(1000);

        let data = await functions.queryDatabase("SELECT * FROM event WHERE names LIKE '%Termin zum löschen wiederholend%' LIMIT 1");
        data = data[0];
        expect(data["deleted"]).toEqual(1);
    });

    it("delete repeated single event", async function () {
        await $(".footer .icon.calendar").click();
        await $(".day-number=26").click();
        await $(".name=Termin zum bearbeiten single wiederholend").click();

        expect(await $(".admin-panel").isDisplayed()).toBeTruthy();

        await $("#delete-event").click();
        await $(".button=Veranstaltung").click();

        await functions.pause(1000);

        let data = await functions.queryDatabase("SELECT * FROM event WHERE names LIKE '%Termin zum bearbeiten single wiederholend%' LIMIT 1");
        data = data[0];
        let repeatedEventId = data["repeatedEventId"];

        data = await functions.queryDatabase("SELECT * FROM blocked_day WHERE repeatedEventId = "+ repeatedEventId + " AND eventId IS NULL");
        expect(data.length).toEqual(1);
        data = data[0];
        expect(data["day"].getTime()).toEqual(new Date(2019, 5, 26, 12).getTime());
        expect(data["eventId"]).toBeNull();
    });
});
