import view from "../../html/Sites/welcomeSite.html";
import {AbsoluteBarMenuSite} from "./AbsoluteBarMenuSite";
import componentImg from "../../img/component.png"
import {Post} from "../../../model/Post";
import {Translator} from "cordova-sites/src/client/js/Translator";
import {Helper} from "cordova-sites/dist/cordova-sites";
import {UserManager} from "cordova-sites-user-management/src/client/js/UserManager";
import {Event} from "../../../model/Event";
import {ConfirmDialog} from "cordova-sites/src/client/js/Dialog/ConfirmDialog";
import {Toast} from "cordova-sites/src/client/js/Toast/Toast";
import {ModifyPostSite} from "./ModifyPostSite";

export class WelcomeSite extends AbsoluteBarMenuSite {

    constructor(siteManager) {
        super(siteManager, view);
        this._navbarFragment.setCanGoBack(false);
        this._footerFragment.setSelected(".icon.home");
        this._navbarFragment.setBackgroundImage(componentImg);
    }

    async onConstruct(constructParameters) {
        let res = super.onConstruct(constructParameters);
        this._posts = await Post.find(undefined, {
            priority: "DESC",
            createdAt: "ASC"
        });
        return res;
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();

        this._postTemplate = this.findBy("#post-template");
        this._postTemplate.remove();
        this._postTemplate.removeAttribute("id");

        this._postContainer = this.findBy("#post-container");

        this._posts.forEach(post => {
            Translator.getInstance().addDynamicTranslations(post.getDynamicTranslations());

            let postElem = this._postTemplate.cloneNode(true);
            postElem.querySelector(".text").appendChild(Translator.getInstance().makePersistentTranslation(post.getTextTranslation()));
            postElem.querySelector(".date").innerText = Helper.strftime("%d.%m.%y, %H:%M", post.createdAt);
            postElem.querySelector(".delete-button").addEventListener("click", async () => {
                if (UserManager.getInstance().hasAccess(Event.ACCESS_MODIFY)) {
                    if (await new ConfirmDialog("Möchtest du den Post wirklich löschen? Er wird unwiederbringlich verloren gehen!", "Post löschen?").show()) {
                        await post.delete();
                        new Toast("Post  wurde erfolgreich gelöscht").show();
                        this.finishAndStartSite(WelcomeSite);
                    }
                }
            });
            postElem.querySelector(".modify-button").addEventListener("click", () => {
                if (UserManager.getInstance().hasAccess(Post.ACCESS_MODIFY)) {
                    this.startSite(ModifyPostSite, {id: post.id});
                }
            });

            this._postContainer.appendChild(postElem);
        });

        this._checkRightsPanel();
        return res;
    }

    _checkRightsPanel() {
        UserManager.getInstance().addLoginChangeCallback((loggedIn, manager) => {
            if (loggedIn && manager.hasAccess(Event.ACCESS_MODIFY)) {
                this.findBy(".admin-panel", true).forEach(elem => elem.classList.remove("hidden"));
            } else {
                this.findBy(".admin-panel", true).forEach(elem => elem.classList.add("hidden"));
            }
        }, true);
    }
}