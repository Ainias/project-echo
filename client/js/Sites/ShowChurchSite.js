import view from "../../html/Sites/showChurchSite.html"
import {App, ColorIndicator, Helper, MenuSite, Toast, Translator} from "cordova-sites";
import {Church} from "../../../model/Church";
import {MenuFooterSite} from "./MenuFooterSite";
import {AbsoluteBarMenuSite} from "./AbsoluteBarMenuSite";

export class ShowChurchSite extends AbsoluteBarMenuSite {
    constructor(siteManager) {
        super(siteManager, view);
        this._footerFragment.setSelected(".icon.home");
    }

    async onConstruct(constructParameters) {
        let res = super.onConstruct(constructParameters);

        if (Helper.isNull(constructParameters) || Helper.isNull(constructParameters["id"])) {
            new Toast("no id given").show();
            this.finish();
        }

        /** @var {Church} */
        this._church = await Church.findById(parseInt(constructParameters["id"]));

        if (Helper.isNull(this._church)) {
            new Toast("no church found").show();
            this.finish();
        }

        //Image
        let images = this._church.images;
        if (images.length > 0) {
            this._navbarFragment.setBackgroundImage(images[0]);
        }

        return res;
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();

        let translator = Translator.getInstance();
        translator.addDynamicTranslations(this._church.getDynamicTranslations());

        //name
        this.findBy("#name").appendChild(translator.makePersistentTranslation(this._church.getNameTranslation(), true));

        //description
        this.findBy("#description").appendChild(translator.makePersistentTranslation(this._church.getDescriptionTranslation(), true));

        //link
        let link = this.findBy("#website");

        let href = this._church.website;
        if (!href.startsWith("http") && !href.startsWith("//")) {
            href = "//" + href;
        }
        link.href = href;
        link.appendChild(document.createTextNode(this._church.website));

        //places
        let placesContainer = this.findBy("#places-container");
        let placeTemplate = placesContainer.querySelector(".place");
        placeTemplate.remove();

        this._church.places.forEach(place => {
            let placeElement = placeTemplate.cloneNode(true);
            placeElement.querySelector(".place-name").innerText = place;
            placesContainer.appendChild(placeElement);
        });

        return res;
    }
}

App.addInitialization((app) => {
    app.addDeepLink("church", ShowChurchSite);
});