const find = require('../../lib/PromiseSelector');
const $ = find.one;
const $$ = find.multiple;
const functions = require('../../lib/functions.js');

describe('search site', () => {
    let baseUrl = null;
    beforeAll(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 90 * 1000 * browser.config.delayFactor;

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
        await browser.url(baseUrl);
        await functions.deactivateTranslationLogging();
        await functions.logErrors();

        await browser.waitUntil(async () => {
            let element = $('#main-content');
            return await element.isDisplayed();
        });

        await functions.acceptCookies();
    });

    afterEach(async function () {
        let errors = await functions.getLoggedErrors();
        expect(errors.length).toEqual(0);
        if (errors.length > 0) {
            console.log(errors);
            errors.forEach((err) => console.error(err));
        }
        expect(errors).toEqual([]);
    });

    it('search without parameters', async function () {
        await find.one('.footer .icon.search').click();
        await functions.pause(500);
        await $('#search-button').click();

        const newDay = new Date(browser.config.fullYear, browser.config.month + 1, 28);

        expect(
            await $(
                '.day=' +
                    functions.dayName(newDay.getDay()) +
                    ' 28.' +
                    (((browser.config.month + 1) % 12) + 1).toString().padStart(2, '0') +
                    '.'
            ).isDisplayed()
        ).toBeTruthy();

        expect(await $('.name=Search Test 1').isDisplayed()).toBeTruthy();
        expect(await $('.name=Search Test 2').isDisplayed()).toBeTruthy();
        expect(await $('.name=Search Test 3').isDisplayed()).toBeTruthy();
        expect(await $('.name=Search Test 4').isDisplayed()).toBeTruthy();
        expect(await $('.name=Search Test 5').isDisplayed()).toBeTruthy();
        expect(await $('.name=Search Test 6').isDisplayed()).toBeTruthy();
        expect(await $('.name=Search Test 7').isDisplayed()).toBeTruthy();

        await $('.name=Search Test 1').click();
        await functions.pause(500);
        expect(await $('#event-name').isDisplayed()).toBeTruthy();
    });

    it('search with types', async function () {
        await find.one('.footer .icon.search').click();
        await functions.pause(500);
        await $('.filter-tag=Konzert').click();
        await functions.pause(3000);

        const date = new Date(browser.config.fullYear, browser.config.month + 1, 28);

        expect(
            await $(
                '.day=' +
                    functions.dayName(date.getDay()) +
                    ' 28.' +
                    (((browser.config.month + 1) % 12) + 1).toString().padStart(2, '0') +
                    '.'
            ).isDisplayed()
        ).toBeTruthy();
        expect(await $('.name=Search Test 6').isDisplayed()).toBeTruthy();
    });

    it('search with churches', async function () {
        await find.one('.footer .icon.search').click();
        await functions.pause(500);
        await $('.filter-tag=KÖLN CITY CHURCH').click();

        await functions.pause(1000);

        const date = new Date(browser.config.fullYear, browser.config.month + 1, 28);
        expect(
            await $(
                '.day=' +
                    functions.dayName(date.getDay()) +
                    ' 28.' +
                    (((browser.config.month + 1) % 12) + 1).toString().padStart(2, '0') +
                    '.'
            ).isDisplayed()
        ).toBeTruthy();
        expect(await $('.name=Search Test 6').isDisplayed()).toBeTruthy();
        expect(await $('.name=Search Test 7').isExisting()).toBeFalsy();

        await $('#search-input').click();

        await $('.filter-tag=A City Church').click();
        await functions.pause(500);

        expect(await $('.name=Search Test 6').isDisplayed()).toBeFalsy();
        expect(await $('.name=Search Test 7').isDisplayed()).toBeTruthy();
    });

    it('search with text', async function () {
        await find.one('.footer .icon.search').click();
        await functions.pause(500);
        await $('#search-input').setValue('3');
        await $('#search-button').click();

        expect(await $('.name=Search Test 3').isDisplayed()).toBeTruthy();
        expect(await $('.name=Search Test 1').isExisting()).toBeFalsy();
    });

    it('search via url', async function () {
        await browser.url(baseUrl + '?q=Sear&types=konzert%2Chauskreis&churches=2&s=search');
        await functions.deactivateTranslationLogging();
        await functions.logErrors();

        await browser.waitUntil(async () => {
            let element = $('#main-content');
            return await element.isDisplayed();
        });

        expect(await $('.name=Search Test 6').isExisting()).toBeFalsy();
        expect(await $('.name=Search Test 7').isDisplayed()).toBeTruthy();
    });
});
