import {MenuFooterSite} from "./MenuFooterSite";
import view from "../../html/Sites/modifyFsjSite.html";
import {App, Form, Helper, Translator} from "cordova-sites";
import {Church} from "../../../shared/model/Church";
import {UserSite} from "cordova-sites-user-management/dist/client/js/Context/UserSite";
import CKEditor from "@ckeditor/ckeditor5-build-classic";
import {CONSTANTS} from "../CONSTANTS";
import {Fsj} from "../../../shared/model/Fsj";
import {ShowFsjSite} from "./ShowFsjSite";
import {FileMedium} from "cordova-sites-easy-sync/dist/shared";

export class ModifyFsjSite extends MenuFooterSite {
    constructor(siteManager) {
        super(siteManager, view);
        this.addDelegate(new UserSite(this, "admin"));
    }

    async onConstruct(constructParameters) {
        let res = super.onConstruct(constructParameters);

        this._fsj = null;
        if (constructParameters["id"]) {
            this._fsj = await Fsj.findById(constructParameters["id"], Fsj.getRelations());
        }
        this._placeNumber = 0;

        return res;
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();

        let imageInput = this.findBy("#event-image-input");
        imageInput.addEventListener("change", () => {
            if (imageInput.files && imageInput.files[0]) {
                let reader = new FileReader();
                reader.onload = e => {
                    this.findBy("#event-image").src = e.target.result;
                };
                reader.readAsDataURL(imageInput.files[0]);
            }
        });

        this._form = new Form(this.findBy("#modify-fsj-form"), async values => {
            this.showLoadingSymbol();

            let names = {};
            let descriptions = {};
            let imageSrc = (!Helper.imageUrlIsEmpty(values["image"])?values["image"]: values["image-before"]);

            Object.keys(values).forEach(valName => {
                if (valName.startsWith("name-")) {
                    names[valName.split("-")[1]] = values[valName];
                }
                if (valName.startsWith("description-")) {
                    descriptions[valName.split("-")[1]] = values[valName];
                }
            });

            let fsj = null;
            if (this._fsj) {
                fsj = this._fsj;
            } else {
                fsj = new Fsj();
            }

            let img = null;
            if (fsj.images && fsj.images.length >= 0){
                img = fsj.images[0];
            }
            else {
                img = new FileMedium();
            }

            img.src = imageSrc;
            await img.save();

            fsj.names = names;
            fsj.descriptions = descriptions;
            fsj.website = values["website-url"];
            fsj.images = [img];

            await fsj.save();

            this.finishAndStartSite(ShowFsjSite, {
                id: fsj.id
            });
        });

        this.findBy(".editor", true).forEach(async e => {
            this._form.addEditor(await CKEditor.create(e, CONSTANTS.CK_EDITOR_CONFIG));
        });

        await this.setFormValuesFromFsj();

        return res;
    }

    async setFormValuesFromFsj() {
        if (Helper.isNull(this._fsj) || !this._fsj instanceof Fsj) {
            return;
        }

        let values = {};

        let names = this._fsj.names;
        Object.keys(names).forEach(lang => {
            values["name-" + lang] = names[lang];
        });

        let descriptions = this._fsj.descriptions;
        Object.keys(descriptions).forEach(lang => {
            values["description-" + lang] = descriptions[lang];
        });

        values["website-url"] = this._fsj.website;

        this.findBy("#event-image").src = this._fsj.images[0];
        this.findBy("input[type='hidden'][name='image-before']").value = this._fsj.images[0];
        this.findBy("input[type='file'][name='image']").removeAttribute("required");

        await this._form.setValues(values);
    }
}

App.addInitialization((app) => {
    app.addDeepLink("modifyFsj", ModifyFsjSite);
});