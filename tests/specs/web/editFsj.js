const find = require("../../lib/PromiseSelector");
const $ = find.one;
const $$ = find.multiple;
const functions = require("../../lib/functions");
const path = require("path");

describe("edit fsj", () => {
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

    it("new church", async function () {
        await $("span=Neues FSJ").click();

        let editors = $$(".ck.ck-content");

        await editors.get(0).setValue("Meine Beschreibung");
        await editors.get(1).setValue("Meine Beschreibung");

        await functions.setFormValues({
            "name-de":"Neues FSJ",
            "name-en":"New FSJ",
            "image": path.join(__dirname, "../../misc/img/church.jpeg"),
            "website-url":"echo.silas.link",
        });

        await $("button.button=Speichern").click();

        expect(await $("h1#name=Neues FSJ").isDisplayed()).toBeTruthy();

        let data = await functions.queryDatabase("SELECT * FROM fsj WHERE website='echo.silas.link' LIMIT 1");
        data = data[0];

        expect(data["website"]).toEqual("echo.silas.link");
        expect(data["names"]).toEqual("{\"de\":\"Neues FSJ\",\"en\":\"New FSJ\"}");
        expect(data["descriptions"]).toEqual("{\"de\":\"<p>Meine Beschreibung</p>\",\"en\":\"<p>Meine Beschreibung</p>\"}");

        let id = data["id"];

        data = await functions.queryDatabase("SELECT * FROM fsjImage INNER JOIN file_medium ON fileMediumId = file_medium.id WHERE fsjId = "+id);
        expect(data.length).toEqual(1);
    });

    it("edit fsj", async function () {
        if (browser.config.isMobile) {
            await $("button.menu-icon").click();
            await find.one("#responsive-menu [data-translation='fsjs']").click();
        } else {
            await find.one("[data-translation='fsjs']").click();
        }
        await $("h3.name=Bearbeiten der Kirche Test").click();
        expect(await $(".admin-panel").isDisplayed()).toBeTruthy();

        await $("#modify-church").click();

        let editors = $$(".ck.ck-content");

        // expect(await editors.get(0).getValue()).toEqual("Deutsche Beschreibung vor Bearbeitung!.");
        // expect(await editors.get(1).getValue()).toEqual("Englische Beschreibung");

        await functions.verifyFormValues({
            "name-de":"Bearbeiten der Kirche Test",
            "name-en":"Edit church test",
            "description-de":"Deutsche Beschreibung vor <b>Bearbeitung!</b>.",
            "description-en":"Englische Beschreibung",
            "image-before": "https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg",
            "website-url":"my-website.de",
            "place-name-1":"Ort vor Bearbeitung 1",
            "place-name-2":"Zweiter Ort",
            "place-name-3":"Köln City Church \n" +
                "Senats Hotel \n" +
                "Unter Goldschmied 9-17 \n" +
                "50667 Köln \n" +
                "Eingang über Laurenzplatz"
        });

        let removeButtons = $$(".remove-place");

        await removeButtons.get(1).click();
        await removeButtons.get(2).click();

        editors = $$(".ck.ck-content");

        await editors.get(0).setValue("Meine bearbeitete Beschreibung");
        await editors.get(1).setValue("Meine english Beschreibung");

        await functions.setFormValues({
            "name-de":"Bearbeitete Kirche",
            "name-en":"Edited Church",
            "image": path.join(__dirname, "../../misc/img/church.jpeg"),
            "website-url":"echo.silas.link2",
            "place-name-1":"Köln bearbeitet"
        });

        await $("button.button=Speichern").click();

        await functions.pause(2500);
        expect(await $("h1#name=Bearbeitete Kirche").isDisplayed()).toBeTruthy();

        let data = await functions.queryDatabase("SELECT * FROM church WHERE website='echo.silas.link2' LIMIT 1");

        data = data[0];

        expect(data["website"]).toEqual("echo.silas.link2");
        expect(data["names"]).toEqual("{\"de\":\"Bearbeitete Kirche\",\"en\":\"Edited Church\"}");
        expect(data["descriptions"]).toEqual("{\"de\":\"<p>Meine bearbeitete BeschreibungDeutsche Beschreibung vor <strong>Bearbeitung!</strong>.</p>\",\"en\":\"<p>Meine english BeschreibungEnglische Beschreibung</p>\"}");
        expect(data["places"]).toEqual("{\"Köln bearbeitet\":\"Köln bearbeitet\"}");
    });

    it("delete church", async function () {
        if (browser.config.isMobile) {
            await $("button.menu-icon").click();
            await find.one("#responsive-menu [data-translation='churches']").click();
        } else {
            await find.one("[data-translation='churches']").click();
        }
        await $("h3.name=Löschen der Kirche Test").click();
        expect(await $(".admin-panel").isDisplayed()).toBeTruthy();

        await $("#delete-church").click();
        await $(".button=OK").click();

        await functions.pause(1000);

        let data = await functions.queryDatabase("SELECT * FROM church WHERE id=14 LIMIT 1");
        data = data[0];
        expect(data["deleted"]).toEqual(1);
    });

});