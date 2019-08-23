import {Variable} from "./model/Variable";
import {Access, Role, User} from "cordova-sites-user-management/models"
import {UserManager} from "cordova-sites-user-management/server";

async function setupDB() {
    let dbVersionVar = await Variable.findOne({name: "dbVersion"});
    if (dbVersionVar === null) {
        dbVersionVar = new Variable();
        dbVersionVar.name = "dbVersion";
        dbVersionVar.value = 0;
    }

    if (dbVersionVar.value < 1) {
        //setup access, roles and users
        let defaultAccess = new Access();
        defaultAccess.id = 1;
        defaultAccess.name = "default";
        defaultAccess.description = "everyone is allowed to do this!";

        let offlineAccess = new Access();
        offlineAccess.id = 2;
        offlineAccess.name = "offline";
        offlineAccess.description = "does not has internet access!";

        let onlineAccess = new Access();
        onlineAccess.id = 3;
        onlineAccess.name = "online";
        onlineAccess.description = "has internet access";

        let loggedOutAccess = new Access();
        loggedOutAccess.id = 4;
        loggedOutAccess.name = "loggedOut";
        loggedOutAccess.description = "for users, that are not logged in";

        let loggedInAccess = new Access();
        loggedInAccess.id = 5;
        loggedInAccess.name = "loggedIn";
        loggedInAccess.description = "for users, that are logged in";

        let adminAccess = new Access();
        adminAccess.id = 6;
        adminAccess.name = "admin";
        adminAccess.description = "Access for admins";

        await Promise.all([defaultAccess.save(), offlineAccess.save(), onlineAccess.save(), loggedOutAccess.save(), loggedInAccess.save(), adminAccess.save()]);

        let offlineRole = new Role();
        offlineRole.id = 1;
        offlineRole.name = "offlineRole";
        offlineRole.description = "role for user that are offline";
        offlineRole.accesses = [offlineAccess, defaultAccess];

        let onlineRole = new Role();
        onlineRole.id = 2;
        onlineRole.name = "onlineRole";
        onlineRole.description = "role for user that are online";
        onlineRole.accesses = [onlineAccess, defaultAccess];

        await Promise.all([offlineRole.save(), onlineRole.save()]);

        let visitorRole = new Role();
        visitorRole.id = 3;
        visitorRole.name = "visitorRole";
        visitorRole.description = "role for user that are online, but not logged in";
        visitorRole.accesses = [loggedOutAccess];
        visitorRole.parents = [onlineRole];

        let memberRole = new Role();
        memberRole.id = 4;
        memberRole.name = "memberRole";
        memberRole.description = "role for user that are online and logged in";
        memberRole.accesses = [loggedInAccess];
        memberRole.parents = [onlineRole];

        await Promise.all([visitorRole.save(), memberRole.save()]);

        let adminRole = new Role();
        adminRole.id = 5;
        adminRole.name = "Admin";
        adminRole.description = "Role for Admins (online, logged in and admin)";
        adminRole.accesses = [adminAccess];
        adminRole.parents = [memberRole];

        await adminRole.save();

        let admin = new User();
        admin.id = 1;
        admin.email = "echo@silas.link";
        admin.password = UserManager._hashPassword(admin, "123456");
        admin.username = "admin";
        admin.roles = [adminRole];
        admin.activated = true;

        await Promise.all([admin.save()]);

        await UserManager.updateCachedAccessesForUser(admin);
    }
    dbVersionVar.value = 1;
    await dbVersionVar.save();
}

export {setupDB}