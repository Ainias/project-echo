import {Dialog} from "cordova-sites/dist/client/js/Dialog/Dialog";
import {ViewInflater} from "cordova-sites/dist/client/js/ViewInflater";

const view = require("../../html/Dialoges/filterDialog.html");
import {ViewHelper} from "js-helper/dist/client/ViewHelper";
import {Event} from "../../../shared/model/Event";
import {Translator} from "cordova-sites";
import {Helper} from "js-helper/dist/shared/Helper";
import {Church} from "../../../shared/model/Church";

export class FilterDialog extends Dialog {
    private _filterEventContainer: HTMLElement;
    private _possibleChurches: Church[];
    private _types: any[];
    private _churches: any[];
    private _filterOrganiserContainer: HTMLElement;
    private _filterTagTemplate: HTMLElement;

    constructor(types, churches) {
        super(Promise.all([ViewInflater.getInstance().load(view), Church.find()]).then(res => {
            let view = res[0];
            this._possibleChurches = res[1];

            this._types = Helper.nonNull(types, []);
            this._churches = Helper.nonNull(churches, []);

            this._filterEventContainer = view.querySelector("#filter-event-tag-container");
            this._filterOrganiserContainer = view.querySelector("#filter-organiser-tag-container");

            this._filterTagTemplate = view.querySelector("#filter-tag-template");
            this._filterTagTemplate.removeAttribute("id");
            this._filterTagTemplate.remove();

            view.querySelector("#search-button").addEventListener("click", () => {
                this.applyFilter();
            });

            this._filterTags();
            return view;
        }), "Filter");
    }

    _filterTags() {
        ViewHelper.removeAllChildren(this._filterEventContainer);
        ViewHelper.removeAllChildren(this._filterOrganiserContainer);

        Object.values(Event.TYPES).forEach(type => {
            let tag = <HTMLElement>this._filterTagTemplate.cloneNode(true);
            tag.appendChild(Translator.makePersistentTranslation(type));
            tag.dataset["type"] = type;

            if (this._types.indexOf(type) !== -1) {
                tag.classList.add("selected");
            }
            tag.addEventListener("click", () => {
                let index = this._types.indexOf(type);
                if (index === -1) {
                    this._types.push(type);
                    tag.classList.add("selected");
                } else {
                    this._types.splice(index, 1);
                    tag.classList.remove("selected");
                }
            });
            this._filterEventContainer.appendChild(tag);
        });
        Translator.getInstance().updateTranslations(this._filterEventContainer);

        this._possibleChurches.forEach(church => {
            Translator.addDynamicTranslations(church.getDynamicTranslations());

            let tag = <HTMLElement>this._filterTagTemplate.cloneNode(true);
            tag.appendChild(Translator.makePersistentTranslation(church.getNameTranslation()));
            tag.dataset["churchId"] = String(church.id);

            if (this._churches.indexOf(church.id + "") !== -1) {
                tag.classList.add("selected");
            }

            tag.addEventListener("click", () => {
                let index = this._churches.indexOf(church.id + "");
                if (index === -1) {
                    this._churches.push(church.id + "");
                    tag.classList.add("selected");
                } else {
                    this._churches.splice(index, 1);
                    tag.classList.remove("selected");
                }
            });

            this._filterOrganiserContainer.appendChild(tag);
        })
        Translator.getInstance().updateTranslations(this._filterOrganiserContainer);
    }

    applyFilter(){
        this._result = {
            "types": this._types,
            "churches":this._churches
        };
        this.close();
    }
}