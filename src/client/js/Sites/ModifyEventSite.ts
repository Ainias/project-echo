import { MenuFooterSite } from './MenuFooterSite';
import { App, Form, Translator, Helper, Toast } from 'cordova-sites';
import { Church } from '../../../shared/model/Church';
import { Event } from '../../../shared/model/Event';
import { Region } from '../../../shared/model/Region';
import { EventSite } from './EventSite';
import flatpickr from 'flatpickr';
import { UserSite } from 'cordova-sites-user-management/dist/client/js/Context/UserSite';
import { PlaceHelper } from '../Helper/PlaceHelper';
import CKEditor from '@ckeditor/ckeditor5-build-classic';
import { CONSTANTS } from '../CONSTANTS';
import { RepeatedEvent } from '../../../shared/model/RepeatedEvent';
import { German } from 'flatpickr/dist/l10n/de';
import { DateHelper } from 'js-helper/dist/shared/DateHelper';
import { EventHelper } from '../Helper/EventHelper';
import { BlockedDay } from '../../../shared/model/BlockedDay';
import { FileMedium } from 'cordova-sites-easy-sync/dist/shared/FileMedium';

const view = require('../../html/Sites/addEventSite.html');

export class ModifyEventSite extends MenuFooterSite {
    private churches: Church[];
    private event: Event | RepeatedEvent;
    private blockedDay: Date;
    private placeNumber: number;
    private placesContainer: HTMLElement;
    private placesLineTemplate: HTMLElement;
    private placePreview: HTMLIFrameElement;
    private form: Form;
    private repeatableSectionElement: HTMLElement;
    private repeatableCheckbox: HTMLInputElement;

    constructor(siteManager) {
        super(siteManager, view);
        this.addDelegate(new UserSite(this, 'events'));
    }

    async onConstruct(constructParameters) {
        const res = super.onConstruct(constructParameters);
        this.churches = <Church[]>await Church.find();

        if (constructParameters.id) {
            if (constructParameters.isRepeatableEvent) {
                const relations = RepeatedEvent.getRelations();
                this.event = await RepeatedEvent.findById(constructParameters.id, relations);
            } else {
                const { id } = constructParameters;
                if (typeof id === 'string' && id.startsWith('r')) {
                    const parts = id.split('-');
                    if (parts.length === 4) {
                        const relations = RepeatedEvent.getRelations();
                        const repeatedEvent = await RepeatedEvent.findById(parts[0].substr(1), relations);

                        this.blockedDay = new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
                        this.event = await EventHelper.generateSingleEventFromRepeatedEvent(
                            repeatedEvent,
                            this.blockedDay
                        );
                        this.event.id = null;
                    }
                } else {
                    this.event = await Event.findById(id, Event.getRelations());
                }
            }
        }

        this.placeNumber = 0;
        return res;
    }

    async onViewLoaded() {
        const res = super.onViewLoaded();

        const organizerCheckbox = this.findBy('.organizer-template');
        const organizerContainer = organizerCheckbox.parentElement;

        organizerCheckbox.remove();
        organizerCheckbox.classList.remove('organizer-template');

        this.placesContainer = this.findBy('#places-container');
        this.placesLineTemplate = this.findBy('#place-line-template');
        this.placesLineTemplate.removeAttribute('id');
        this.placesLineTemplate.remove();

        this.placePreview = this.findBy('#place-preview');

        this.churches.forEach((church) => {
            Translator.addDynamicTranslations(church.getDynamicTranslations());

            const elem = organizerCheckbox.cloneNode(true);
            elem.querySelector('.organizer-checkbox').name = `church-${church.id}`;
            elem.querySelector('.organizer-checkbox').value = church.id;
            elem.querySelector('.church-name').appendChild(
                Translator.makePersistentTranslation(church.getNameTranslation())
            );

            organizerContainer.appendChild(elem);
        });

        const imageInput = this.findBy('#event-image-input');
        imageInput.addEventListener('change', () => {
            if (imageInput.files && imageInput.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.findBy('#event-image').src = e.target.result;
                };
                reader.readAsDataURL(imageInput.files[0]);
            }
        });

        const typeSelect = this.findBy('[name=type]');
        Object.values(Event.TYPES).forEach((type) => {
            const optionElem = <HTMLOptionElement>Translator.makePersistentTranslation(type, undefined, 'option');
            optionElem.value = type;
            typeSelect.appendChild(optionElem);
        });

