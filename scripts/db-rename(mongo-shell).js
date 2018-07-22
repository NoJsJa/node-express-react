/**
* @name: db-rename
* @description: 数据库重命名
* @description: 脚本需要在 mongo shell(shell界面执行mongo命令切换到mongo shell)里再执行load('/path/to/db-rename.js')
*/

conn = new Mongo({ "localhost" : 27017 });
db = conn.getDB("infinity");

const source = "infinity";
const dest = "a new name";
const colls = db.getSiblingDB(source).getCollectionNames();
for (const i = 0; i < colls.length; i++) {
    const from = source + "." + colls[i];
    const to = dest + "." + colls[i];
    db.adminCommand({renameCollection: from, to: to});
}
