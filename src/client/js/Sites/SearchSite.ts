import { FooterSite } from './FooterSite';

const view = require('../../html/Sites/searchSite.html');
import { EventOverviewFragment } from '../Fragments/EventOverviewFragment';
import { App, Translator } from 'cordova-sites';
import { EventHelper } from '../Helper/EventHelper';
import { Helper } from 'js-helper/dist/shared';
import { Church } from '../../../shared/model/Church';
import { Event } from '../../../shared/model/Event';
import { ViewHelper } from 'js-helper/dist/client/ViewHelper';
import { DateHelper } from 'js-helper';

export class SearchSite extends FooterSite {
    private eventListFragment: EventOverviewFragment;
    private _searchString: string;
    private _start: string;
    private _end: string;
    private _types: any[];
    private _churches: any[];
    private _possibleChurches: Church[];

    private _searchFilter: HTMLElement;
    private _searchResults: HTMLElement;
    private _filterTagTemplate: HTMLElement;
    private _filterEventContainer: HTMLElement;
    private _filterOrganiserContainer: HTMLElement;
    private _searchInput: HTMLInputElement;

    constructor(siteManager) {
        super(siteManager, view);
        this.eventListFragment = new EventOverviewFragment(this);
        this.addFragment('#event-list', this.eventListFragment);
        this.getFooterFragment().setSelected('.icon.search');
    }

    async onConstruct(constructParameters) {
        let res = super.onConstruct(constructParameters);

        this._searchString = '';
        if (Helper.isSet(constructParameters, 'q')) {
            this._searchString = constructParameters['q'];
        }

        this._start = DateHelper.strftime('%Y-%m-%d');
        if (Helper.isSet(constructParameters, 'start')) {
            this._start = constructParameters['start'];
        }

        this._end = '';
        if (Helper.isSet(constructParameters, 'end')) {
            this._end = constructParameters['end'];
        }

        this._types = [];
        if (Helper.isSet(constructParameters, 'types') && constructParameters['types'].trim() !== '') {
            try {
                this._types = constructParameters['types'].split(',');
            } catch (e) {}
        }

        this._churches = [];
        if (Helper.isSet(constructParameters, 'churches') && constructParameters['churches'].trim() !== '') {
            try {
                this._churches = constructParameters['churches'].split(',');
            } catch (e) {}
        }

        this._possibleChurches = (<Church[]>await Church.find()).sort((a, b) => {
            Translator.getInstance().addDynamicTranslations(a.getDynamicTranslations());
            Translator.getInstance().addDynamicTranslations(b.getDynamicTranslations());

            const transA = Translator.getInstance().translate(a.getNameTranslation());
            const transB = Translator.getInstance().translate(b.getNameTranslation());
            return transA.toLowerCase().localeCompare(transB.toLowerCase());
        });
        return res;
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();

        this._searchFilter = this.findBy('#search-filter');
        this._searchResults = this.findBy('#search-results');

        this._filterTagTemplate = this.findBy('#filter-tag-template');
        this._filterTagTemplate.removeAttribute('id');
        this._filterTagTemplate.remove();

        this._filterEventContainer = this.findBy('#filter-event-tag-container');
        this._filterOrganiserContainer = this.findBy('#filter-organiser-tag-container');

        this._searchInput = this.findBy('#search-input');

        this.findBy('#search-button').addEventListener('click', () => {
            this._search();
        });

        this._searchInput.addEventListener('keyup', () => {
            this._filterTags(this._searchInput.value);
        });
        this._searchInput.addEventListener('focus', () => {
            this._showFilter();
        });
        this._searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this._search();
                this._searchInput.blur();
            }
        });

        if (this._searchString.trim() !== '' || this._types.length >= 1 || this._churches.length >= 1) {
            await this._search();
        } else {
            await this._showFilter();
        }

        return res;
    }

    async _showFilter() {
        this._searchFilter.classList.remove('hidden');
        this._searchResults.classList.add('hidden');
        this._filterTags(this._searchInput.value);
    }

    async _search() {
        this._searchString = this._searchInput.value;
        await this.showLoadingSymbol();

        this.setParameters({
            q: this._searchString,
            types: this._types,
            churches: this._churches,
        });

        //TODO check if really all events found (or better to say, that all data is loaded!)
        let events = await EventHelper.search(
            this._searchString,
            this._start,
            this._end,
            this._types,
            this._churches,
            undefined,
            true
        );
        await this.eventListFragment.setEvents(events);

        this._searchFilter.classList.add('hidden');
        this._searchResults.classList.remove('hidden');

        await this.removeLoadingSymbol();
    }

    _filterTags(value) {
        ViewHelper.removeAllChildren(this._filterEventContainer);
        ViewHelper.removeAllChildren(this._filterOrganiserContainer);

        Object.values(Event.TYPES)
            .sort((a, b) => {
                if (a === Event.TYPES.SONSTIGES) {
                    return 1;
                } else if (b === Event.TYPES.SONSTIGES) {
                    return -1;
                }

                const transA = Translator.getInstance().translate(a);
                const transB = Translator.getInstance().translate(b);
                return transA.toLowerCase().localeCompare(transB.toLowerCase());
            })
            .forEach((type) => {
                //IF sorgt dafür, dass nur Tags angezeigt werden, die mit searchString anfangen
                let translation = Translator.translate(type).toLowerCase();
                if (translation.indexOf(value.toLowerCase()) !== -1) {
                    //|| this._types.indexOf(type) !== -1) {
                    let tag = <HTMLElement>this._filterTagTemplate.cloneNode(true);
                    tag.appendChild(Translator.makePersistentTranslation(type));
                    tag.dataset['type'] = type;

                    if (this._types.indexOf(type) !== -1) {
                        tag.classList.add('selected');
                    }
                    tag.addEventListener('click', () => {
                        let index = this._types.indexOf(type);
                        if (index === -1) {
                            this._types = [type];
                            // this._types.push(type);
                            tag.classList.add('selected');
                        } else {
                            this._types = [];
                            // this._types.splice(index, 1);
                            tag.classList.remove('selected');
                        }
                        this._churches = [];
                        this._search();
                    });
                    this._filterEventContainer.appendChild(tag);
                }
            });

        this._possibleChurches.forEach((church) => {
            Translator.addDynamicTranslations(church.getDynamicTranslations());

            let translation = Translator.translate(church.getNameTranslation()).toLowerCase();

            //IF sorgt dafür, dass nur Churches angezeigt werden, die mit searchString anfangen
            if (translation.indexOf(value.toLowerCase()) !== -1) {
                // || this._churches.indexOf(church.id) !== -1) {
                let tag = <HTMLElement>this._filterTagTemplate.cloneNode(true);
                tag.appendChild(Translator.makePersistentTranslation(church.getNameTranslation()));
                tag.dataset['churchId'] = church.id.toString();

                if (this._churches.indexOf(church.id + '') !== -1) {
                    tag.classList.add('selected');
                }

                tag.addEventListener('click', () => {
                    let index = this._churches.indexOf(church.id + '');
                    if (index === -1) {
                        this._churches = [church.id.toString()];
                        // this._churches.push(church.id + "");
                        tag.classList.add('selected');
                    } else {
                        // this._churches.splice(index, 1);
                        this._churches = [];
                        tag.classList.remove('selected');
                    }
                    this._types = [];
                    this._search();
                });

                this._filterOrganiserContainer.appendChild(tag);
            }
        });
    }
}

App.addInitialization((app) => {
    app.addDeepLink('search', SearchSite);
});