        this.form = new Form(this.findBy('#add-event-form'), async (values) => {
            this.showLoadingSymbol();
            const names = {};
            const descriptions = {};
            const organizers = [];
            let imageSrc = values.image;

            if (Helper.imageUrlIsEmpty(values.image)) {
                imageSrc = values['image-before'];
            }

            const places = {};
            const regions = [await Region.findById(1)];

            const indexedChurches = Helper.arrayToObject(this.churches, (church) => church.id);

            Object.keys(values).forEach((valName) => {
                if (valName.startsWith('church-')) {
                    organizers.push(indexedChurches[Number(values[valName])]);
                }
                if (valName.startsWith('name-')) {
                    names[valName.split('-')[1]] = values[valName];
                }
                if (valName.startsWith('description-')) {
                    descriptions[valName.split('-')[1]] = values[valName].replace(/&nbsp;/g, ' ');
                }
                if (valName.startsWith('place-name-')) {
                    let val = values[`place-query-${valName.substring(11)}`];
                    if (val.trim() === '') {
                        val = values[valName];
                    }
                    places[values[valName]] = val;
                }
            });

            let event;
            if (this.event) {
                if (this.event instanceof RepeatedEvent) {
                    event = this.event.getOriginalEvent();
                } else {
                    event = this.event;
                }
            } else {
                event = new Event();
            }

            let img: any;
            if (event.images && event.images.length >= 0) {
                [img] = event.images;
            } else {
                img = new FileMedium();
            }

            img.src = imageSrc;
            await img.save();

            event.setNames(names);
            event.setDescriptions(descriptions);
            event.setOrganisers(organizers);
            event.setImages([img]);
            event.setPlaces(places);
            event.setStartTime(new Date(values.start));
            event.setEndTime(new Date(values.end));
            event.setType(values.type);
            event.setRegions(regions);
            if (values.website.trim() === '') {
                values.website = null;
            }
            event.setWebsite(values.website);

            const eventId = event.id;
            const savePromise = event.save();
            if (Helper.isNotNull(event.repeatedEvent) && eventId === null) {
                const blockedDay = new BlockedDay();
                blockedDay.setDay(this.blockedDay);
                this.blockedDay.setHours(12);
                blockedDay.setRepeatedEvent(event.repeatedEvent);
                blockedDay.setEvent(event);
                event.repeatedEvent.blockedDays.push(blockedDay);
                await savePromise;
                await blockedDay.save();
            }
            await savePromise;
            // eventId = event.id;

            if (values.repeatable || this.event instanceof RepeatedEvent) {
                let repeatedEvent: RepeatedEvent;
                if (this.event instanceof RepeatedEvent) {
                    repeatedEvent = this.event;
                } else {
                    repeatedEvent = new RepeatedEvent();
                    this.event = repeatedEvent;
                }

                repeatedEvent.setStartDate(new Date(values.start));

                repeatedEvent.setOriginalEvent(event);
                event.repeatedEvent = repeatedEvent;
                event.setIsTemplate(true);

                const repeatUntil = new Date(values['repeat-until']);
                if (Number.isNaN(repeatUntil.getTime())) {
                    repeatedEvent.setRepeatUntil(null);
                } else {
                    repeatedEvent.setRepeatUntil(repeatUntil);
                }

                const repeatedDays = [];
                const days = [1, 2, 3, 4, 5, 6, 0];

                days.forEach((day) => {
                    if (values[`repeat-${day}`]) {
                        repeatedDays.push(values[`repeat-${day}`]);
                    }
                });

                repeatedEvent.setRepeatingArguments(repeatedDays.join(','));
                await repeatedEvent.save();
                await event.save();
            }

            if (this.event instanceof RepeatedEvent) {
                const nextEvent = await EventHelper.generateNextSingleEventFromRepeatedEvent(this.event);
                this.finishAndStartSite(EventSite, {
                    id: nextEvent.getId(),
                });
            } else {
                this.finishAndStartSite(EventSite, {
                    id: event.id,
                });
            }
            this.showLoadingSymbol();
        });

        this.form.addValidator((values) => {
            const errors: Record<string, string> = {};
            if (values.start.trim() === '') {
                errors.error1 = 'required';
            }
            if (values.end.trim() === '') {
                errors.error2 = 'reqired';
            }
            if (Object.keys(errors).length > 0) {
                return errors;
            }

            if (new Date(values.start).getTime() > new Date(values.end).getTime()) {
                new Toast('the endpoint must be after the start').show();
                return {
                    end: 'the endpoint must be after the start',
                };
            }
            return true;
        });

        this.findBy('.editor', true).forEach(async (e) => {
            this.form.addEditor(await CKEditor.create(e, CONSTANTS.CK_EDITOR_CONFIG));
        });

        this.findBy('#add-place').addEventListener('click', () => {
            this.addPlaceLine();
        });

        this.addPlaceLine();

        this.repeatableSectionElement = this.findBy('#repeatable-section');

        this.repeatableCheckbox = this.findBy('#repeatable-checkbox');
        this.repeatableCheckbox.addEventListener('change', () => {
            if (this.repeatableCheckbox.checked) {
                this.repeatableSectionElement.classList.remove('hidden');
            } else {
                this.repeatableSectionElement.classList.add('hidden');
            }
        });

        await this.setFormValuesFromEvent();

