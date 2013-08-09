var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data/data.db');


/*
 * GET listing of all employees
 */
exports.list = function(req, res){
    db.all("select * from employee ORDER BY name;", function (err, employees) {
            if (err) {
                res.send("ERR");
            } else {
                res.send(employees);
            }
        });
};

/*
 * GET one employees
 */
exports.get = function(req, res){
console.log("GET");
    db.all("select * from employee WHERE id="+req.params.id+";", 
           function (err, employee) {
            if (err) {
                res.send("ERR");
            } else {
                res.send(employee[0]);
            }
        });
};

/*
 * DELETE employee listing - takes 'id' 
 */
exports.delete = function(req, res){
    console.log("DELETE FROM...", req.params);
    //    DELETE FROM employee WHERE name like "kamil%";
    db.run("DELETE FROM employee WHERE id="+req.params.id);
    res.send("delete attempted...");
};


/*
 * POST create new or update old employee
 * 
 * assumes it's an update if there is an 'id' field
 * and it is a new value if there is no id
 */
exports.upsert = function(req, res){
    // helper function to get values to pass to sqlite3 calls
    var employee = req.body,
    param = function (p) { // quoted
        return "'"+employee[p]+"'";
    },
    num = function (p) { // not quoted
        return employee[p];
    };
    if (employee.id) {
        // update
        // like this UPDATE Item SET ItemName='Tea powder', ItemCategoryName='Food' WHERE ItemId='1';
        var q = "UPDATE employee SET name="+param('name')+", email="+param('email')+", isManager="+num('isManager')+" WHERE id="+num('id')+";"
        db.run(q);
    } else {
        // add
        // INSERT INTO employee(name, email, employeeNumber, department, isManager) VALUES ('Rob Gary', 'rob.gary@frogdesign.com', 1655, 'CTV', 0);
          var q = "INSERT INTO employee(name, email, isManager) VALUES ("+param("name")+
        ","+param("email")+","+num("isManager")+");" 
        db.run(q);
    }
    res.send("upserting employee");
};
