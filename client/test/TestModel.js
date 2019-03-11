import {BaseModel, Database} from "cordova-sites-database";

export class TestModel extends BaseModel{

    constructor() {
        super();
        this.name = "";
    }

    static getColumnDefinitions(){
        let columns = BaseModel.getColumnDefinitions();
        columns["name"] = {
            type:"varchar"
        };
        return columns;
    }
}
// TestModel.SCHEMA_NAME="testModel";
Database.addModel(TestModel);