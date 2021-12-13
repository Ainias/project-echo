import { AlphabeticListFragment, Translator } from 'cordova-sites';
import { Helper } from 'js-helper/dist/shared';

const defaultView = require('../../html/Fragments/fsjChurchBaseListFragment.html');

export class FsjChurchBaseListFragment extends AlphabeticListFragment {
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
        let infoElement = <HTMLElement>this.template.cloneNode(true);
        infoElement.querySelector('.name').appendChild(Translator.makePersistentTranslation(obj.getNameTranslation()));

        infoElement.addEventListener('click', () => {
            this.infoElemClicked(obj.id);
        });
        return infoElement;
    }

    infoElemClicked(id) {}
}
