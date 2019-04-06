import {EntitySchema} from "typeorm";

export class Category {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    static getSchema(){
        return new EntitySchema({
            name: "Category",
            target: Category,
            columns: {
                id: {
                    primary: true,
                    type: "int",
                    generated: true
                },
                name: {
                    type: "varchar"
                }
            }
        });
    }
}