import {MigrationInterface, QueryRunner} from "typeorm";
import {UserManager} from "cordova-sites-user-management/dist/server/v1/UserManager";
import {User} from "cordova-sites-user-management/dist/shared/v1/model/User";
import {Helper} from "js-helper/dist/shared/Helper";

export class Data1000000005000 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<any> {
        await this._insertAccesses(queryRunner);
        await this._insertRoles(queryRunner);
        await this._insertRoleChildren(queryRunner);
        await this._insertRoleAccess(queryRunner);
        await this._insertAdminUser(queryRunner);
    }

    async _insertAccesses(queryRunner: QueryRunner) {
        let accesses = await queryRunner.query("SELECT * FROM access");
        accesses = Helper.arrayToObject(accesses, obj => obj.id);

        if (Helper.isNull(accesses['1']))
            await queryRunner.query("INSERT INTO `access` VALUES " + "(1,'2019-06-04 16:51:17','2019-06-04 16:51:17',2,0,'default','everyone is allowed to do this!');");
        if (Helper.isNull(accesses['2']))
            await queryRunner.query("INSERT INTO `access` VALUES " + "(2,'2019-06-04 16:51:17','2019-06-04 16:51:17',2,0,'offline','does not has internet access!');");
        if (Helper.isNull(accesses['3']))
            await queryRunner.query("INSERT INTO `access` VALUES " + "(3,'2019-06-04 16:51:17','2019-06-04 16:51:17',2,0,'online','has internet access');");
        if (Helper.isNull(accesses['4']))
            await queryRunner.query("INSERT INTO `access` VALUES " + "(4,'2019-06-04 16:51:17','2019-06-04 16:51:17',2,0,'loggedOut','for users, that are not logged in');");
        if (Helper.isNull(accesses['5']))
            await queryRunner.query("INSERT INTO `access` VALUES " + "(5,'2019-06-04 16:51:17','2019-06-04 16:51:17',2,0,'loggedIn','for users, that are logged in');");
        if (Helper.isNull(accesses['6']))
            await queryRunner.query("INSERT INTO `access` VALUES " + "(6,'2019-06-04 16:51:17','2019-06-04 16:51:17',2,0,'admin','Access for admins');");
    }

    async _insertRoles(queryRunner: QueryRunner) {
        let roles = await queryRunner.query("SELECT * FROM role");
        roles = Helper.arrayToObject(roles, obj => obj.id);

        if (Helper.isNull(roles['1']))
            await queryRunner.query("INSERT INTO `role` VALUES " + "(1,'2019-06-04 16:51:17','2019-06-04 16:51:17',2,0,'offlineRole','role for user that are offline');");
        if (Helper.isNull(roles['2']))
            await queryRunner.query("INSERT INTO `role` VALUES " + "(2,'2019-06-04 16:51:17','2019-06-04 16:51:17',2,0,'onlineRole','role for user that are online');");
        if (Helper.isNull(roles['3']))
            await queryRunner.query("INSERT INTO `role` VALUES " + "(3,'2019-06-04 16:51:17','2019-06-04 16:51:17',2,0,'visitorRole','role for user that are online, but not logged in');");
        if (Helper.isNull(roles['4']))
            await queryRunner.query("INSERT INTO `role` VALUES " + "(4,'2019-06-04 16:51:17','2019-06-04 16:51:17',2,0,'memberRole','role for user that are online and logged in');");
        if (Helper.isNull(roles['5']))
            await queryRunner.query("INSERT INTO `role` VALUES " + "(5,'2019-06-04 16:51:18','2019-06-04 16:51:18',2,0,'Admin','Role for Admins (online, logged in and admin)');");
    }

    async _insertRoleChildren(queryRunner: QueryRunner) {
        let roleChildren = await queryRunner.query("SELECT * FROM roleChildren");
        roleChildren = Helper.arrayToObject(roleChildren, obj => obj.childId + "," + obj.parentId);

        if (Helper.isNull(roleChildren['3,2']))
            await queryRunner.query("INSERT INTO `roleChildren` (childId, parentId) VALUES " + "(3,2);");
        if (Helper.isNull(roleChildren['4,2']))
            await queryRunner.query("INSERT INTO `roleChildren` (childId, parentId) VALUES " + "(4,2);");
        if (Helper.isNull(roleChildren['5,4']))
            await queryRunner.query("INSERT INTO `roleChildren` (childId, parentId) VALUES " + "(5,4)");
    }

    async _insertRoleAccess(queryRunner: QueryRunner) {
        let roleAccesses = await queryRunner.query("SELECT * FROM roleAccess");
        roleAccesses = Helper.arrayToObject(roleAccesses, obj => obj.roleId + "," + obj.accessId);

        if (Helper.isNull(roleAccesses['1,1']))
            await queryRunner.query("INSERT INTO `roleAccess` (roleId, accessId) VALUES " + "(1,1);");
        if (Helper.isNull(roleAccesses['1,2']))
            await queryRunner.query("INSERT INTO `roleAccess` (roleId, accessId) VALUES " + "(1,2);");
        if (Helper.isNull(roleAccesses['2,1']))
            await queryRunner.query("INSERT INTO `roleAccess` (roleId, accessId) VALUES " + "(2,1);");
        if (Helper.isNull(roleAccesses['2,3']))
            await queryRunner.query("INSERT INTO `roleAccess` (roleId, accessId) VALUES " + "(2,3);");
        if (Helper.isNull(roleAccesses['3,4']))
            await queryRunner.query("INSERT INTO `roleAccess` (roleId, accessId) VALUES " + "(3,4);");
        if (Helper.isNull(roleAccesses['4,5']))
            await queryRunner.query("INSERT INTO `roleAccess` (roleId, accessId) VALUES " + "(4,5);");
        if (Helper.isNull(roleAccesses['5,6']))
            await queryRunner.query("INSERT INTO `roleAccess` (roleId, accessId) VALUES " + "(5,6)");
    }

    async _insertAdminUser(queryRunner: QueryRunner) {
        let pw = process.env.ADMIN_PW || "123456";
        let adminUser = await queryRunner.query("SELECT * FROM user WHERE id = 1 AND username = 'admin'");

        if (adminUser.length === 0) {
            let user = new User();
            pw = UserManager._hashPassword(user, pw);
            let salt = user.salt;

            await queryRunner.query("INSERT INTO `user` VALUES " +
                "(1,'2019-06-04 16:51:18','2019-06-04 16:51:24',3,0,'admin','echo@silas.link','" + pw + "',1,0,'" + salt + "')");
            await queryRunner.query("INSERT INTO `userRole` VALUES (1,5)");

            await queryRunner.query("INSERT INTO `user_access` VALUES " + "(1,1,6);");
            await queryRunner.query("INSERT INTO `user_access` VALUES " + "(2,1,5);");
            await queryRunner.query("INSERT INTO `user_access` VALUES " + "(3,1,1);");
            await queryRunner.query("INSERT INTO `user_access` VALUES " + "(4,1,3)");
        }
    }

    down(queryRunner: QueryRunner): Promise<any> {
        return undefined;
    }
}