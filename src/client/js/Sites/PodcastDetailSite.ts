import { MenuFooterSite } from './MenuFooterSite';
import { App, ConfirmDialog, Toast } from 'cordova-sites';
import { Helper } from 'js-helper/dist/shared';
import { Podcast } from '../../../shared/model/Podcast';
import { Translator } from 'cordova-sites/dist/client';
import { UserManager } from 'cordova-sites-user-management/dist/client/js/UserManager';
import { Church } from '../../../shared/model/Church';
import { ModifyPodcastSite } from './ModifyPodcastSite';

const view = require('../../html/Sites/podcastDetailSite.html');

export class PodcastDetailSite extends MenuFooterSite {
    private podcast: Podcast;

    constructor(siteManager) {
        super(siteManager, view);
    }

    async onConstruct(constructParameters: any): Promise<any[]> {
        const res = super.onConstruct(constructParameters);

        if (!Helper.isSet(constructParameters, 'id')) {
            new Toast('no id given').show();
            this.finish();
        }

        this.podcast = await Podcast.findById(constructParameters['id'], Podcast.getRelations());

        if (Helper.isNull(this.podcast)) {
            new Toast('no podcast found').show();
            this.finish();
        }

        Translator.addDynamicTranslations(this.podcast.getDynamicTranslations());

        return res;
    }

    async onViewLoaded(): Promise<any[]> {
        const res = super.onViewLoaded();

        const images = this.podcast.getImages();

        (<HTMLImageElement>this.find('#podcast-image')).src = images && images[0] ? images[0].getUrl() : '';
        (<HTMLElement>this.find('#name')).appendChild(
            Translator.makePersistentTranslation(this.podcast.getTitleTranslation())
        );
        (<HTMLElement>this.find('#description')).appendChild(
            Translator.makePersistentTranslation(this.podcast.getDescriptionTranslation())
        );
        this.findAll('.release-circle').forEach((elem) =>
            elem.appendChild(Translator.makePersistentTranslation(this.podcast.getReleaseCircleTranslation()))
        );

        const duration = this.podcast.getDuration();
        if (duration) {
            this.findAll('.duration').forEach((elem) =>
                elem.appendChild(Translator.makePersistentTranslation('podcast-duration', [duration]))
            );
        }

        let spotifyLink = this.podcast.getSpotifyLink();
        if (spotifyLink) {
            if (!spotifyLink.startsWith('http') && !spotifyLink.startsWith('//')) {
                spotifyLink = 'https://' + spotifyLink;
            }

            const spotifyButton = <HTMLLinkElement>this.find('#spotify-link');
            spotifyButton.href = spotifyLink;
            spotifyButton.classList.remove('hidden');
        }

        let youtubeLink = this.podcast.getYoutubeLink();
        if (youtubeLink) {
            if (!youtubeLink.startsWith('http') && !youtubeLink.startsWith('//')) {
                youtubeLink = 'https://' + youtubeLink;
            }

            const youtubeButton = <HTMLLinkElement>this.find('#youtube-link');
            youtubeButton.href = youtubeLink;
            youtubeButton.classList.remove('hidden');
        }

        UserManager.getInstance().addLoginChangeCallback((loggedIn, manager) => {
            if (loggedIn && manager.hasAccess(Podcast.ACCESS_MODIFY)) {
                this.find('.admin-panel').classList.remove('hidden');
            } else {
                this.find('.admin-panel').classList.add('hidden');
            }
        }, true);

        this.find('#delete-podcast').addEventListener('click', async () => this.deletePodcast());
        this.find('#modify-podcast').addEventListener('click', async () => this.modifyPodcast());

        return res;
    }

    private async deletePodcast() {
        if (UserManager.getInstance().hasAccess(Church.ACCESS_MODIFY)) {
            if (
                await new ConfirmDialog(
                    'Möchtest du den Podcast wirklich löschen? Er wird unwiederbringlich verloren gehen!',
                    'Podcast löschen?'
                ).show()
            ) {
                await this.podcast.delete();
                new Toast('Der Podcast wurde erfolgreich gelöscht').show();
                this.finish();
            }
        }
    }

    private modifyPodcast() {
        if (UserManager.getInstance().hasAccess(Podcast.ACCESS_MODIFY)) {
            return this.finishAndStartSite(ModifyPodcastSite, { id: this.podcast.id });
        }
    }
}

App.addInitialization((app) => {
    app.addDeepLink('podcast', PodcastDetailSite);
});
