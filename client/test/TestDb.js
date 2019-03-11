import {Database} from "cordova-sites-database";

export class TestDb extends Database{
    constructor() {
        super("MyDB");
    }
}