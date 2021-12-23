import { AbsoluteBarMenuSite } from './AbsoluteBarMenuSite';
import { Post } from '../../../shared/model/Post';
import { Translator } from 'cordova-sites/dist/client/js/Translator';
import { UserManager } from 'cordova-sites-user-management/dist/client/js/UserManager';
import { Event } from '../../../shared/model/Event';
import { ConfirmDialog } from 'cordova-sites/dist/client/js/Dialog/ConfirmDialog';
import { Toast } from 'cordova-sites/dist/client/js/Toast/Toast';
import { ModifyPostSite } from './ModifyPostSite';
import { DateHelper } from 'js-helper';
import { ViewHelper } from 'js-helper/dist/client/ViewHelper';
import { EventOverviewFragment } from '../Fragments/EventOverviewFragment';
import { EventHelper } from '../Helper/EventHelper';

const view = require('../../html/Sites/welcomeSite.html');
const componentImg = require('../../img/component.jpg');

export class WelcomeSite extends AbsoluteBarMenuSite {
    private eventListFragment: EventOverviewFragment;
    private postTemplate: HTMLElement;
    private postContainer: HTMLElement;
    private posts: Post[];

    constructor(siteManager) {
        super(siteManager, view);

        this.getNavbarFragment().setCanGoBack(false);
        this.footerFragment.setSelected('.icon.home');
        this.getNavbarFragment().setBackgroundImage(componentImg);

        this.eventListFragment = new EventOverviewFragment(this);
        this.addFragment('#favorite-list', this.eventListFragment);
    }

    async onViewLoaded() {
        const res = super.onViewLoaded();

        this.postTemplate = this.findBy('#post-template');
        this.postTemplate.remove();
        this.postTemplate.removeAttribute('id');

        this.postContainer = this.findBy('#post-container');

        const spoiler = this.findBy('.text-spoiler');
        spoiler.addEventListener('click', () => spoiler.classList.toggle('open'));

        return res;
    }

    async onStart() {
        this.posts = <Post[]>await Post.find(undefined, {
            priority: 'DESC',
            createdAt: 'ASC',
        });

        this.posts = [];
        ViewHelper.removeAllChildren(this.postContainer);

        this.posts.forEach((post) => {
            Translator.getInstance().addDynamicTranslations(post.getDynamicTranslations());

            const postElem = <HTMLElement>this.postTemplate.cloneNode(true);
            postElem
                .querySelector('.text')
                .appendChild(Translator.getInstance().makePersistentTranslation(post.getTextTranslation()));
            (postElem.querySelector('.date') as HTMLElement).innerText = DateHelper.strftime(
                '%d.%m.%y',
                post.createdAt
            );
            postElem.querySelector('.delete-button').addEventListener('click', async () => {
                if (UserManager.getInstance().hasAccess(Event.ACCESS_MODIFY)) {
                    if (
                        await new ConfirmDialog(
                            'Möchtest du den Post wirklich löschen? Er wird unwiederbringlich verloren gehen!',
                            'Post löschen?'
                        ).show()
                    ) {
                        await post.delete();
                        new Toast('Post  wurde erfolgreich gelöscht').show();
                        this.finishAndStartSite(WelcomeSite);
                    }
                }
            });
            postElem.querySelector('.modify-button').addEventListener('click', () => {
                if (UserManager.getInstance().hasAccess(Post.ACCESS_MODIFY)) {
                    this.startSite(ModifyPostSite, { id: post.id });
                }
            });

            this.postContainer.appendChild(postElem);
        });
        this.checkRightsPanel();
        Translator.getInstance().updateTranslations(this.postContainer);

        // Load events of next Week
        const now = new Date();

        const inOneWeek = new Date();
        inOneWeek.setDate(now.getDate() + 7);
        inOneWeek.setHours(0);
        inOneWeek.setMinutes(0);
        inOneWeek.setSeconds(0);
        inOneWeek.setMilliseconds(0);
        // inOneWeek.setSeconds(-1);

        const events = await EventHelper.search(
            '',
            DateHelper.strftime('%Y-%m-%d', now),
            DateHelper.strftime('%Y-%m-%d', inOneWeek),
            undefined,
            undefined,
            undefined,
            true
        );
        // if (events.length > 1){
        //     events = [events[0]];
        // }

        // TODO show favorites instead of next Events?

        // let favorites = await Favorite.find({
        //     isFavorite: 1,
        // }, undefined, undefined, undefined);
        // let events = await Favorite.getEvents(favorites);
        //
        // let now = new Date().getTime();
        //
        // const SHOW_MAX_FAVORITES = 5;
        // events = events.filter(e => e.getEndTime().getTime() > now).sort((a,b) => a.getStartTime() - b.getStartTime())
        //     .filter((e,i) => i < SHOW_MAX_FAVORITES);

        this.eventListFragment.setShowMaxEvents(1);
        this.eventListFragment.setEvents(events);
    }

    checkRightsPanel() {
        UserManager.getInstance().addLoginChangeCallback((loggedIn, manager) => {
            if (loggedIn && manager.hasAccess(Event.ACCESS_MODIFY)) {
                this.findBy('.admin-panel', true).forEach((elem) => elem.classList.remove('hidden'));
            } else {
                this.findBy('.admin-panel', true).forEach((elem) => elem.classList.add('hidden'));
            }
        }, true);
    }
}
