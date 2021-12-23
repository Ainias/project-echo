import { FooterSite } from './FooterSite';
import { EventOverviewFragment } from '../Fragments/EventOverviewFragment';
import { App, Translator } from 'cordova-sites';
import { EventHelper } from '../Helper/EventHelper';
import { Helper, DateHelper } from 'js-helper/dist/shared';
import { Church } from '../../../shared/model/Church';
import { Event } from '../../../shared/model/Event';
import { ViewHelper } from 'js-helper/dist/client/ViewHelper';

const view = require('../../html/Sites/searchSite.html');

export class SearchSite extends FooterSite {
    private eventListFragment: EventOverviewFragment;
    private searchString: string;
    private start: string;
    private end: string;
    private types: any[];
    private churches: any[];
    private possibleChurches: Church[];

    private searchFilter: HTMLElement;
    private searchResults: HTMLElement;
    private filterTagTemplate: HTMLElement;
    private filterEventContainer: HTMLElement;
    private filterOrganiserContainer: HTMLElement;
    private searchInput: HTMLInputElement;

    constructor(siteManager) {
        super(siteManager, view);
        this.eventListFragment = new EventOverviewFragment(this);
        this.addFragment('#event-list', this.eventListFragment);
        this.getFooterFragment().setSelected('.icon.search');
    }

    async onConstruct(constructParameters) {
        const res = super.onConstruct(constructParameters);

        this.searchString = '';
        if (Helper.isSet(constructParameters, 'q')) {
            this.searchString = constructParameters.q;
        }

        this.start = DateHelper.strftime('%Y-%m-%d');
        if (Helper.isSet(constructParameters, 'start')) {
            this.start = constructParameters.start;
        }

        this.end = '';
        if (Helper.isSet(constructParameters, 'end')) {
            this.end = constructParameters.end;
        }

        this.types = [];
        if (Helper.isSet(constructParameters, 'types') && constructParameters.types.trim() !== '') {
            try {
                this.types = constructParameters.types.split(',');
            } catch (e) {
                console.warn(e);
            }
        }

        this.churches = [];
        if (Helper.isSet(constructParameters, 'churches') && constructParameters.churches.trim() !== '') {
            try {
                this.churches = constructParameters.churches.split(',');
            } catch (e) {
                console.warn(e);
            }
        }

        this.possibleChurches = (<Church[]>await Church.find()).sort((a, b) => {
            Translator.getInstance().addDynamicTranslations(a.getDynamicTranslations());
            Translator.getInstance().addDynamicTranslations(b.getDynamicTranslations());

            const transA = Translator.getInstance().translate(a.getNameTranslation());
            const transB = Translator.getInstance().translate(b.getNameTranslation());
            return transA.toLowerCase().localeCompare(transB.toLowerCase());
        });
        return res;
    }

    async onViewLoaded() {
        const res = super.onViewLoaded();

        this.searchFilter = this.findBy('#search-filter');
        this.searchResults = this.findBy('#search-results');

        this.filterTagTemplate = this.findBy('#filter-tag-template');
        this.filterTagTemplate.removeAttribute('id');
        this.filterTagTemplate.remove();

        this.filterEventContainer = this.findBy('#filter-event-tag-container');
        this.filterOrganiserContainer = this.findBy('#filter-organiser-tag-container');

        this.searchInput = this.findBy('#search-input');

        this.findBy('#search-button').addEventListener('click', () => {
            this.search();
        });

        this.searchInput.addEventListener('keyup', () => {
            this.filterTags(this.searchInput.value);
        });
        this.searchInput.addEventListener('focus', () => {
            this.showFilter();
        });
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.search();
                this.searchInput.blur();
            }
        });

        if (this.searchString.trim() !== '' || this.types.length >= 1 || this.churches.length >= 1) {
            await this.search();
        } else {
            await this.showFilter();
        }

        return res;
    }

    async showFilter() {
        this.searchFilter.classList.remove('hidden');
        this.searchResults.classList.add('hidden');
        this.filterTags(this.searchInput.value);
    }

    async search() {
        this.searchString = this.searchInput.value;
        await this.showLoadingSymbol();

        this.setParameters({
            q: this.searchString,
            types: this.types,
            churches: this.churches,
        });

        // TODO check if really all events found (or better to say, that all data is loaded!)
        const events = await EventHelper.search(
            this.searchString,
            this.start,
            this.end,
            this.types,
            this.churches,
            undefined,
            true
        );
        await this.eventListFragment.setEvents(events);

        this.searchFilter.classList.add('hidden');
        this.searchResults.classList.remove('hidden');

        await this.removeLoadingSymbol();
    }

    filterTags(value) {
        ViewHelper.removeAllChildren(this.filterEventContainer);
        ViewHelper.removeAllChildren(this.filterOrganiserContainer);

        Object.values(Event.TYPES)
            .sort((a, b) => {
                if (a === Event.TYPES.SONSTIGES) {
                    return 1;
                }
                if (b === Event.TYPES.SONSTIGES) {
                    return -1;
                }

                const transA = Translator.getInstance().translate(a);
                const transB = Translator.getInstance().translate(b);
                return transA.toLowerCase().localeCompare(transB.toLowerCase());
            })
            .forEach((type) => {
                // IF sorgt dafür, dass nur Tags angezeigt werden, die mit searchString anfangen
                const translation = Translator.translate(type).toLowerCase();
                if (translation.indexOf(value.toLowerCase()) !== -1) {
                    // || this._types.indexOf(type) !== -1) {
                    const tag = <HTMLElement>this.filterTagTemplate.cloneNode(true);
                    tag.appendChild(Translator.makePersistentTranslation(type));
                    tag.dataset.type = type;

                    if (this.types.indexOf(type) !== -1) {
                        tag.classList.add('selected');
                    }
                    tag.addEventListener('click', () => {
                        const index = this.types.indexOf(type);
                        if (index === -1) {
                            this.types = [type];
                            // this._types.push(type);
                            tag.classList.add('selected');
                        } else {
                            this.types = [];
                            // this._types.splice(index, 1);
                            tag.classList.remove('selected');
                        }
                        this.churches = [];
                        this.search();
                    });
                    this.filterEventContainer.appendChild(tag);
                }
            });

        this.possibleChurches.forEach((church) => {
            Translator.addDynamicTranslations(church.getDynamicTranslations());

            const translation = Translator.translate(church.getNameTranslation()).toLowerCase();

            // IF sorgt dafür, dass nur Churches angezeigt werden, die mit searchString anfangen
            if (translation.indexOf(value.toLowerCase()) !== -1) {
                // || this._churches.indexOf(church.id) !== -1) {
                const tag = <HTMLElement>this.filterTagTemplate.cloneNode(true);
                tag.appendChild(Translator.makePersistentTranslation(church.getNameTranslation()));
                tag.dataset.churchId = church.id.toString();

                if (this.churches.indexOf(`${church.id}`) !== -1) {
                    tag.classList.add('selected');
                }

                tag.addEventListener('click', () => {
                    const index = this.churches.indexOf(`${church.id}`);
                    if (index === -1) {
                        this.churches = [church.id.toString()];
                        // this._churches.push(church.id + "");
                        tag.classList.add('selected');
                    } else {
                        // this._churches.splice(index, 1);
                        this.churches = [];
                        tag.classList.remove('selected');
                    }
                    this.types = [];
                    this.search();
                });

                this.filterOrganiserContainer.appendChild(tag);
            }
        });
    }
}

App.addInitialization((app) => {
    app.addDeepLink('search', SearchSite);
});
