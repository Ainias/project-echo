import { AlphabeticListFragment, Translator } from 'cordova-sites';
import { Helper } from 'js-helper/dist/shared';
import type { ListFsjsSite } from '../Sites/ListFsjsSite';

const defaultView = require('../../html/Fragments/fsjChurchBaseListFragment.html');

export class FsjChurchBaseListFragment extends AlphabeticListFragment<ListFsjsSite> {
    private template: HTMLElement;

    constructor(site, view) {
        super(site, Helper.nonNull(view, defaultView));
    }

    async onViewLoaded() {
        this.template = this.findBy('.info-template');
        this.template.remove();
        this.template.classList.remove('info-template');

        return super.onViewLoaded();
    }

    /**
     * @param {Church|Fsj} obj
     */
    renderElement(obj) {
        Translator.getInstance().addDynamicTranslations(obj.getDynamicTranslations());
        const infoElement = <HTMLElement>this.template.cloneNode(true);
        infoElement.querySelector('.name').appendChild(Translator.makePersistentTranslation(obj.getNameTranslation()));

        infoElement.addEventListener('click', () => {
            this.infoElemClicked(obj.id);
        });
        return infoElement;
    }

    // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
    infoElemClicked(id) {}
}
