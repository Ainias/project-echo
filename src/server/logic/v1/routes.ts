import * as express from 'express';
import { userRoutes, syncRoutes } from 'cordova-sites-user-management/dist/server';
import { UserManager } from 'cordova-sites-user-management/dist/server';
import { DeleteRepeatedEventController } from './controller/DeleteRepeatedEventController';
import { UpdateImagesController } from './controller/UpdateImagesController';
import { ContactController } from './controller/ContactController';

const routerV1 = express.Router();

const errorHandler = (fn, context) => {
    return (req, res, next) => {
        const resPromise = fn.call(context, req, res, next);
        if (resPromise && resPromise.catch) {
            resPromise.catch((err) => next(err));
        }
    };
};

// const syncRoutes = express.Router();
//
// syncRoutes.get("", errorHandler(UserManager.setUserFromToken, UserManager), errorHandler(EchoSyncController.sync, EchoSyncController));
// syncRoutes.post("", errorHandler(UserManager.setUserFromToken, UserManager), errorHandler(SyncController.modifyModel, SyncController));
// syncRoutes.post("/delete", errorHandler(UserManager.setUserFromToken, UserManager), errorHandler(SyncController.deleteModel, SyncController));
syncRoutes.post(
    '/deleteRepeatedEvent',
    errorHandler(UserManager.setUserFromToken, UserManager),
    errorHandler(DeleteRepeatedEventController.deleteRepeatedEvent, DeleteRepeatedEventController)
);

routerV1.use('/sync', syncRoutes);
routerV1.use('/user', userRoutes);
routerV1.get('/updateImages', errorHandler(UpdateImagesController.updateImages, UpdateImagesController));
routerV1.post('/contact', errorHandler(ContactController.sendContactMail, ContactController));

export { routerV1 };
