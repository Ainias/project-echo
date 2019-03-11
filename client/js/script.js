import translationGerman from '../translations/de.json';
import translationEnglish from '../translations/en.json';
import {App, StartSiteMenuAction, Translator, NavbarFragment, DataManager, MenuAction, Menu} from "cordova-sites";
import {EasySyncClientDb, SyncJob} from "cordova-sites-easy-sync/client";

import {WelcomeSite} from "./Sites/WelcomeSite";
// import {Event} from "../../model/Event";
import {Church} from "../../model/Church";
import {Region} from "../../model/Region";

// import "sql.js/js/sql-optimized.js";


import {ShowChurchSite} from "./Sites/ShowChurchSite";
import {BaseDatabase, BaseModel} from "cordova-sites-database";
import * as typeorm from "typeorm";
import {EasySyncBaseModel} from "cordova-sites-easy-sync/model";

BaseModel._databaseClass = EasySyncClientDb;
EasySyncClientDb.BASE_MODEL = EasySyncBaseModel;
BaseDatabase.typeorm = typeorm;

App.addInitialization(async () => {

    Translator.init({
        translations: {
            "de": translationGerman,
            "en": translationEnglish
        },
        fallbackLanguage: "de",
        // markTranslations: true,
        markUntranslatedTranslations: true,
    });

    //Setting Title
    NavbarFragment.title = "";

    //Creating Menu
    NavbarFragment.defaultActions.push(new StartSiteMenuAction("events", WelcomeSite));
    NavbarFragment.defaultActions.push(new StartSiteMenuAction("churches", [ShowChurchSite, {"id": 1}]));
    NavbarFragment.defaultActions.push(new StartSiteMenuAction("about us", WelcomeSite));
    NavbarFragment.defaultActions.push(new MenuAction("language", async () => {
        if (Translator.getInstance().getCurrentLanguage() === "en") {
            await Translator.getInstance().setLanguage("de");
        } else {
            await Translator.getInstance().setLanguage("en");
        }
    }, MenuAction.SHOW_FOR_LARGE));
    NavbarFragment.defaultActions.push(new StartSiteMenuAction("contact", WelcomeSite, MenuAction.SHOW_NEVER));
    NavbarFragment.defaultActions.push(new StartSiteMenuAction("privacy policy", WelcomeSite, MenuAction.SHOW_NEVER));
    NavbarFragment.defaultActions.push(new StartSiteMenuAction("imprint", WelcomeSite, MenuAction.SHOW_NEVER));

    //Todo an richtige stelle auslagern
    await new SyncJob().sync([Church, Region]);
});

DataManager._basePath = "http://127.0.0.1:3000/api/v1/";

let app = new App();
app.start(WelcomeSite).catch(e => console.error(e));
