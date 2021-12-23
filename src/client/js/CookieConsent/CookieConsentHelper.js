import { NativeStoragePromise } from 'cordova-sites/dist/client/js/NativeStoragePromise';
import { NecessaryNativeStoragePromise } from './NecessaryNativeStoragePromise';
import { CookieDialog } from './CookieDialog';

export class CookieConsentHelper {
    static async giveConsentToCookies(consent) {
        await NecessaryNativeStoragePromise.setItem(CookieConsentHelper.consentKey, JSON.stringify(consent)).catch(
            (e) => console.error(e)
        );
        if (consent.indexOf('functional') !== -1) {
            await NativeStoragePromise.makePersistent();
        } else {
            await NativeStoragePromise.makeUnpersistent();
        }
    }

    static async mustAskForConsent() {
        return (await NecessaryNativeStoragePromise.getItem(CookieConsentHelper.consentKey, null)) === null;
    }

    static async getConsent() {
        // if (device.platform !== "browser"){
        //     return ["functional", "statistic", "thirdParty"]
        // }
        return JSON.parse(await NecessaryNativeStoragePromise.getItem(CookieConsentHelper.consentKey, '[]'));
    }

    static async hasConsent(consent) {
        const consents = await this.getConsent();
        return consents.indexOf(consent) !== -1;
    }

    static async addConsent(consent) {
        const consents = await this.getConsent();
        if (consents.indexOf(consent) === -1) {
            consents.push(consent);
            this.giveConsentToCookies(consents);
        }
    }

    static async revokeConsentToAll() {
        await NecessaryNativeStoragePromise.remove(CookieConsentHelper.consentKey);
        return NativeStoragePromise.makeUnpersistent();
    }

    static async showCookieDialog() {
        const result = await new CookieDialog(await this.getConsent()).show();
        await this.giveConsentToCookies(result);
    }
}

CookieConsentHelper.consentKey = 'cookieConsent';
