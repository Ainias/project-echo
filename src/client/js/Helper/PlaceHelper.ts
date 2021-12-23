import { Helper, Translator, ViewInflater } from 'cordova-sites';
import { CookieConsentHelper } from '../CookieConsent/CookieConsentHelper';

const placeView = require('../../html/place.html');

export class PlaceHelper {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private static API_KEY: string = __MAPS_API_KEY__;

    static isURL(possibleUrl) {
        return (
            typeof possibleUrl === 'string' &&
            (possibleUrl.startsWith('https://') || possibleUrl.startsWith('http://') || possibleUrl.startsWith('www.'))
        );
    }

    static async createPlace(placeName, placeQuery, small?) {
        small = Helper.nonNull(small, false);
        const view = await ViewInflater.getInstance().load(placeView);

        if (this.isURL(placeQuery)) {
            const a = document.createElement('a');
            a.href = placeQuery;
            a.innerText = placeName;
            a.target = '_blank';
            a.classList.add('link');
            a.classList.add('without-arrow');

            if (small) {
                a.classList.add('grow');
                view.querySelector('.place-name').replaceWith(a);
            } else {
                view.querySelector('.place-name').appendChild(a);
                // view.querySelector(".place").classList.add("url")
            }
        } else {
            view.querySelector('.place-name').innerText = placeName;
            if (small === true) {
                view.querySelector('.place').classList.add('small');
            } else {
                await this.buildGoogleMaps(view, placeQuery);
            }
        }

        return view;
    }

    static buildMapsLink(placeQuery) {
        return `https://www.google.com/maps/embed/v1/place?key=${PlaceHelper.API_KEY}&q=${encodeURIComponent(
            placeQuery.replace(/\n/g, ', ')
        )}`;
    }

    static async createMultipleLocationsView() {
        const view = await ViewInflater.getInstance().load(placeView);
        view.querySelector('.place-name').appendChild(Translator.makePersistentTranslation('Multiple locations'));
        view.querySelector('.place').classList.add('small');

        return view;
    }

    static async buildGoogleMaps(view, placeQuery) {
        const iframe = view.querySelector('.place-google-maps');
        if (await CookieConsentHelper.hasConsent('thirdParty')) {
            iframe.src = this.buildMapsLink(placeQuery);
            iframe.classList.remove('hidden');
        } else {
            const policyNotice = view.querySelector('.non-third-party-cookies-accepted-message');
            policyNotice.classList.remove('hidden');

            view.querySelector('.activate-map').addEventListener('click', () => {
                iframe.src = this.buildMapsLink(placeQuery);
                iframe.classList.remove('hidden');
                policyNotice.classList.add('hidden');
                if (view.querySelector('.accept-third-party-cookies').checked) {
                    CookieConsentHelper.addConsent('thirdParty');
                }
            });
        }
    }
}
