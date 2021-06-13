import translationGerman from '../translations/de.json';
import translationEnglish from '../translations/en.json';
import {App, StartSiteMenuAction, Translator, NavbarFragment, DataManager, MenuAction} from "cordova-sites";
import {Helper} from "js-helper/dist/shared"
import {EasySyncClientDb, SetupEasySync1000000000500} from "cordova-sites-easy-sync/dist/client";

import {WelcomeSite} from "./Sites/WelcomeSite";

import "./Model/Favorite"

import "../img/flag_german.svg";
import "../img/flag_usa.svg";

import {BaseDatabase} from "cordova-sites-database";
import {EasySyncBaseModel} from "cordova-sites-easy-sync/dist/shared";
import {ListChurchesSite} from "./Sites/ListChurchesSite";
import {ModifyEventSite} from "./Sites/ModifyEventSite";
import {UserManager, LoginSite, RegistrationSite, UserMenuAction} from "cordova-sites-user-management/dist/client";
import {CalendarSite} from "./Sites/CalendarSite";
import {ModifyChurchSite} from "./Sites/ModifyChurchSite";
import {ImpressumSite} from "./Sites/ImpressumSite";

import bibelverse from "./bibelverse.json";

//translation import
import "cordova-sites-user-management/dist/client/js/translationInit"
import "cordova-sites/dist/client/js/translationInit"
import logo from "../img/logo.png";

import {ModifyPostSite} from "./Sites/ModifyPostSite";
import {SetupSchema1000000000000} from "../../shared/model/migrations/SetupSchema";
import {SetupUserManagement1000000001000} from "cordova-sites-user-management/dist/shared/migrations/SetupUserManagement"
import {SetupFavorite1000000000001} from "../../shared/model/migrations/client/SetupFavorite";
import {FsjSchema1000000006000} from "../../shared/model/migrations/FsjSchema";
import {ModifyFsjSite} from "./Sites/ModifyFsjSite";
import {ListFsjsSite} from "./Sites/ListFsjsSite";
import {SystemCalendar} from "./SystemCalendar";
import {FavoriteWithSystemCalendar1000000000002} from "../../shared/model/migrations/client/FavoriteWithSystemCalendar";
import {SettingsSite} from "./Sites/SettingsSite";
import {AddRepeatedEvent1000000007000} from "../../shared/model/migrations/AddRepeatedEvent";
import {FavoriteWithoutEventRelation1000000008000} from "../../shared/model/migrations/client/FavoriteWithoutEventRelation";
import {ClearDatabaseJob} from "./ClearDatabase/ClearDatabaseJob";
import {CookieConsentHelper} from "./CookieConsent/CookieConsentHelper";
import {NativeStoragePromise} from "cordova-sites/dist/client/js/NativeStoragePromise";
import {ImagesSchema1000000010000} from "../../shared/model/migrations/ImagesSchema";
import {FileMedium} from "cordova-sites-easy-sync/dist/shared";
import {ImagesSchemaDownload1000000011000} from "../../shared/model/migrations/ImagesSchemaDownload";
import {ContactSite} from "./Sites/ContactSite";
import * as typeorm from "typeorm";
import {AboutUsSite} from "./Sites/AboutUsSite";

import {Sync} from "./Sync";
import {DateHelper} from "js-helper";
import {EventWeblink1000000012000} from "../../shared/model/migrations/EventWeblink";
import {ChurchInstalink1000000013000} from "../../shared/model/migrations/ChurchInstalink";
import {Post} from "../../shared/model/Post";
import {EventHelper} from "./Helper/EventHelper";

import {DateHelper as MyDateHelper} from "./Helper/DateHelper";
import {MatomoHelper} from "js-helper/dist/client/MatomoHelper";

window["JSObject"] = Object;
window["version"] = __VERSION__;


EasySyncClientDb.BASE_MODEL = EasySyncBaseModel;

LoginSite.ADD_LOGIN_ACTION = false;
RegistrationSite.ADD_REGISTRATION_ACTION = false;

App.setLogo(logo);

