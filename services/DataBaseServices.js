let DBConnection = require("../config/db");

let findAllTables = (dbname) => {
    return new Promise((resolve, reject) => {
        try {
            var topic = "SELECT table_name FROM information_schema.tables WHERE table_schema ='" + dbname + "'";
            DBConnection.query(
                topic,
                function(err, rows) {
                    if (err) {
                        reject(err)
                    }
                    let tables = rows;
                    resolve(tables);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};
let CreateTables = (dbname, table_name, id_type) => {
    return new Promise((resolve, reject) => {
        try {
            var topic = "CREATE TABLE `" + dbname + "`.`" + table_name + "` ( `id` " + id_type + " , PRIMARY KEY (`id`)) ENGINE = InnoDB";
            DBConnection.query(
                topic,
                function(err, rows) {
                    if (err) {
                        reject(err)
                    }
                    let tables = rows;
                    resolve(tables);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    findAllTables: findAllTables,
    CreateTables: CreateTables
};