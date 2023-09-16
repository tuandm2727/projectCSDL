const dbConn  = require('../lib/db');

const studentView = (req, res, next) => {
    dbConn.query('SELECT * FROM users ORDER BY id desc',function(err,result)     {
        if(result.rowCount == 0) {
            req.flash('error', err);
            res.render('students/studentList',{data:''});
        } else {
            res.render('students/studentList',{data:result.rows});
        }
    });

}

module.exports = {studentView}
