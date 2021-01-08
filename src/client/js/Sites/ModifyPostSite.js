import {MenuFooterSite} from "./MenuFooterSite";
import view from "../../html/Sites/modifyPostSite.html";
import {App, Form, Helper} from "cordova-sites";
import {Church} from "../../../shared/model/Church";
import {UserSite} from "cordova-sites-user-management/dist/client/js/Context/UserSite";
import {Region} from "../../../shared/model/Region";
import CKEditor from "@ckeditor/ckeditor5-build-classic";
import {CONSTANTS} from "../CONSTANTS";
import {Post} from "../../../shared/model/Post";

export class ModifyPostSite extends MenuFooterSite {
    constructor(siteManager) {
        super(siteManager, view);
        this.addDelegate(new UserSite(this, "posts"));
    }

    async onConstruct(constructParameters) {
        let res = super.onConstruct(constructParameters);

        this._post = null;
        if (constructParameters["id"]) {
            this._post = await Post.findById(constructParameters["id"], Church.getRelations());
            console.log(this._post);
        }
        this._placeNumber = 0;

        return res;
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();

        this._form = new Form(this.findBy("#modify-post-form"), async values => {

            this.showLoadingSymbol();

            let texts = {};
            let regions = [await Region.findById(1)];

            Object.keys(values).forEach(valName => {
                if (valName.startsWith("text-")) {
                    texts[valName.split("-")[1]] = values[valName];
                }
            });

            let post = null;
            if (this._post) {
                post = this._post
            } else {
                post = new Post;
            }
            post.texts = texts;
            post.regions = regions;
            post.priority = parseInt(values["priority"]);

            await post.save();
            this.removeLoadingSymbol();
            this.finish();
        });

        this.findBy(".editor", true).forEach(async e => {
            this._form.addEditor(await CKEditor.create(e, CONSTANTS.CK_EDITOR_POST_CONFIG));
        });

        await this.setFormValuesFromPost();

        return res;
    }

    async setFormValuesFromPost() {
        if (Helper.isNull(this._post) || !this._post instanceof Post) {
            return;
        }

        let values = {};

        let texts = this._post.texts;
        Object.keys(texts).forEach(lang => {
            values["text-" + lang] = texts[lang];
        });
        values["priority"] = this._post.priority;
        console.log(values);

        await this._form.setValues(values);
    }
}

App.addInitialization((app) => {
    app.addDeepLink("modifyPost", ModifyPostSite);
});
