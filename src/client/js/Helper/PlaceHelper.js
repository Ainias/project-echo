import {Helper, Translator, ViewInflater} from "cordova-sites";

import placeView from "../../html/place.html"

export class PlaceHelper {
    static async createPlace(placeName, placeQuery) {
        placeQuery = Helper.nonNull(placeQuery, false);
        let view = await ViewInflater.getInstance().load(placeView);
        view.querySelector(".place-name").innerText = placeName;

        if (placeQuery === false) {
            view.querySelector(".place").classList.add("small")
        } else {
            view.querySelector(".place-google-maps").src = this._buildMapsLink(placeQuery);
        }

        return view;
    }

    static _buildMapsLink(placeQuery) {
        return "https://www.google.com/maps/embed/v1/place?key=" + PlaceHelper.API_KEY + "&q=" + encodeURIComponent(placeQuery.replace(/\n/g, ", "));
    }

    static async createMultipleLocationsView() {
        let view = await ViewInflater.getInstance().load(placeView);
        view.querySelector(".place-name").appendChild(Translator.makePersistentTranslation("Multiple locations"));
        view.querySelector(".place").classList.add("small");

        return view;
    }
}

PlaceHelper.API_KEY = __MAPS_API_KEY__;