import { MenuFooterSite } from './MenuFooterSite';

import { App, Form, Helper, Translator } from 'cordova-sites';
import { Church } from '../../../shared/model/Church';
import { UserSite } from 'cordova-sites-user-management/dist/client/js/Context/UserSite';
import { Region } from '../../../shared/model/Region';
import CKEditor from '@ckeditor/ckeditor5-build-classic';
import { CONSTANTS } from '../CONSTANTS';
import { PlaceHelper } from '../Helper/PlaceHelper';
import { ShowChurchSite } from './ShowChurchSite';
import { FileMedium } from 'cordova-sites-easy-sync/dist/shared/FileMedium';

const view = require('../../html/Sites/modifyChurchSite.html');

export class ModifyChurchSite extends MenuFooterSite {
    private church: Church;
    private placeNumber: number;
    private placesContainer: HTMLElement;
    private placesLineTemplate: HTMLElement;
    private placePreview: HTMLIFrameElement;
    private form: Form;

    constructor(siteManager) {
        super(siteManager, view);
        this.addDelegate(new UserSite(this, 'organisers'));
    }

    async onConstruct(constructParameters) {
        const res = super.onConstruct(constructParameters);

        this.church = null;
        if (constructParameters.id) {
            this.church = await Church.findById(constructParameters.id, Church.getRelations());
        }
        this.placeNumber = 0;

        return res;
    }

    async onViewLoaded() {
        const res = super.onViewLoaded();

        this.placesContainer = this.findBy('#places-container');
        this.placesLineTemplate = this.findBy('#place-line-template');
        this.placesLineTemplate.removeAttribute('id');
        this.placesLineTemplate.remove();

        this.placePreview = this.findBy('#place-preview');

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

        this.form = new Form(this.findBy('#modify-church-form'), async (values) => {
            const names = {};
            const descriptions = {};
            const imageSrc = !Helper.imageUrlIsEmpty(values.image) ? values.image : values['image-before'];
            const places = {};
            const regions = [await Region.findById(1)];

            Object.keys(values).forEach((valName) => {
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

            let church: any;
            if (this.church) {
                church = this.church;
            } else {
                church = new Church();
            }

            let img: any;
            if (church.images && church.images.length >= 0) {
                [img] = church.images;
            } else {
                img = new FileMedium();
            }

            img.src = imageSrc;
            await img.save();

            church.names = names;
            church.descriptions = descriptions;
            church.images = [img];
            church.places = places;
            church.website = values['website-url'];
            church.regions = regions;

            if (values.instagram && values.instagram.trim() === '') {
                values.instagram = null;
            }
            church.setInstagram(values.instagram);

            await church.save();

            this.finishAndStartSite(ShowChurchSite, {
                id: church.id,
            });
        });

        this.findBy('.editor', true).forEach(async (e) => {
            this.form.addEditor(await CKEditor.create(e, CONSTANTS.CK_EDITOR_CONFIG));
        });

        this.findBy('#add-place').addEventListener('click', () => {
            this.addPlaceLine();
        });

        this.addPlaceLine();

        await this.setFormValuesFromChurch();

        return res;
    }

    addPlaceLine() {
        this.placeNumber++;
        const newLine = <HTMLElement>this.placesLineTemplate.cloneNode(true);

        const placeNameElem = <HTMLInputElement>newLine.querySelector('.place-name');
        placeNameElem.name = `place-name-${this.placeNumber}`;

        const placeQueryElem = <HTMLInputElement>newLine.querySelector('.place-query');
        placeQueryElem.name = `place-query-${this.placeNumber}`;

        placeNameElem.addEventListener('keyup', () => {
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

    async setFormValuesFromChurch() {
        if (Helper.isNull(this.church) || !(this.church instanceof Church)) {
            return;
        }

        const values: Record<string, string> = {};

        const names = this.church.getNames();
        Object.keys(names).forEach((lang) => {
            values[`name-${lang}`] = names[lang];
        });

        const descriptions = this.church.getDescriptions();
        Object.keys(descriptions).forEach((lang) => {
            values[`description-${lang}`] = descriptions[lang];
        });

        values['website-url'] = this.church.getWebsite();

        [this.findBy('#event-image').src] = this.church.getImages();
        [this.findBy("input[type='hidden'][name='image-before']").value] = this.church.getImages();
        this.findBy("input[type='file'][name='image']").removeAttribute('required');

        let { places } = this.church;
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
                const queryElem = this.findBy(`[name='place-query-${i + 1}']`);
                queryElem.placeholder = placeName;
                queryElem.removeAttribute('data-translation-placeholder');
            }
        });
        if (this.church.getInstagram()) {
            values.instagram = this.church.getInstagram();
        }

        await this.form.setValues(values);
    }
}

App.addInitialization((app) => {
    app.addDeepLink('modifyChurch', ModifyChurchSite);
});
