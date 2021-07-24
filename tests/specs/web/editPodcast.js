const find = require("../../lib/PromiseSelector");
const $ = find.one;
const $$ = find.multiple;
const functions = require("../../lib/functions");
const path = require("path");

describe("edit podcast", () => {
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
        await functions.mockMatomo();
    });

    beforeEach(async function () {
        await functions.setCurrentDate();

        await functions.login("echo@silas.link", "123456");

        await browser.waitUntil(async () => {
            let element = $("#main-content");
            return await element.isDisplayed()
        });
    });

    afterEach(async function () {
        await functions.logout();
    });

    it("new podcast", async function () {
        let imagePath = path.join(__dirname, "../../misc/img/church.jpeg");

        await $("span=Neuer Podcast").click();

        let editors = $$(".ck.ck-content");

        await editors.get(0).setValue(" Meine Beschreibung");
        await editors.get(1).setValue(" Meine Beschreibung");

        await functions.setFormValues({
            "title-de":"Neuer Podcast",
            "title-en":"New Podcast",
            // "description-de":"Meine Beschreibung",
            // "description-en":"My english description",
            "image": imagePath,
            "spotifyLink":"https://new.podcast.silas.link",
            "youtubeLink":"https://youtube.silas.link",
            "duration":"30",
            "releaseCircle-de":"Jeden 2 Donnerstag",
            "releaseCircle-en":"Every 2nd Thursday",
        });
        await $("button.button=Speichern").click();

        expect(await $("h1#name=Neuer Podcast").isDisplayed()).toBeTruthy();

        let data = await functions.queryDatabase("SELECT * FROM podcast WHERE spotifyLink='https://new.podcast.silas.link' LIMIT 1");
        data = data[0];

        expect(data["spotifyLink"]).toEqual("https://new.podcast.silas.link");
        expect(data["youtubeLink"]).toEqual("https://youtube.silas.link");
        expect(data["titles"]).toEqual("{\"de\":\"Neuer Podcast\",\"en\":\"New Podcast\"}");
        expect(data["descriptions"]).toEqual("{\"de\":\"<p>Meine Beschreibung</p>\",\"en\":\"<p>Meine Beschreibung</p>\"}");
        expect(data["releaseCircles"]).toEqual("{\"de\":\"Jeden 2 Donnerstag\",\"en\":\"Every 2nd Thursday\"}");
        expect(data["duration"]).toEqual(30);

        let id = data["id"];

        data = await functions.queryDatabase("SELECT * FROM podcastImages INNER JOIN file_medium ON fileMediumId = file_medium.id WHERE podcastId = "+id);
        expect(data.length).toEqual(1);

        data = data[0];
        let savedImagePath = path.join(__dirname, "../../../src/server/uploads/img_"+data["src"]);
        await functions.compareFiles(imagePath, savedImagePath);
    });

    it("edit podcast", async function () {
        let imagePath = path.join(__dirname, "../../misc/img/church.jpeg");

        await browser.url(await browser.getUrl());

        if (browser.config.isMobile) {
            await $("button.menu-icon").click();
            await find.one("#responsive-menu [data-translation='podcasts']").click();
        } else {
            await find.one("[data-translation='podcasts']").click();
        }
        await $("h3.name=Bearbeiten des Podcasts Test").click();
        expect(await $(".admin-panel").isDisplayed()).toBeTruthy();

        await $("#modify-podcast").click();

        await functions.verifyFormValues({
            "title-de":"Bearbeiten des Podcasts Test",
            "title-en":"Edit podcast test",
            "description-de":"Deutsche Beschreibung vor <b>Bearbeitung!</b>.",
            "description-en":"Englische Beschreibung",
            "image-before": "https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg",
            "spotifyLink":"my-website.de",
            "youtubeLink":"",
            "duration":'25',
            "releaseCircle-de":"immer",
            "releaseCircle-en":"always",
        });

        editors = $$(".ck.ck-content");

        await editors.get(0).setValue(" Meine bearbeitete Beschreibung");
        await editors.get(1).setValue(" Meine english Beschreibung");

        await functions.setFormValues({
            "title-de":"Bearbeiteter Podcast",
            "title-en":"Edited Podcast",
            "image": imagePath,
            "spotifyLink":"echo.silas.link2",
            "youtubeLink":"echo.silas.link2Youtube",
            "duration":"45",
            "releaseCircle-de":"de",
            "releaseCircle-en":"en",
        });

        await functions.pause(1000);
        await $("button.button=Speichern").click();

        await functions.pause(2500);
        expect(await $("h1#name=Bearbeiteter Podcast").isDisplayed()).toBeTruthy();

        let data = await functions.queryDatabase("SELECT * FROM podcast WHERE spotifyLink='echo.silas.link2' LIMIT 1");

        data = data[0];

        expect(data["spotifyLink"]).toEqual("echo.silas.link2");
        expect(data["youtubeLink"]).toEqual("echo.silas.link2Youtube");
        expect(data["titles"]).toEqual("{\"de\":\"Bearbeiteter Podcast\",\"en\":\"Edited Podcast\"}");
        expect(data["descriptions"]).toEqual("{\"de\":\"<p>Meine bearbeitete BeschreibungDeutsche Beschreibung vor <strong>Bearbeitung!</strong>.</p>\",\"en\":\"<p>Meine english BeschreibungEnglische Beschreibung</p>\"}");
        expect(data["releaseCircles"]).toEqual("{\"de\":\"de\",\"en\":\"en\"}");
        expect(data["duration"]).toEqual(45);

        let id = data["id"];

        data = await functions.queryDatabase("SELECT * FROM podcastImages INNER JOIN file_medium ON fileMediumId = file_medium.id WHERE podcastId = "+id);
        expect(data.length).toEqual(1);

        data = data[0];
        let savedImagePath = path.join(__dirname, "../../../src/server/uploads/img_"+data["src"]);
        await functions.compareFiles(imagePath, savedImagePath);
    });

    it("delete podcast", async function () {
        await browser.url(await browser.getUrl());

        if (browser.config.isMobile) {
            await $("button.menu-icon").click();
            await find.one("#responsive-menu [data-translation='podcasts']").click();
        } else {
            await find.one("[data-translation='podcasts']").click();
        }
        await $("h3.name=Löschen des Podcasts").click();
        expect(await $(".admin-panel").isDisplayed()).toBeTruthy();

        await $("#delete-podcast").click();
        await $(".button=OK").click();

        await functions.pause(1000);

        let data = await functions.queryDatabase("SELECT * FROM podcast WHERE id=2 LIMIT 1");
        data = data[0];
        expect(data["deleted"]).toEqual(1);
    });
});
