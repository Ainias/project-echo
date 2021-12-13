import { FooterSite } from './FooterSite';
import { App, ButtonChooseDialog, ConfirmDialog, Toast, Translator } from 'cordova-sites';
import { Event } from '../../../shared/model/Event';

const view = require('../../html/Sites/eventSite.html');
import { Favorite } from '../Model/Favorite';
import { PlaceHelper } from '../Helper/PlaceHelper';
import { UserManager } from 'cordova-sites-user-management/dist/client';
import { ModifyEventSite } from './ModifyEventSite';
import { EventHelper } from '../Helper/EventHelper';
import { SearchSite } from './SearchSite';
import { Helper } from 'js-helper';
import { DateHelper } from 'js-helper/dist/shared/DateHelper';
import { RepeatedEvent } from '../../../shared/model/RepeatedEvent';
import { BlockedDay } from '../../../shared/model/BlockedDay';
import { ClientFileMedium } from 'cordova-sites-easy-sync';

export class EventSite extends FooterSite {
    private _event: Event;
    private _isFavorite: boolean;

    constructor(siteManager) {
        super(siteManager, view);
        this.getFooterFragment().setSelected('.icon.calendar');
    }

    async onConstruct(constructParameters) {
        let res = super.onConstruct(constructParameters);
        if (!Helper.isSet(constructParameters, 'id')) {
            new Toast('no id given').show();
            this.finish();
            return;
        }

        let id = constructParameters['id'];

        if (typeof id === 'string' && id.startsWith('r')) {
            let parts = id.split('-');

            if (parts.length === 4) {
                let repeatedEvent = await RepeatedEvent.findById(parts[0].substr(1), RepeatedEvent.getRelations());
                this._event = await EventHelper.generateSingleEventFromRepeatedEvent(
                    repeatedEvent,
                    new Date(parseInt(parts[1]), parseInt(parts[2]) - 1, parseInt(parts[3]))
                );
            }
        } else {
            let relations = Event.getRelations();
            this._event = await Event.findById(constructParameters['id'], relations);
        }

        if (!this._event) {
            new Toast('no event found').show();
            this.finish();
            return;
        }
        this._isFavorite = (await Favorite.findOne({ eventId: this._event.getId(), isFavorite: true })) !== null;

        return res;
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();

        let translator = Translator.getInstance();
        translator.addDynamicTranslations(this._event.getDynamicTranslations());

        this.findBy('#event-name').appendChild(translator.makePersistentTranslation(this._event.getNameTranslation()));
        this.findBy('#event-description').appendChild(
            translator.makePersistentTranslation(this._event.getDescriptionTranslation())
        );
        if (this._event.getImages().length > 0) {
            await (<ClientFileMedium>this._event.getImages()[0]).isDownloadedState();
            this.findBy('#event-img').src = this._event.getImages()[0].getUrl();
        }

        //time
        let timeElement = this.findBy('#event-time');
        if (this._event.getStartTime().getFullYear() === this._event.getEndTime().getFullYear()) {
            if (
                this._event.getStartTime().getMonth() === this._event.getEndTime().getMonth() &&
                this._event.getStartTime().getDate() === this._event.getEndTime().getDate()
            ) {
                if (
                    this._event.getStartTime().getHours() === this._event.getEndTime().getHours() &&
                    this._event.getStartTime().getMinutes() === this._event.getEndTime().getMinutes()
                ) {
                    timeElement.innerHTML =
                        DateHelper.strftime('%d. %B ´%y, %H:%M ', this._event.getStartTime()) +
                        translator.makePersistentTranslation('uhr').outerHTML;
                } else {
                    timeElement.innerHTML =
                        DateHelper.strftime('%d. %B ´%y<br/>%H:%M', this._event.getStartTime()) +
                        ' - ' +
                        DateHelper.strftime('%H:%M', this._event.getEndTime());
                }
            } else {
                timeElement.innerHTML =
                    DateHelper.strftime('%d. %b ´%y, %H:%M', this._event.getStartTime()) +
                    ' -<br/>' +
                    DateHelper.strftime('%d. %b ´%y, %H:%M', this._event.getEndTime());
            }
        } else {
            timeElement.innerHTML =
                DateHelper.strftime('%d. %b ´%y, %H:%M', this._event.getStartTime()) +
                ' -<br/>' +
                DateHelper.strftime('%d. %b ´%y, %H:%M', this._event.getEndTime());
        }

        //places
        let placesContainer = this.findBy('#places-container');

        let places = this._event.getPlaces();
        let placesAreObject = false;

        if (!Array.isArray(places)) {
            places = Object.keys(places);
            placesAreObject = true;
        }

        await Helper.asyncForEach(places, async (place) => {
            placesContainer.appendChild(
                await PlaceHelper.createPlace(place, placesAreObject ? this._event.getPlaces()[place] : place)
            );
        });

        //favorite
        let favElem = this.findBy('#favorite .favorite');
        if (this._isFavorite) {
            favElem.classList.add('is-favorite');
        }

        favElem.addEventListener('click', async (e) => {
            e.stopPropagation();
            this.showLoadingSymbol();

            let isFavorite = await EventHelper.toggleFavorite(this._event);
            if (isFavorite) {
                favElem.classList.add('is-favorite');
            } else {
                favElem.classList.remove('is-favorite');
            }
            this._isFavorite = isFavorite;
            this.removeLoadingSymbol();
        });

        let tagPanel = this.findBy('#tag-panel');

        let typeTag = document.createElement('span');
        typeTag.classList.add('tag');
        typeTag.appendChild(Translator.makePersistentTranslation(this._event.getType()));
        tagPanel.addEventListener('click', () => {
            this.startSite(SearchSite, { types: this._event.getType() });
        });
        tagPanel.appendChild(typeTag);

        let organisers = this._event.getOrganisers();
        if (Array.isArray(organisers)) {
            organisers.forEach((church) => {
                Translator.addDynamicTranslations(church.getDynamicTranslations());

                let churchTag = document.createElement('span');
                churchTag.classList.add('tag');
                churchTag.appendChild(Translator.makePersistentTranslation(church.getNameTranslation()));
                churchTag.addEventListener('click', () => {
                    this.startSite(SearchSite, { churches: church.id + '' });
                });

                tagPanel.appendChild(churchTag);
            });
        }

        //Website
        const eventWebsiteElement = this.findBy('#event-website');
        let website = this._event.getWebsite();
        if (website) {
            eventWebsiteElement.href = website;
            if (website.startsWith('http://')) {
                website = website.substring(7);
            } else if (website.startsWith('https://')) {
                website = website.substring(8);
            }
            eventWebsiteElement.innerText = website;
        } else {
            eventWebsiteElement.remove();
        }

        this._checkRightsPanel();
        return res;
    }