MatomoHelper.start("matomo.echoapp.de", __MATOMO_ID__, "m");
App.addInitialization(async (app) => {

    // const deleteDate = new Date();
    // MyDateHelper.setMonth(deleteDate, deleteDate.getMonth() - 2);
    // deleteDate.setDate(-1);
    //
    // EventHelper.deleteEventsOlderThan(deleteDate);

    // DataManager._assetBasePath = (cordova.device !== "browser"?cordova.file.applicationDirectory:"");

    // let obj = await NativeStoragePromise.getItem("background-counter-obj", []);
    // console.log("background obj: ", obj);
    // await NativeStoragePromise.setItem("background-counter-obj", []);

    //add Bibelvers to html
    let vers = bibelverse[Math.floor(Math.random() * (bibelverse.length))];
    document.head.prepend(document.createComment(vers["vers"] + " \n- " + vers["stelle"] + " (" + vers["uebersetzung"] + ")"));

    if (window.StatusBar) {
        StatusBar.overlaysWebView(true);
        StatusBar.backgroundColorByHexString('#33000000');
    }

    window["missingTranslations"] = {};
    Translator.init({
        translations: {
            "de": translationGerman,
            "en": translationEnglish
        },
        fallbackLanguage: "de",
        // markTranslations: true,
        markUntranslatedTranslations: __IS_DEVELOP__,
        logMissingTranslations: (key, language) => {
            window["missingTranslations"][language] = Helper.nonNull(window["missingTranslations"][language], []);
            window["missingTranslations"][language].push(key);
            if (window["shouldConsoleMissingTranslation"] !== false) {
                console.error("missing translation for language >" + language + "< and key >" + key + "<");
            }
        },
    });

    DateHelper.setTranslationCallback(key => {
        return Translator.makePersistentTranslation(key).outerHTML;
    })

    //Setting Title
    NavbarFragment.title = "";

    //Creating Menu
    NavbarFragment.defaultActions.push(new StartSiteMenuAction("events", CalendarSite));
    NavbarFragment.defaultActions.push(new StartSiteMenuAction("churches", ListChurchesSite));
    // NavbarFragment.defaultActions.push(new StartSiteMenuAction("fsjs", ListFsjsSite));
    NavbarFragment.defaultActions.push(new StartSiteMenuAction("about us", AboutUsSite));

    const languageAction = new MenuAction("language", async () => {
        if (Translator.getInstance().getCurrentLanguage() === "en") {
            await Translator.getInstance().setLanguage("de");
        } else {
            await Translator.getInstance().setLanguage("en");
        }
    });
    languageAction.setLiClass("language-action show-for-medium")
    const languageActionMobile = new MenuAction("language", async () => {
        if (Translator.getInstance().getCurrentLanguage() === "en") {
            await Translator.getInstance().setLanguage("de");
        } else {
            await Translator.getInstance().setLanguage("en");
        }
    }, undefined, 1);
    languageActionMobile.setLiClass("language-action-mobile hide-for-medium")

    NavbarFragment.defaultActions.push(languageAction);
    NavbarFragment.defaultActions.push(languageActionMobile);

    if (Helper.isMobileApp()) {
        NavbarFragment.defaultActions.push(new StartSiteMenuAction("settings", SettingsSite, MenuAction.SHOW_NEVER, 99000));
    }

    NavbarFragment.defaultActions.push(new StartSiteMenuAction("contact", ContactSite, MenuAction.SHOW_NEVER));
    // NavbarFragment.defaultActions.push(new StartSiteMenuAction("privacy policy", ImpressumSite, MenuAction.SHOW_NEVER));
    NavbarFragment.defaultActions.push(new StartSiteMenuAction("imprint", ImpressumSite, MenuAction.SHOW_NEVER));

    NavbarFragment.defaultActions.push(new UserMenuAction("add event", "events", () => {
        app.startSite(ModifyEventSite);
    }, MenuAction.SHOW_FOR_MEDIUM));

    NavbarFragment.defaultActions.push(new UserMenuAction("add church", "organisers", () => {
        app.startSite(ModifyChurchSite);
    }, MenuAction.SHOW_FOR_MEDIUM));

    NavbarFragment.defaultActions.push(new UserMenuAction("add fsj", "fsjs", () => {
        app.startSite(ModifyFsjSite);
    }, MenuAction.SHOW_FOR_MEDIUM));

    // NavbarFragment.defaultActions.push(new UserMenuAction("add post", "posts", () => {
    //     app.startSite(ModifyPostSite);
    // }, MenuAction.SHOW_FOR_MEDIUM));

    DataManager.setHeader("Accept-Language", "de-DE,dias;q=0.5");
    // await SystemCalendar.createCalendar("echo");

    await Sync.getInstance().sync(false);
    UserManager.getInstance().getMe().catch(e => console.error(e));

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

//TODO anpassen
SystemCalendar.NAME = "echo";
SystemCalendar.WEBSITE = "echoapp.de";

DataManager._basePath = __HOST_ADDRESS__ + "/api/v1/";
FileMedium.PUBLIC_PATH = __HOST_ADDRESS__ + "/uploads/img_";
DataManager.onlineCallback = isOnline => {
    if (!isOnline) {
        console.log("not (yet) online!");
    }
};

Object.assign(BaseDatabase.CONNECTION_OPTIONS, {
    logging: ["error", "warn"],
    synchronize: false,
    migrationsRun: true,
    migrations: [
        SetupSchema1000000000000,
        SetupFavorite1000000000001,
        SetupUserManagement1000000001000,
        SetupEasySync1000000000500,
        FavoriteWithSystemCalendar1000000000002,
        FsjSchema1000000006000,
        AddRepeatedEvent1000000007000,
        FavoriteWithoutEventRelation1000000008000,
        ImagesSchema1000000010000,
        ImagesSchemaDownload1000000011000,
        EventWeblink1000000012000,
        ChurchInstalink1000000013000,
    ]
});

EasySyncClientDb.errorListener = async (e) => {
    console.error(e);
    await ClearDatabaseJob.doJob();
    debugger;
    //work with timeout since saving of db only occurs after 150ms in browser
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(window.location.reload(true));
        }, 300);
    });
};

NativeStoragePromise.prefix = "functional_";
NativeStoragePromise.persistent = false;

let app = new App();
app.start(WelcomeSite).catch(e => console.error(e)).then(async () => {
    console.log("initialisation done!", new Date());

    //cookie compliance
    if (device.platform === "browser") {
        if (await CookieConsentHelper.mustAskForConsent()) {
            await CookieConsentHelper.showCookieDialog();
        } else {
            await NativeStoragePromise.makePersistent();
        }
    } else {
        if (await CookieConsentHelper.mustAskForConsent()) {
            await CookieConsentHelper.giveConsentToCookies(["functional", "statistic", "thirdParty"]);
        }
        if (await CookieConsentHelper.hasConsent("functional")) {
            await NativeStoragePromise.makePersistent();
        }
    }

    //For testing purposes
    window["queryDb"] = async (sql) => {
        let res = await EasySyncClientDb.getInstance().rawQuery(sql);
        console.log(res);
        return res;
    }
});
