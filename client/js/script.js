import translationGerman from '../translations/de.json';
import translationEnglish from '../translations/en.json';
import {App, StartSiteMenuAction, Translator, NavbarFragment, DataManager, MenuAction} from "cordova-sites";
import {EasySyncClientDb, SyncJob} from "cordova-sites-easy-sync/client";

import {WelcomeSite} from "./Sites/WelcomeSite";
// import {Event} from "../../model/Event";
import {Church} from "../../model/Church";
import {Region} from "../../model/Region";

import {BaseDatabase, BaseModel} from "cordova-sites-database";
import {EasySyncBaseModel} from "cordova-sites-easy-sync/model";
import {ListChurchesSite} from "./Sites/ListChurchesSite";

BaseModel._databaseClass = EasySyncClientDb;
EasySyncClientDb.BASE_MODEL = EasySyncBaseModel;

App.addInitialization(async () => {
    if (window.StatusBar) {
        StatusBar.overlaysWebView(true);
        StatusBar.backgroundColorByHexString('#33000000');
    }
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
    NavbarFragment.defaultActions.push(new StartSiteMenuAction("churches", ListChurchesSite));
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
    await new SyncJob().sync([Church, Region]).catch(e => console.error(e));
});

DataManager._basePath = "http://192.168.0.51:3000/api/v1/";
Object.assign(BaseDatabase.CONNECTION_OPTIONS, {
    "logging": false
});

let app = new App();
app.start(WelcomeSite).catch(e => console.error(e));
// }
// });