    _checkRightsPanel() {
        UserManager.getInstance().addLoginChangeCallback((loggedIn, manager) => {
            if (loggedIn && manager.hasAccess(Event.ACCESS_MODIFY)) {
                this.findBy('.admin-panel').classList.remove('hidden');
            } else {
                this.findBy('.admin-panel').classList.add('hidden');
            }
        }, true);

        this.findBy('#delete-event').addEventListener('click', async () => {
            if (UserManager.getInstance().hasAccess(Event.ACCESS_MODIFY)) {
                if (Helper.isNotNull(this._event.getRepeatedEvent())) {
                    let editSeries = await new ButtonChooseDialog('', 'delete event or event series', {
                        '0': 'event',
                        '1': 'series',
                        '2': 'abort',
                    }).show();
                    if (editSeries === '1') {
                        this.showLoadingSymbol();
                        this._event.getRepeatedEvent().delete();
                        new Toast('eventserie wurde erfolgreich gelöscht').show();
                        this.finish();
                        this.removeLoadingSymbol();
                    } else if (editSeries === '0') {
                        this.showLoadingSymbol();
                        // @ts-ignore
                        if (typeof this._event.id === 'string' && this._event.id.startsWith('r')) {
                            let blockedDay = new BlockedDay();
                            blockedDay.setDay(this._event.getStartTime());
                            blockedDay.getDay().setHours(12);
                            blockedDay.setRepeatedEvent(this._event.getRepeatedEvent());
                            this._event.getRepeatedEvent().blockedDays.push(blockedDay);
                            await blockedDay.save();
                            new Toast('event wurde erfolgreich gelöscht').show();
                            this.finish();
                        } else {
                            this._event.delete();
                            new Toast('event wurde erfolgreich gelöscht').show();
                            this.finish();
                        }
                        this.removeLoadingSymbol();
                    }
                } else if (
                    await new ConfirmDialog(
                        'möchtest du das Event wirklich löschen? Es wird unwiederbringlich verloren gehen!',
                        'Event löschen?'
                    ).show()
                ) {
                    this.showLoadingSymbol();
                    await this._event.delete();
                    new Toast('event wurde erfolgreich gelöscht').show();
                    this.finish();
                    this.removeLoadingSymbol();
                }
            }
        });
        this.findBy('#modify-event').addEventListener('click', async () => {
            if (UserManager.getInstance().hasAccess(Event.ACCESS_MODIFY)) {
                if (Helper.isNotNull(this._event.getRepeatedEvent())) {
                    let editSeries = await new ButtonChooseDialog('', 'edit event or event series', {
                        '1': 'event',
                        '2': 'series',
                    }).show();

                    if (editSeries === '2') {
                        this.finishAndStartSite(ModifyEventSite, {
                            id: this._event.getRepeatedEvent().id,
                            isRepeatableEvent: true,
                        });
                    } else if (editSeries === '1') {
                        this.finishAndStartSite(ModifyEventSite, { id: this._event.getId() });
                    }
                } else {
                    this.finishAndStartSite(ModifyEventSite, { id: this._event.getId() });
                }
            }
        });
    }
}

App.addInitialization((app) => {
    app.addDeepLink('event', EventSite);
});
