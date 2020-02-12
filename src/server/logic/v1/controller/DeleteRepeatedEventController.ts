import {EasySyncServerDb} from "cordova-sites-easy-sync/src/server/EasySyncServerDb";
import {UserManager} from "cordova-sites-user-management/server";
import {RepeatedEvent} from "../../../../shared/model/RepeatedEvent";
import {Event} from "../../../../shared/model/Event";


export class DeleteRepeatedEventController {

    static async deleteRepeatedEvent(req, res) {
        let modelName = req.body.model;
        let modelIds = req.body.id;

        let model = EasySyncServerDb.getModel(modelName);

        if (model !== RepeatedEvent) {
            throw new Error("model not correct: " + model.getSchemaName());
        }

        let user = req.user;
        if (model.ACCESS_MODIFY === false || (model.ACCESS_MODIFY !== true && (!user || !(await UserManager.hasAccess(user, model.ACCESS_MODIFY))))) {
            throw new Error("user " + (user ? user.id : "null") + " tried to delete model " + model.getSchemaName() + " (" + modelIds + ") without permission");
        }

        if (!Array.isArray(modelIds)) {
            modelIds = [modelIds];
        }

        //delete Events
        let now = new Date();
        let queryBuilder = await EasySyncServerDb.getInstance().createQueryBuilder();
        await queryBuilder.update(Event)
            .set({deleted: true, updatedAt: now})
            .where("repeatedEventId IN (:...ids)", {ids: modelIds})
            .execute();

        await EasySyncServerDb.getInstance().deleteEntity(modelIds, model);

        // await this._doDeleteModel(model, modelIds);

        return res.json({});
    }
}