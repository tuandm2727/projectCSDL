const dbConn  = require('../lib/db');

const employeeSearch = (req, res, next) => {
    let dataSearch = req.query.dataSearch;
    if (dataSearch == undefined || dataSearch == ''){
        dbConn.query('SELECT * FROM employee ORDER BY id desc',function(err,result)     {
            if(result.rowCount == 0) {
                req.flash('error', err);
                res.render('employees/employeeList',{data:'', dataSearch: ''});
            } else {
                res.render('employees/employeeList',{data:result.rows, dataSearch: ''});
            }
        });
    } else {
        dbConn.query('SELECT * FROM employee WHERE name LIKE $1 ORDER BY id desc', ['%' + dataSearch + '%'],function(err,result)     {
            if(result == undefined || result.rowCount == 0) {
                req.flash('error', err);
                res.render('employees/employeeList',{data:'', dataSearch: dataSearch});
            } else {
                res.render('employees/employeeList',{data:result.rows, dataSearch: dataSearch});
            }
        });
    }
}


const employeeViewAdd = (req, res, next) => {
    res.render('employees/employeeAdd', {
        name: '',
        code: '',
        birthday:'',
        gender:''

    })
}

const employeeSave = (req, res, next) => {
    let name = req.body.name;
    let code = req.body.code;
    let birthday = req.body.birthday;
    let gender = req.body.gender;
    let errors = false;

    if(name.length === 0) {
        errors = true;
        console.log('error');
        // set flash message
        req.flash('error', "Please enter name");
        // render to add.ejs with flash message
        res.render('employees/employeeAdd', {
            name: name,
            code: code,
            birthday: birthday,
            gender: gender
        })
    }

    // if no error
    if(!errors) {
        var form_data = [
            name,code,birthday,gender
        ];
        console.log(form_data);
        // insert query
        dbConn.query('INSERT INTO employee(name, code, birthday, gender) VALUES ($1, $2, $3, $4);',
            form_data,function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    // render to add.ejs
                    res.render('employees/employeeAdd', {
                        name: name,
                        code: code,
                        birthday: birthday,
                        gender: gender
                    })
                } else {
                    req.flash('success', 'Employee successfully added');
                    res.redirect('/employees');
                }
            })
    }
}

const employeeViewEdit = (req, res, next) => {
    let id = req.params.id;

    dbConn.query('SELECT * FROM employee WHERE id = ' + id, function(err, result, fields) {
        if(err) throw err

        // if user not found
        if (result.length <= 0) {
            req.flash('error', 'User not found with id = ' + id)
            res.redirect('employees/employeeList')
        }
        // if user found
        else {
            // render to edit.ejs
            res.render('employees/employeeEdit', {
                id: result.rows[0].id,
                name: result.rows[0].name,
                code: result.rows[0].code,
                birthday: result.rows[0].birthday,
                gender: result.rows[0].gender
            })
        }
    })
}

const employeeUpdate = (req, res, next) => {
    let id = req.params.id;
    let name = req.body.name;
    let code = req.body.code;
    let birthday = req.body.birthday;
    let gender = req.body.gender;
    let errors = false;

    if(name.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name");
        // render to add.ejs with flash message
        res.render('employees/employeeEdit', {
            id: req.params.id,
            name: name,
            code: code,
            birthday: birthday,
            gender: gender
        })
    }

    // if no error
    if( !errors ) {

        var form_data = [
            name,code,birthday,gender
        ];
        // update query
        dbConn.query('UPDATE public.employee SET name= $1, code= $2, birthday= $3, gender= $4 WHERE id = ' + id
            , form_data, function(err, result) {
                //if(err) throw err
                if (err) {
                    // set flash message
                    req.flash('error', err)
                    // render to edit.ejs
                    res.render('employees/employeeEdit', {
                        id: req.params.id,
                        name: name,
                        code: code,
                        birthday: birthday,
                        gender: gender
                    })
                } else {
                    req.flash('success', 'employee successfully updated');
                    res.redirect('/employees');
                }
            })
    }
}

const employeeDelete = (req, res, next) => {
    let id = req.params.id;

    dbConn.query('DELETE FROM employee WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to user page
            res.redirect('/employees')
        } else {
            // set flash message
            req.flash('success', 'employee successfully deleted! ID = ' + id)
            // redirect to user page
            res.redirect('/employees')
        }
    })
}

module.exports = {employeeSearch, employeeViewAdd, employeeSave, employeeViewEdit, employeeUpdate,employeeDelete}
