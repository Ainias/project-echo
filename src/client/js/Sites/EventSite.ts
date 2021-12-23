import { FooterSite } from './FooterSite';
import { App, ButtonChooseDialog, ConfirmDialog, Toast, Translator } from 'cordova-sites';
import { Event } from '../../../shared/model/Event';
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

const view = require('../../html/Sites/eventSite.html');

export class EventSite extends FooterSite {
    private event: Event;
    private isFavorite: boolean;

    constructor(siteManager) {
        super(siteManager, view);
        this.getFooterFragment().setSelected('.icon.calendar');
    }

    async onConstruct(constructParameters) {
        const res = super.onConstruct(constructParameters);
        if (!Helper.isSet(constructParameters, 'id')) {
            new Toast('no id given').show();
            this.finish();
            return undefined;
        }

        const { id } = constructParameters;

        if (typeof id === 'string' && id.startsWith('r')) {
            const parts = id.split('-');

            if (parts.length === 4) {
                const repeatedEvent = await RepeatedEvent.findById(parts[0].substr(1), RepeatedEvent.getRelations());
                this.event = await EventHelper.generateSingleEventFromRepeatedEvent(
                    repeatedEvent,
                    new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]))
                );
            }
        } else {
            const relations = Event.getRelations();
            this.event = await Event.findById(constructParameters.id, relations);
        }

        if (!this.event) {
            new Toast('no event found').show();
            this.finish();
            return undefined;
        }
        this.isFavorite = (await Favorite.findOne({ eventId: this.event.getId(), isFavorite: 1 })) !== null;

        return res;
    }

    async onViewLoaded() {
        const res = super.onViewLoaded();

        const translator = Translator.getInstance();
        translator.addDynamicTranslations(this.event.getDynamicTranslations());

        this.findBy('#event-name').appendChild(translator.makePersistentTranslation(this.event.getNameTranslation()));
        this.findBy('#event-description').appendChild(
            translator.makePersistentTranslation(this.event.getDescriptionTranslation())
        );
        if (this.event.getImages().length > 0) {
            await (<ClientFileMedium>this.event.getImages()[0]).isDownloadedState();
            this.findBy('#event-img').src = this.event.getImages()[0].getUrl();
        }

        // time
        const timeElement = this.findBy('#event-time');
        if (this.event.getStartTime().getFullYear() === this.event.getEndTime().getFullYear()) {
            if (
                this.event.getStartTime().getMonth() === this.event.getEndTime().getMonth() &&
                this.event.getStartTime().getDate() === this.event.getEndTime().getDate()
            ) {
                if (
                    this.event.getStartTime().getHours() === this.event.getEndTime().getHours() &&
                    this.event.getStartTime().getMinutes() === this.event.getEndTime().getMinutes()
                ) {
                    timeElement.innerHTML =
                        DateHelper.strftime('%d. %B ´%y, %H:%M ', this.event.getStartTime()) +
                        translator.makePersistentTranslation('uhr').outerHTML;
                } else {
                    timeElement.innerHTML = `${DateHelper.strftime(
                        '%d. %B ´%y<br/>%H:%M',
                        this.event.getStartTime()
                    )} - ${DateHelper.strftime('%H:%M', this.event.getEndTime())}`;
                }
            } else {
                timeElement.innerHTML = `${DateHelper.strftime(
                    '%d. %b ´%y, %H:%M',
                    this.event.getStartTime()
                )} -<br/>${DateHelper.strftime('%d. %b ´%y, %H:%M', this.event.getEndTime())}`;
            }
        } else {
            timeElement.innerHTML = `${DateHelper.strftime(
                '%d. %b ´%y, %H:%M',
                this.event.getStartTime()
            )} -<br/>${DateHelper.strftime('%d. %b ´%y, %H:%M', this.event.getEndTime())}`;
        }

        // places
        const placesContainer = this.findBy('#places-container');

        let places = this.event.getPlaces();
        let placesAreObject = false;

        if (!Array.isArray(places)) {
            places = Object.keys(places);
            placesAreObject = true;
        }

        await Helper.asyncForEach(places, async (place) => {
            placesContainer.appendChild(
                await PlaceHelper.createPlace(place, placesAreObject ? this.event.getPlaces()[place] : place)
            );
        });

        // favorite
        const favElem = this.findBy('#favorite .favorite');
        if (this.isFavorite) {
            favElem.classList.add('is-favorite');
        }

        favElem.addEventListener('click', async (e) => {
            e.stopPropagation();
            this.showLoadingSymbol();

            const isFavorite = await EventHelper.toggleFavorite(this.event);
            if (isFavorite) {
                favElem.classList.add('is-favorite');
            } else {
                favElem.classList.remove('is-favorite');
            }
            this.isFavorite = isFavorite;
            this.removeLoadingSymbol();
        });

        const tagPanel = this.findBy('#tag-panel');

        const typeTag = document.createElement('span');
        typeTag.classList.add('tag');
        typeTag.appendChild(Translator.makePersistentTranslation(this.event.getType()));
        tagPanel.addEventListener('click', () => {
            this.startSite(SearchSite, { types: this.event.getType() });
        });
        tagPanel.appendChild(typeTag);

        const organisers = this.event.getOrganisers();
        if (Array.isArray(organisers)) {
            organisers.forEach((church) => {
                Translator.addDynamicTranslations(church.getDynamicTranslations());

                const churchTag = document.createElement('span');
                churchTag.classList.add('tag');
                churchTag.appendChild(Translator.makePersistentTranslation(church.getNameTranslation()));
                churchTag.addEventListener('click', () => {
                    this.startSite(SearchSite, { churches: `${church.id}` });
                });

                tagPanel.appendChild(churchTag);
            });
        }

        // Website
        const eventWebsiteElement = this.findBy('#event-website');
        let website = this.event.getWebsite();
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

        this.checkRightsPanel();
        return res;
    }

    private checkRightsPanel() {
        UserManager.getInstance().addLoginChangeCallback((loggedIn, manager) => {
            if (loggedIn && manager.hasAccess(Event.ACCESS_MODIFY)) {
                this.findBy('.admin-panel').classList.remove('hidden');
            } else {
                this.findBy('.admin-panel').classList.add('hidden');
            }
        }, true);

        this.findBy('#delete-event').addEventListener('click', async () => {
            if (UserManager.getInstance().hasAccess(Event.ACCESS_MODIFY)) {
                if (Helper.isNotNull(this.event.getRepeatedEvent())) {
                    const editSeries = await new ButtonChooseDialog('', 'delete event or event series', {
                        '0': 'event',
                        '1': 'series',
                        '2': 'abort',
                    }).show();
                    if (editSeries === '1') {
                        this.showLoadingSymbol();
                        this.event.getRepeatedEvent().delete();
                        new Toast('eventserie wurde erfolgreich gelöscht').show();
                        this.finish();
                        this.removeLoadingSymbol();
                    } else if (editSeries === '0') {
                        this.showLoadingSymbol();
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        if (typeof this.event.id === 'string' && this.event.id.startsWith('r')) {
                            const blockedDay = new BlockedDay();
                            blockedDay.setDay(this.event.getStartTime());
                            blockedDay.getDay().setHours(12);
                            blockedDay.setRepeatedEvent(this.event.getRepeatedEvent());
                            this.event.getRepeatedEvent().blockedDays.push(blockedDay);
                            await blockedDay.save();
                            new Toast('event wurde erfolgreich gelöscht').show();
                            this.finish();
                        } else {
                            this.event.delete();
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
                    await this.event.delete();
                    new Toast('event wurde erfolgreich gelöscht').show();
                    this.finish();
                    this.removeLoadingSymbol();
                }
            }
        });
        this.findBy('#modify-event').addEventListener('click', async () => {
            if (UserManager.getInstance().hasAccess(Event.ACCESS_MODIFY)) {
                if (Helper.isNotNull(this.event.getRepeatedEvent())) {
                    const editSeries = await new ButtonChooseDialog('', 'edit event or event series', {
                        '1': 'event',
                        '2': 'series',
                    }).show();

                    if (editSeries === '2') {
                        this.finishAndStartSite(ModifyEventSite, {
                            id: this.event.getRepeatedEvent().id,
                            isRepeatableEvent: true,
                        });
                    } else if (editSeries === '1') {
                        this.finishAndStartSite(ModifyEventSite, { id: this.event.getId() });
                    }
                } else {
                    this.finishAndStartSite(ModifyEventSite, { id: this.event.getId() });
                }
            }
        });
    }
}

App.addInitialization((app) => {
    app.addDeepLink('event', EventSite);
});
