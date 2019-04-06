import {EntitySchema} from "typeorm";

export class Post {
    constructor(id, title, text, categories) {
        this.id = id;
        this.title = title;
        this.text = text;
        this.categories = categories;
    }

    static getSchema(){
        return new EntitySchema({
            name: "Post",
            target: Post,
            columns: {
                id: {
                    primary: true,
                    type: "int",
                    generated: true
                },
                title: {
                    type: "varchar"
                },
                text: {
                    type: "text"
                }
            },
            relations: {
                categories: {
                    target: "Category",
                    type: "many-to-many",
                    joinTable: true,
                    cascade: true
                }
            }
        });
    }
}
