import { Dialog } from 'cordova-sites/dist/client/js/Dialog/Dialog';
import { ViewInflater } from 'cordova-sites/dist/client/js/ViewInflater';
import { ViewHelper } from 'js-helper/dist/client/ViewHelper';
import { Event } from '../../../shared/model/Event';
import { Translator } from 'cordova-sites';
import { Helper } from 'js-helper/dist/shared/Helper';
import { Church } from '../../../shared/model/Church';

const view = require('../../html/Dialoges/filterDialog.html');

export class FilterDialog extends Dialog {
    private filterEventContainer: HTMLElement;
    private possibleChurches: Church[];
    private types: any[];
    private churches: any[];
    private filterOrganiserContainer: HTMLElement;
    private filterTagTemplate: HTMLElement;

    constructor(types, churches) {
        super(
            Promise.all([ViewInflater.getInstance().load(view), Church.find()]).then((res) => {
                const loadedView = res[0];
                this.possibleChurches = (<Church[]>res[1]).sort((a, b) => {
                    Translator.getInstance().addDynamicTranslations(a.getDynamicTranslations());
                    Translator.getInstance().addDynamicTranslations(b.getDynamicTranslations());

                    const transA = Translator.getInstance().translate(a.getNameTranslation());
                    const transB = Translator.getInstance().translate(b.getNameTranslation());
                    return transA.toLowerCase().localeCompare(transB.toLowerCase());
                });

                this.types = Helper.nonNull(types, []);
                this.churches = Helper.nonNull(churches, []);

                this.filterEventContainer = loadedView.querySelector('#filter-event-tag-container');
                this.filterOrganiserContainer = loadedView.querySelector('#filter-organiser-tag-container');

                this.filterTagTemplate = loadedView.querySelector('#filter-tag-template');
                this.filterTagTemplate.removeAttribute('id');
                this.filterTagTemplate.remove();

                loadedView.querySelector('#search-button').addEventListener('click', () => {
                    this.applyFilter();
                });

                this.filterTags();
                return loadedView;
            }),
            'Filter'
        );
    }

    private filterTags() {
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
                const tag = <HTMLElement>this.filterTagTemplate.cloneNode(true);
                tag.appendChild(Translator.makePersistentTranslation(type));
                tag.dataset.type = type;

                if (this.types.indexOf(type) !== -1) {
                    tag.classList.add('selected');
                }
                tag.addEventListener('click', () => {
                    const index = this.types.indexOf(type);
                    if (index === -1) {
                        this.types.push(type);
                        tag.classList.add('selected');
                    } else {
                        this.types.splice(index, 1);
                        tag.classList.remove('selected');
                    }
                });
                this.filterEventContainer.appendChild(tag);
            });
        Translator.getInstance().updateTranslations(this.filterEventContainer);

        this.possibleChurches.forEach((church) => {
            Translator.addDynamicTranslations(church.getDynamicTranslations());

            const tag = <HTMLElement>this.filterTagTemplate.cloneNode(true);
            tag.appendChild(Translator.makePersistentTranslation(church.getNameTranslation()));
            tag.dataset.churchId = String(church.id);

            if (this.churches.indexOf(church.id) !== -1) {
                tag.classList.add('selected');
            }

            tag.addEventListener('click', () => {
                const index = this.churches.indexOf(church.id);
                if (index === -1) {
                    this.churches.push(church.id);
                    tag.classList.add('selected');
                } else {
                    this.churches.splice(index, 1);
                    tag.classList.remove('selected');
                }
            });

            this.filterOrganiserContainer.appendChild(tag);
        });
        Translator.getInstance().updateTranslations(this.filterOrganiserContainer);
    }

    // createModalDialogElement(): any {
    //     const element = super.createModalDialogElement();
    //
    //     try {
    //         let clearFilterButton = document.createElement("span");
    //         clearFilterButton.classList.add("clearFilter");
    //
    //         element.querySelector(".title").parentNode.appendChild(clearFilterButton);
    //         clearFilterButton.addEventListener("click", () => {
    //             this._result = {};
    //             this.close();
    //         });
    //     } catch (e) {
    //         console.error(e);
    //     }
    //
    //     return element;
    // }

    applyFilter() {
        this._result = {
            types: this.types,
            churches: this.churches,
        };
        this.close();
    }
}
