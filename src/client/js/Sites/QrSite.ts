import {MyMenuSite} from "./MyMenuSite";
import {App} from "cordova-sites";
import {EchoIntroductionSite} from "./EchoIntroductionSite";

const view = require("../../html/Sites/qrSite.html")

export class QrSite extends MyMenuSite{

    private static readonly LINK = "https://echoapp.de?s=echo";

    constructor(siteManager: any) {
        super(siteManager, view);
    }

    onViewLoaded(): Promise<any[]> {
        const res = super.onViewLoaded();
        (<HTMLLinkElement>this.find("#redirect-link")).href = QrSite.LINK;
        this.finishAndStartSite(EchoIntroductionSite);
        return res;
    }

    async onStart(pauseArguments: any): Promise<void> {
        const res = await super.onStart(pauseArguments);
        // window.location.replace(QrSite.LINK);
        return res;
    }
}

App.addInitialization((app) => {
    app.addDeepLink("qr", QrSite);
});
