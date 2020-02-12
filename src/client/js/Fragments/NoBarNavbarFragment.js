import {NavbarFragment} from "cordova-sites";

import viewNavbar from '../../html/Fragments/noBarNavbarFragment.html';


export class NoBarNavbarFragment extends NavbarFragment {

    constructor(site) {
        super(site, viewNavbar);
    }
}