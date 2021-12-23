import view from '../../html/Sites/favoritesSite.html';
import { FooterSite } from './FooterSite';
import { App } from 'cordova-sites';
import { Favorite } from '../Model/Favorite';
import { EventOverviewFragment } from '../Fragments/EventOverviewFragment';

export class FavoritesSite extends FooterSite {
    constructor(siteManager) {
        super(siteManager, view);
        this.eventListFragment = new EventOverviewFragment(this);
        this.addFragment('#favorite-list', this.eventListFragment);
        this.getFooterFragment().setSelected('.icon.favorites');
    }

    async onStart(pauseArguments) {
        const res = super.onStart(pauseArguments);

        const favorites = await Favorite.find({ isFavorite: 1 }, undefined, undefined, undefined);
        const events = await Favorite.getEvents(favorites);

        this.eventListFragment.setEvents(events);

        return res;
    }
}

App.addInitialization((app) => {
    app.addDeepLink('favorites', FavoritesSite);
});