        flatpickr(this.findBy('.date-time', true), {
            enableTime: true,
            dateFormat: 'Y-m-dTH:i',
            time_24hr: true,
            locale: German,
        });

        return res;
    }

    addPlaceLine() {
        this.placeNumber++;
        const newLine = <HTMLElement>this.placesLineTemplate.cloneNode(true);

        const placeNameElem = <HTMLInputElement>newLine.querySelector('.place-name');
        placeNameElem.name = `place-name-${this.placeNumber}`;

        const placeQueryElem = <HTMLInputElement>newLine.querySelector('.place-query');
        placeQueryElem.name = `place-query-${this.placeNumber}`;

        placeNameElem.addEventListener('input', () => {
            placeQueryElem.placeholder = placeNameElem.value;
            updatePreview();
        });

        placeNameElem.addEventListener('change', () => {
            placeQueryElem.placeholder = placeNameElem.value;
            updatePreview();
        });

        let updateTimeout = null;
        let updatePreview = () => {
            if (updateTimeout !== null) {
                clearTimeout(updateTimeout);
            }
            updateTimeout = setTimeout(() => {
                const newSrc = PlaceHelper.buildMapsLink(placeQueryElem.value || placeQueryElem.placeholder);
                if (this.placePreview.src !== newSrc) {
                    this.placePreview.src = newSrc;
                }
            }, 200);
        };
        placeNameElem.addEventListener('focus', updatePreview);
        placeQueryElem.addEventListener('focus', updatePreview);
        placeQueryElem.addEventListener('change', updatePreview);
        placeQueryElem.addEventListener('keyup', updatePreview);

        newLine.querySelector('.remove-place').addEventListener('click', () => {
            newLine.remove();
        });

        this.placesContainer.appendChild(newLine);
        requestAnimationFrame(() => {
            placeNameElem.focus();
        });

        Translator.getInstance().updateTranslations(newLine);
    }

    async setFormValuesFromEvent() {
        if (this.event instanceof Event || this.event instanceof RepeatedEvent) {
            const values: Record<string, string | Record<string, string>> = {};

            const names = this.event.getNames();
            Object.keys(names).forEach((lang) => {
                values[`name-${lang}`] = names[lang];
            });

            const descriptions = this.event.getDescriptions();
            Object.keys(descriptions).forEach((lang) => {
                values[`description-${lang}`] = descriptions[lang].replace(/&nbsp;/g, ' ');
            });
            values.type = this.event.getType();
            values.start = DateHelper.strftime('%Y-%m-%d %H:%M', this.event.getStartTime());
            values.end = DateHelper.strftime('%Y-%m-%d %H:%M', this.event.getEndTime());
            values.website = this.event.getWebsite();

            const organisers = this.event.getOrganisers();
            if (Helper.isNotNull(organisers)) {
                organisers.forEach((church) => {
                    values[`church-${church.id}`] = church.id;
                });
            }

            this.findBy('#event-image').src = this.event.getImages()[0].getUrl();
            [this.findBy("input[type='hidden'][name='image-before']").value] = this.event.getImages();
            this.findBy("input[type='file'][name='image']").removeAttribute('required');

            let places: any = this.event.getPlaces();
            if (Array.isArray(places)) {
                places = Helper.arrayToObject(places, (place) => place);
            }
            Object.keys(places).forEach((placeName, i) => {
                if (i > 0) {
                    this.addPlaceLine();
                }

                values[`place-name-${i + 1}`] = placeName;
                if (placeName !== places[placeName]) {
                    values[`place-query-${i + 1}`] = places[placeName];
                } else {
                    const queryElem = <HTMLInputElement>this.findBy(`[name='place-query-${i + 1}']`);
                    queryElem.placeholder = placeName;
                    queryElem.removeAttribute('data-translation-placeholder');
                }
            });
            if (Object.keys(places).length === 0) {
                this.findBy('.remove-place')?.dispatchEvent(new MouseEvent('click'));
            }

            if (this.event instanceof RepeatedEvent) {
                this.repeatableCheckbox.checked = true;
                this.repeatableCheckbox.setAttribute('readonly', 'true');
                this.repeatableCheckbox.setAttribute('disabled', 'true');
                this.repeatableSectionElement.classList.remove('hidden');

                if (Helper.isNotNull(this.event.getRepeatUntil())) {
                    values['repeat-until'] = DateHelper.strftime('%Y-%m-%d %H:%M', this.event.getRepeatUntil());
                }

                const repeatingArguments = this.event.getRepeatingArguments().split(',');
                repeatingArguments.forEach((weekday) => {
                    values[`repeat-${weekday}`] = weekday;
                });
            } else if (this.event.getRepeatedEvent()) {
                this.repeatableCheckbox.setAttribute('readonly', 'true');
                this.repeatableCheckbox.setAttribute('disabled', 'true');
            }

            await this.form.setValues(values);
        }
    }
}

App.addInitialization((app) => {
    app.addDeepLink('addEvent', ModifyEventSite);
});
