import translationGerman from '../translations/de.json';
import translationEnglish from '../translations/en.json';
import {App, StartSiteMenuAction, Translator, NavbarFragment, DataManager, MenuAction} from "cordova-sites";
import {Helper} from "js-helper/dist/shared"
import {EasySyncClientDb, SetupEasySync1000000000500, SyncJob} from "cordova-sites-easy-sync/client";

import {WelcomeSite} from "./Sites/WelcomeSite";

import {Event} from "../../model/Event";
import {Church} from "../../model/Church";
import {Region} from "../../model/Region";
import "./Model/Favorite"

import {BaseDatabase} from "cordova-sites-database";
import {EasySyncBaseModel} from "cordova-sites-easy-sync/model";
import {ListChurchesSite} from "./Sites/ListChurchesSite";
import {AddEventSite} from "./Sites/AddEventSite";
import {UserManager, LoginSite, RegistrationSite, UserMenuAction} from "cordova-sites-user-management/client";
import {CalendarSite} from "./Sites/CalendarSite";
import {ModifyChurchSite} from "./Sites/ModifyChurchSite";
import {ImpressumSite} from "./Sites/ImpressumSite";

import bibelverse from "./bibelverse.json";

//translation import
import "cordova-sites-user-management/src/client/js/translationInit"
import "cordova-sites/src/client/js/translationInit"
import {ModifyPostSite} from "./Sites/ModifyPostSite";
import {SettingsDialog} from "./Dialoges/SettingsDialog";
import {EventHelper} from "./Helper/EventHelper";
import {Post} from "../../model/Post";
import {SetupSchema1000000000000} from "../../model/migrations/SetupSchema";
import {SetupUserManagement1000000001000} from "cordova-sites-user-management/src/migrations/SetupUserManagement"

window["JSObject"] = Object;

// BaseModel._databaseClass = EasySyncClientDb;
EasySyncClientDb.BASE_MODEL = EasySyncBaseModel;

LoginSite.ADD_LOGIN_ACTION = false;
RegistrationSite.ADD_REGISTRATION_ACTION = false;

App.addInitialization(async (app) => {

    //add Bibelvers to html
    let vers = bibelverse[Math.floor(Math.random() * (bibelverse.length))];
    document.head.prepend(document.createComment(vers["vers"] + " \n- " + vers["stelle"] + " (" + vers["uebersetzung"] + ")"));

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
        logMissingTranslations: true,
    });

    //Setting Title
    NavbarFragment.title = "";

    //Creating Menu
    NavbarFragment.defaultActions.push(new StartSiteMenuAction("events", CalendarSite));
    NavbarFragment.defaultActions.push(new StartSiteMenuAction("churches", ListChurchesSite));
    NavbarFragment.defaultActions.push(new StartSiteMenuAction("about us", WelcomeSite));
    NavbarFragment.defaultActions.push(new MenuAction("language", async () => {
        if (Translator.getInstance().getCurrentLanguage() === "en") {
            await Translator.getInstance().setLanguage("de");
        } else {
            await Translator.getInstance().setLanguage("en");
        }
    }, MenuAction.SHOW_FOR_LARGE));

    if (Helper.isMobileApp()) {
        NavbarFragment.defaultActions.push(new MenuAction("settings", () => {
            new SettingsDialog().show();
        }, MenuAction.SHOW_NEVER));
    }

    NavbarFragment.defaultActions.push(new StartSiteMenuAction("contact", WelcomeSite, MenuAction.SHOW_NEVER));
    NavbarFragment.defaultActions.push(new StartSiteMenuAction("privacy policy", ImpressumSite, MenuAction.SHOW_NEVER));
    NavbarFragment.defaultActions.push(new StartSiteMenuAction("imprint", ImpressumSite, MenuAction.SHOW_NEVER));

    NavbarFragment.defaultActions.push(new UserMenuAction("add event", "admin", () => {
        app.startSite(AddEventSite);
    }, MenuAction.SHOW_FOR_MEDIUM));

    NavbarFragment.defaultActions.push(new UserMenuAction("add church", "admin", () => {
        app.startSite(ModifyChurchSite);
    }, MenuAction.SHOW_FOR_MEDIUM));

    NavbarFragment.defaultActions.push(new UserMenuAction("add post", "admin", () => {
        app.startSite(ModifyPostSite);
    }, MenuAction.SHOW_FOR_MEDIUM));

    DataManager.setHeader("Accept-Language", "de-DE,dias;q=0.5");
    await UserManager.getInstance().getMe();

    console.log("churches before ", await Church.find());

    //Todo an richtige stelle auslagern
    let res = await new SyncJob().sync([Church, Event, Region, Post]).catch(e => console.error(e));
    EventHelper.updateNotificationsForEvents(res["Event"]["changed"]);
    EventHelper.deleteNotificationsForEvents(res["Event"]["deleted"]);

    window["Church"] = Church;

    try {
        //Updates height for "mobile browser address bar hiding"-bug
        let updateWindowHeight = () => {
            document.body.style.height = window.innerHeight + "px";
            setTimeout(updateWindowHeight, 350);
        };
        updateWindowHeight();
    } catch (e) {
    }
});

DataManager._basePath = __HOST_ADDRESS__;

Object.assign(BaseDatabase.CONNECTION_OPTIONS, {
    logging: ["error",],
    synchronize: false,
    migrationsRun: true,
    migrations: [
        SetupSchema1000000000000,
        SetupUserManagement1000000001000,
        SetupEasySync1000000000500
    ]
});

let app = new App();
app.start(WelcomeSite).catch(e => console.error(e)).then(() => {
    console.log("initialisation done!", new Date())
});
