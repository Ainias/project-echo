import {AbsoluteBarMenuSite} from "./AbsoluteBarMenuSite";

import view from "../../html/Sites/showChurchSite.html"
import {Helper, Toast, Translator} from "cordova-sites";
import {Church} from "../../../model/Church";

export class ShowChurchSite extends AbsoluteBarMenuSite {
    constructor(siteManager) {
        super(siteManager, view);
    }

    async onConstruct(constructParameters) {
        let res = super.onConstruct(constructParameters);

        if (Helper.isNull(constructParameters) || Helper.isNull(constructParameters["id"])) {
            new Toast("no id given").show();
            this.finish();
        }

        this._church = await Church.selectOne({"id": parseInt(constructParameters["id"])});
        console.log(this._church);

        return res;
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();

        //Image
        let images = this._church.getImages();
        if (images.length > 0) {
            let titleImg = this.findBy("#title-image");
            titleImg.src = images[0];
        }

        //Translations
        let churchId = this._church.getId();

        let translations = {};
        let names = this._church.getNames();
        Object.keys(names).forEach(language => {
            translations[language] = Helper.nonNull(translations[language], {});
            translations[language]["church-name-"+churchId] = names[language];
        });

        let descriptions = this._church.getDescriptions();
        Object.keys(descriptions).forEach(language => {
            translations[language] = Helper.nonNull(translations[language], {});
            translations[language]["church-description-"+churchId] = descriptions[language];
        });

        let translator = Translator.getInstance();
        translator.addDynamicTranslations(translations);

        //name
        this.findBy("#name").appendChild(translator.makePersistentTranslation("church-name-"+churchId));

        //description
        this.findBy("#description").appendChild(translator.makePersistentTranslation("church-description-"+churchId));

        //link
        let link = this.findBy("#website");

        let href =this._church.getWebsite();
        if (!href.startsWith("http") && !href.startsWith("//"))
        {
            href = "//"+href;
        }
        link.href = href;
        link.appendChild(document.createTextNode(this._church.getWebsite()));

        return res;
    }
}