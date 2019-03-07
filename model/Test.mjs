import {EasySync, EasySyncBaseModel} from "cordova-sites-easy-sync/model";

export class Test extends EasySyncBaseModel {}
Test.modelName = "test";
EasySync.addModel(Test);