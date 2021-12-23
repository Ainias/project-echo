const find = require('../../lib/PromiseSelector');
const $ = find.one;
const $$ = find.multiple;
const functions = require('../../lib/functions');
const path = require('path');

describe('edit church', () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000;

    let baseUrl = null;
    beforeAll(async () => {
        if (browser.config.baseUrl.trim() !== '') {
            baseUrl = browser.config.baseUrl;
        } else {
            baseUrl = await browser.getUrl();
        }

        browser.setTimeout({
            implicit: 5000,
        });
        // await functions.mockMatomo();
    });

    beforeEach(async function () {
        // await functions.setCurrentDate();

        await functions.login('echo@silas.link', '123456');

        await browser.waitUntil(async () => {
            let element = $('#main-content');
            return await element.isDisplayed();
        });
    });

    afterEach(async function () {
        await functions.logout();
    });

    it('new church', async function () {
        let imagePath = path.join(__dirname, '../../misc/img/church.jpeg');

        await $('span=Neuer Veranstalter').click();

        let editors = $$('.ck.ck-content');

        await editors.get(0).setValue(' Meine Beschreibung');
        await editors.get(1).setValue(' Meine Beschreibung');

        await functions.setFormValues({
            'name-de': 'Neue Kirche',
            'name-en': 'New Church',
            // "description-de":"Meine Beschreibung",
            // "description-en":"My english description",
            image: imagePath,
            'website-url': 'echo.silas.link',
            'place-name-1': 'Köln',
        });

        await $('#add-place').click();
        await $('#add-place').click();

        await functions.setFormValues({
            'place-name-2': 'Aachen',
            'place-name-3': 'Remscheid',
        });

        await $('button.button=Speichern').click();

        expect(await $('h1#name=Neue Kirche').isDisplayed()).toBeTruthy();

        let data = await functions.queryDatabase("SELECT * FROM church WHERE website='echo.silas.link' LIMIT 1");
        data = data[0];

        expect(data['website']).toEqual('echo.silas.link');
        expect(data['names']).toEqual('{"de":"Neue Kirche","en":"New Church"}');
        expect(
            data['descriptions'].match(/^{"de":"<p> ?Meine Beschreibung<\/p>","en":"<p> ?Meine Beschreibung<\/p>"}$/g)
        ).toBeTruthy();
        expect(data['places']).toEqual('{"Köln":"Köln","Aachen":"Aachen","Remscheid":"Remscheid"}');

        let id = data['id'];

        data = await functions.queryDatabase('SELECT * FROM churchRegion WHERE churchId = ' + id);
        data = data[0];
        expect(data['regionId']).toEqual(1);

        data = await functions.queryDatabase(
            'SELECT * FROM churchImages INNER JOIN file_medium ON fileMediumId = file_medium.id WHERE churchId = ' + id
        );
        expect(data.length).toEqual(1);

        data = data[0];
        let savedImagePath = path.join(__dirname, '../../../src/server/uploads/img_' + data['src']);
        await functions.compareFiles(imagePath, savedImagePath);
    });

    it('edit church', async function () {
        let imagePath = path.join(__dirname, '../../misc/img/church.jpeg');

        if (browser.config.isMobile) {
            await $('button.menu-icon').click();
            await find.one("#responsive-menu [data-translation='churches']").click();
        } else {
            await find.one("[data-translation='churches']").click();
        }
        await $('h3.name=Bearbeiten der Kirche Test').click();
        expect(await $('.admin-panel').isDisplayed()).toBeTruthy();

        await $('#modify-church').click();

        let editors = $$('.ck.ck-content');

        await functions.verifyFormValues({
            'name-de': 'Bearbeiten der Kirche Test',
            'name-en': 'Edit church test',
            'description-de': 'Deutsche Beschreibung vor <b>Bearbeitung!</b>.',
            'description-en': 'Englische Beschreibung',
            'image-before': 'https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg',
            'website-url': 'my-website.de',
            'place-name-1': 'Ort vor Bearbeitung 1',
            'place-name-2': 'Zweiter Ort',
            'place-name-3':
                'Köln City Church \n' +
                'Senats Hotel \n' +
                'Unter Goldschmied 9-17 \n' +
                '50667 Köln \n' +
                'Eingang über Laurenzplatz',
        });

        let removeButtons = $$('.remove-place');

        await removeButtons.get(1).click();
        await removeButtons.get(2).click();

        editors = $$('.ck.ck-content');

        await editors.get(0).setValue(' Meine bearbeitete Beschreibung');
        await editors.get(1).setValue(' Meine english Beschreibung');

        await functions.setFormValues({
            'name-de': 'Bearbeitete Kirche',
            'name-en': 'Edited Church',
            image: imagePath,
            'website-url': 'echo.silas.link2',
            'place-name-1': 'Köln bearbeitet',
        });

        await functions.pause(1000);
        await $('button.button=Speichern').click();

        await functions.pause(2500);
        expect(await $('h1#name=Bearbeitete Kirche').isDisplayed()).toBeTruthy();

        let data = await functions.queryDatabase("SELECT * FROM church WHERE website='echo.silas.link2' LIMIT 1");

        data = data[0];

        expect(data['website']).toEqual('echo.silas.link2');
        expect(data['names']).toEqual('{"de":"Bearbeitete Kirche","en":"Edited Church"}');
        expect(
            data['descriptions'].match(
                /^{"de":"<p> ?Meine bearbeitete BeschreibungDeutsche Beschreibung vor <strong>Bearbeitung!<\/strong>.<\/p>","en":"<p> ?Meine english BeschreibungEnglische Beschreibung<\/p>"}$/g
            )
        ).toBeTruthy();
        expect(data['places']).toEqual('{"Köln bearbeitet":"Köln bearbeitet"}');

        let id = data['id'];

        data = await functions.queryDatabase(
            'SELECT * FROM churchImages INNER JOIN file_medium ON fileMediumId = file_medium.id WHERE churchId = ' + id
        );
        expect(data.length).toEqual(1);

        data = data[0];
        let savedImagePath = path.join(__dirname, '../../../src/server/uploads/img_' + data['src']);
        await functions.compareFiles(imagePath, savedImagePath);
    });

    it('delete church', async function () {
        if (browser.config.isMobile) {
            await $('button.menu-icon').click();
            await find.one("#responsive-menu [data-translation='churches']").click();
        } else {
            await find.one("[data-translation='churches']").click();
        }
        await $('h3.name=Löschen der Kirche Test').click();
        expect(await $('.admin-panel').isDisplayed()).toBeTruthy();

        await $('#delete-church').click();
        await $('.button=OK').click();

        await functions.pause(1000);

        let data = await functions.queryDatabase('SELECT * FROM church WHERE id=14 LIMIT 1');
        data = data[0];
        expect(data['deleted']).toEqual(1);
    });
});
