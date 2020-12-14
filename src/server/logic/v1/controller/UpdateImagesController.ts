import {FileMedium} from "cordova-sites-easy-sync/dist/shared";
import {EasySyncServerDb} from "cordova-sites-easy-sync/dist/server";
import {Helper} from "js-helper/dist/shared/Helper";
import {SelectQueryBuilder} from "typeorm";

export class UpdateImagesController {
    static async updateImages(req, res){
        let queryBuilder = <SelectQueryBuilder<FileMedium>>await EasySyncServerDb.getInstance().createQueryBuilder(FileMedium);
        queryBuilder = queryBuilder.select("id", "id");
        let ids = await queryBuilder.getRawMany();

        await Helper.asyncForEach(ids, async (id, i) => {
            let fileMedium = await FileMedium.findById(id.id);
            await fileMedium.save();
            console.log(i+" done!");
        });

        res.json({success: true});
    }
}