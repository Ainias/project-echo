const view = require("../../html/Sites/welcomeSite.html");
const componentImg = require("../../img/component.jpg");

import {AbsoluteBarMenuSite} from "./AbsoluteBarMenuSite";
import {Post} from "../../../shared/model/Post";
import {Translator} from "cordova-sites/dist/client/js/Translator";
import {UserManager} from "cordova-sites-user-management/dist/client/js/UserManager";
import {Event} from "../../../shared/model/Event";
import {ConfirmDialog} from "cordova-sites/dist/client/js/Dialog/ConfirmDialog";
import {Toast} from "cordova-sites/dist/client/js/Toast/Toast";
import {ModifyPostSite} from "./ModifyPostSite";
import {DateHelper} from "js-helper";
import {ViewHelper} from "js-helper/dist/client/ViewHelper";
import {EventOverviewFragment} from "../Fragments/EventOverviewFragment";
import {EventHelper} from "../Helper/EventHelper";

export class WelcomeSite extends AbsoluteBarMenuSite {
    private _eventListFragment: EventOverviewFragment;
    private _postTemplate: HTMLElement;
    private _postContainer: HTMLElement;
    private _posts: Post[];

    constructor(siteManager) {
        super(siteManager, view);

        this.getNavbarFragment().setCanGoBack(false);
        this.footerFragment.setSelected(".icon.home");
        console.log("img", componentImg);
        this.getNavbarFragment().setBackgroundImage(componentImg);

        this._eventListFragment = new EventOverviewFragment(this);
        this.addFragment("#favorite-list", this._eventListFragment);

    }

    async onViewLoaded() {
        let res = super.onViewLoaded();

        this._postTemplate = this.findBy("#post-template");
        this._postTemplate.remove();
        this._postTemplate.removeAttribute("id");

        this._postContainer = this.findBy("#post-container");

        const spoiler = this.findBy(".text-spoiler");
        spoiler.addEventListener("click", () => spoiler.classList.toggle("open"));

        return res;
    }

    async onStart(pauseArguments) {
        this._posts = await Post.find(undefined, {
            priority: "DESC",
            createdAt: "ASC"
        });

        this._posts = [];
        ViewHelper.removeAllChildren(this._postContainer);

        this._posts.forEach(post => {
            Translator.getInstance().addDynamicTranslations(post.getDynamicTranslations());

            let postElem = <HTMLElement>this._postTemplate.cloneNode(true);
            postElem.querySelector(".text").appendChild(Translator.getInstance().makePersistentTranslation(post.getTextTranslation()));
            (postElem.querySelector(".date") as HTMLElement).innerText = DateHelper.strftime("%d.%m.%y", post.createdAt);
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
        Translator.getInstance().updateTranslations(this._postContainer);


        //Load events of next Week
        let now = new Date();

        let inOneWeek = new Date();
        inOneWeek.setDate(now.getDate() + 7);
        inOneWeek.setHours(0);
        inOneWeek.setMinutes(0);
        inOneWeek.setSeconds(0);
        inOneWeek.setMilliseconds(0);
        // inOneWeek.setSeconds(-1);

        let events = await EventHelper.search("", DateHelper.strftime("%Y-%m-%d", now), DateHelper.strftime("%Y-%m-%d", inOneWeek), undefined, undefined, undefined, true);
        // if (events.length > 1){
        //     events = [events[0]];
        // }

        //TODO show favorites instead of next Events?

        // let favorites = await Favorite.find({
        //     isFavorite: true,
        // }, undefined, undefined, undefined);
        // let events = await Favorite.getEvents(favorites);
        //
        // let now = new Date().getTime();
        //
        // const SHOW_MAX_FAVORITES = 5;
        // events = events.filter(e => e.getEndTime().getTime() > now).sort((a,b) => a.getStartTime() - b.getStartTime())
        //     .filter((e,i) => i < SHOW_MAX_FAVORITES);

        this._eventListFragment.setShowMaxEvents(1);
        this._eventListFragment.setEvents(events);
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
