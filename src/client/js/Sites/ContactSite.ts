import {MenuFooterSite} from "./MenuFooterSite";

const view  = require("../../html/Sites/contactSite.html")

import {App} from "cordova-sites/dist/client/js/App";
import {Form} from "cordova-sites/dist/client";
import {DataManager} from "cordova-sites/dist/client/js/DataManager";
import {Toast} from "cordova-sites/dist/client/js/Toast/Toast";
import {Translator} from "cordova-sites/dist/client/js/Translator";

export class ContactSite extends MenuFooterSite {
    constructor(siteManager) {
        super(siteManager, view);
    }

    onViewLoaded() {
        let res = super.onViewLoaded();

        // @ts-ignore
        this.findBy("#contactText").appendChild(Translator.makePersistentTranslation("contact text", [__CONTACT_EMAIL__]))

        new Form(this.findBy("#contact-form"), async values => {
            let result = await DataManager.send("contact", values);
            if (result.success) {
                new Toast("Die Nachricht wurde gesendet!").show();
                this.finish();
            } else {
                if (result) {
                    new Toast(result.message).show();
                } else {
                    new Toast("Es ist ein Fehler aufgetreten...").show();
                }
            }
        });

        return res;
    }
}

App.addInitialization((app) => {
    app.addDeepLink("contact", ContactSite);
});
