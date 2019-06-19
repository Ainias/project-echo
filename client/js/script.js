// import "../../node_modules/sql.js/js/sql-optimized.js"
// import "../../node_modules/localforage/dist/localforage.js"

import translationGerman from '../translations/de.json';
import translationEnglish from '../translations/en.json';
import {App, StartSiteMenuAction, Translator, NavbarFragment, DataManager, MenuAction} from "cordova-sites";
import {EasySyncClientDb, SyncJob} from "cordova-sites-easy-sync/client";

import {WelcomeSite} from "./Sites/WelcomeSite";

import {Event} from "../../model/Event";
import {Church} from "../../model/Church";
import {Region} from "../../model/Region";
import "./Model/Favorite"

import {BaseDatabase, BaseModel} from "cordova-sites-database";
import {EasySyncBaseModel} from "cordova-sites-easy-sync/model";
import {ListChurchesSite} from "./Sites/ListChurchesSite";
import {AddEventSite} from "./Sites/AddEventSite";
import {UserManager, LoginSite, RegistrationSite, UserMenuAction} from "cordova-sites-user-management/client";

BaseModel._databaseClass = EasySyncClientDb;
EasySyncClientDb.BASE_MODEL = EasySyncBaseModel;

LoginSite.ADD_LOGIN_ACTION = false;
RegistrationSite.ADD_REGISTRATION_ACTION = false;

App.addInitialization(async (app) => {
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


    NavbarFragment.defaultActions.push(new UserMenuAction("add event", "admin", () => {
        app.startSite(AddEventSite);
    }, MenuAction.SHOW_FOR_MEDIUM));

    await UserManager.getInstance().getMe();

    //Todo an richtige stelle auslagern
    await new SyncJob().sync([Church, Event, Region]).catch(e => console.error(e));
});

DataManager._basePath = __HOST_ADDRESS__;

Object.assign(BaseDatabase.CONNECTION_OPTIONS, {
    // "synchronize": false,
    "logging":  ["error"],
    // "logging":  true
});

let app = new App();
app.start(WelcomeSite).catch(e => console.error(e)).then(() => {
    console.log("initialisation done!", new Date())
});
