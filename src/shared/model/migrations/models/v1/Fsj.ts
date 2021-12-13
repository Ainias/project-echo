import { FsjChurchBaseObject } from './FsjChurchBaseObject';

export class Fsj extends FsjChurchBaseObject {
    constructor() {
        super();
    }
}

Fsj.ACCESS_MODIFY = 'admin';
Fsj.SCHEMA_NAME = 'Fsj';
// BaseDatabase.addModel(Fsj);
