
import translationGerman from '../translations/de.json';
import translationEnglish from '../translations/en.json';
import {App, StartSiteMenuAction, Translator, NavbarFragment, DataManager, MenuAction, Menu} from "cordova-sites";
import {EasySyncClientDb, SyncJob} from "cordova-sites-easy-sync/client";
import {EasySync} from "cordova-sites-easy-sync/model";

import {WelcomeSite} from "./Sites/WelcomeSite";
import {Event} from "../../model/Event";
import {Church} from "../../model/Church";
import {ShowChurchSite} from "./Sites/ShowChurchSite";

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
    NavbarFragment.defaultActions.push(new StartSiteMenuAction("churches", [ShowChurchSite, {"id":7}]));
    NavbarFragment.defaultActions.push(new StartSiteMenuAction("about us", WelcomeSite));
    NavbarFragment.defaultActions.push(new MenuAction("language", async () => {
        if (Translator.getInstance().getCurrentLanguage() === "en"){
            await Translator.getInstance().setLanguage("de");
        }
        else {
            await Translator.getInstance().setLanguage("en");
        }
    }, MenuAction.SHOW_FOR_LARGE));
    NavbarFragment.defaultActions.push(new StartSiteMenuAction("contact", WelcomeSite, MenuAction.SHOW_NEVER));
    NavbarFragment.defaultActions.push(new StartSiteMenuAction("privacy policy", WelcomeSite, MenuAction.SHOW_NEVER));
    NavbarFragment.defaultActions.push(new StartSiteMenuAction("imprint", WelcomeSite, MenuAction.SHOW_NEVER));

    //Todo an richtige stelle auslagern
    await new SyncJob().sync([Church, Event])
});

EasySyncClientDb._easySync = EasySync;
DataManager._basePath = "http://127.0.0.1:3000/api/v1/";

let app = new App();
app.start(WelcomeSite);
