/**
* @name: db-init
* @description: mongodb初始化操作
* @description: 脚本需要在 mongo shell(shell界面执行mongo命令切换到mongo shell)里再执行load('/path/to/db-init.js')
*/

/* 创建连接 */
conn = new Mongo({ "localhost" : 27017 });

/* admin管理者数据库 */
db = conn.getDB("admin");
if(db.getUser("admin")) {
    // db.dropUser("admin");
}else {
    db.createUser({
        'user' : 'admin',
        'pwd' : 'root',
        'roles' : ['userAdminAnyDatabase']
    });
}
db.logout();

/* infinity */
db = conn.getDB("infinity");
if(db.getUser("infinity")) {
    // db.dropUser("123456");
}else {
    db.createUser({
        'user' : 'infinity',
        'pwd' : '123456',
        'roles' : ['readWrite', 'dbAdmin']
    });
}

db.logout();
