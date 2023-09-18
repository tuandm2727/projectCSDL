const dbConn  = require('../lib/db');

const studentSearch = (req, res, next) => {
    let dataSearch = req.query.dataSearch;
    console.log(dataSearch);
    if (dataSearch == undefined || dataSearch == ''){
        dbConn.query('SELECT * FROM student ORDER BY id desc',function(err,result)     {
            if(result.rowCount == 0) {
                req.flash('error', err);
                res.render('students/studentList',{data:'', dataSearch: ''});
            } else {
                res.render('students/studentList',{data:result.rows, dataSearch: ''});
            }
        });
    } else {
        dbConn.query('SELECT * FROM student WHERE name LIKE $1 ORDER BY id desc', ['%' + dataSearch + '%'],function(err,result)     {
            console.log(result);
            if(result == undefined || result.rowCount == 0) {
                req.flash('error', err);
                res.render('students/studentList',{data:'', dataSearch: dataSearch});
            } else {
                res.render('students/studentList',{data:result.rows, dataSearch: dataSearch});
            }
        });
    }
}


const studentViewAdd = (req, res, next) => {
    res.render('students/studentAdd', {
        name: '',
        email: '',
        age:''
    })
}

const studentSave = (req, res, next) => {
    let name = req.body.name;
    let email = req.body.email;
    let age = req.body.age;
    let errors = false;

    if(name.length === 0 || email.length === 0) {
        errors = true;
        console.log('error');
        // set flash message
        req.flash('error', "Please enter name and email and position");
        // render to add.ejs with flash message
        res.render('students/studentAdd', {
            name: name,
            email: email,
            age: age
        })
    }

    // if no error
    if(!errors) {
        var form_data = [
            name,email,age
        ];
        console.log(form_data);
        // insert query
        dbConn.query('INSERT INTO student(name, email, age) VALUES ($1, $2, $3);',
            form_data,function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                // render to add.ejs
                res.render('students/studentAdd', {
                    name: name,
                    email: email,
                    age: age
                })
            } else {
                req.flash('success', 'Student successfully added');
                res.redirect('/students');
            }
        })
    }
}

const studentViewEdit = (req, res, next) => {
    let id = req.params.id;

    dbConn.query('SELECT * FROM student WHERE id = ' + id, function(err, result, fields) {
        if(err) throw err

        // if user not found
        if (result.length <= 0) {
            req.flash('error', 'User not found with id = ' + id)
            res.redirect('students/studentList')
        }
        // if user found
        else {
            // render to edit.ejs
            res.render('students/studentEdit', {
                id: result.rows[0].id,
                name: result.rows[0].name,
                email: result.rows[0].email,
                age: result.rows[0].age
            })
        }
    })
}

const studentUpdate = (req, res, next) => {
    let id = req.params.id;
    let name = req.body.name;
    let email = req.body.email;
    let age = req.body.age;
    let errors = false;

    if(name.length === 0 || email.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and email and position");
        // render to add.ejs with flash message
        res.render('students/studentEdit', {
            id: req.params.id,
            name: name,
            email: email,
            age: age
        })
    }

    // if no error
    if( !errors ) {

        var form_data = [
            name,email,age
        ];
        // update query
        dbConn.query('UPDATE public.student SET name= $1, email= $2, age= $3 WHERE id = ' + id
            , form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('students/studentEdit', {
                    id: req.params.id,
                    name: name,
                    email: email,
                    age: age
                })
            } else {
                req.flash('success', 'Student successfully updated');
                res.redirect('/students');
            }
        })
    }
}

const studentDelete = (req, res, next) => {
    let id = req.params.id;

    dbConn.query('DELETE FROM student WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to user page
            res.redirect('/students')
        } else {
            // set flash message
            req.flash('success', 'Student successfully deleted! ID = ' + id)
            // redirect to user page
            res.redirect('/students')
        }
    })
}

module.exports = {studentSearch, studentViewAdd, studentSave, studentViewEdit, studentUpdate,studentDelete}
