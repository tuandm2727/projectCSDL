const dbConn  = require('../lib/db');

const programSearch = (req, res, next) => {
    let dataSearch = req.query.dataSearch;
    if (dataSearch == undefined || dataSearch == ''){
        dbConn.query('SELECT * FROM program ORDER BY id desc',function(err,result)     {
            if(result.rowCount == 0) {
                req.flash('error', err);
                res.render('programs/programList',{data:'', dataSearch: ''});
            } else {
                res.render('programs/programList',{data:result.rows, dataSearch: ''});
            }
        });
    } else {
        dbConn.query('SELECT * FROM program WHERE name LIKE $1 ORDER BY id desc', ['%' + dataSearch + '%'],function(err,result)     {
            console.log(result);
            if(result == undefined || result.rowCount == 0) {
                req.flash('error', err);
                res.render('programs/programList',{data:'', dataSearch: dataSearch});
            } else {
                res.render('programs/programList',{data:result.rows, dataSearch: dataSearch});
            }
        });
    }
}


const programViewAdd = (req, res, next) => {
    res.render('programs/programAdd', {
        name: '',
        code: '',
        employee_id:''

    })
}

const programSave = (req, res, next) => {
    let name = req.body.name;
    let code = req.body.code;
    let employee_id = '';
    if (req.body.employee_id == ''){
        employee_id = null
    } else {
        employee_id = req.body.employee_id;
    }
    let errors = false;

    if(name.length === 0) {
        errors = true;
        console.log('error');
        // set flash message
        req.flash('error', "Please enter name");
        // render to add.ejs with flash message
        res.render('programs/programAdd', {
            name: name,
            code: code,
            employee_id: employee_id
        })
    }

    // if no error
    if(!errors) {
        var form_data = [
            name,code,employee_id
        ];
        console.log(form_data);
        // insert query
        dbConn.query('INSERT INTO program(name, code, employee_id) VALUES ($1, $2, $3);',
            form_data,function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    // render to add.ejs
                    res.render('programs/programAdd', {
                        name: name,
                        code: code,
                        employee_id: employee_id
                    })
                } else {
                    req.flash('success', 'program successfully added');
                    res.redirect('/programs');
                }
            })
    }
}

const programViewEdit = (req, res, next) => {
    let id = req.params.id;

    dbConn.query('SELECT * FROM program WHERE id = ' + id, function(err, result, fields) {
        if(err) throw err

        // if user not found
        if (result.length <= 0) {
            req.flash('error', 'User not found with id = ' + id)
            res.redirect('programs/programList')
        }
        // if user found
        else {
            // render to edit.ejs
            res.render('programs/programEdit', {
                id: result.rows[0].id,
                name: result.rows[0].name,
                code: result.rows[0].code,
                employee_id: result.rows[0].employee_id
            })
        }
    })
}

const programUpdate = (req, res, next) => {
    let id = req.params.id;
    let name = req.body.name;
    let code = req.body.code;
    if (req.body.employee_id == ''){
        employee_id = null
    } else {
        employee_id = req.body.employee_id;
    }
    let errors = false;

    if(name.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name");
        // render to add.ejs with flash message
        res.render('programs/programEdit', {
            id: req.params.id,
            name: name,
            code: code,
            employee_id: employee_id
        })
    }

    // if no error
    if( !errors ) {

        var form_data = [
            name,code,employee_id
        ];
        // update query
        dbConn.query('UPDATE public.program SET name= $1, code= $2, employee_id= $3 WHERE id = ' + id
            , form_data, function(err, result) {
                //if(err) throw err
                if (err) {
                    // set flash message
                    req.flash('error', err)
                    // render to edit.ejs
                    res.render('programs/programEdit', {
                        id: req.params.id,
                        name: name,
                        code: code,
                        employee_id: employee_id
                    })
                } else {
                    req.flash('success', 'program successfully updated');
                    res.redirect('/programs');
                }
            })
    }
}

const programDelete = (req, res, next) => {
    let id = req.params.id;

    dbConn.query('DELETE FROM program WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to user page
            res.redirect('/programs')
        } else {
            // set flash message
            req.flash('success', 'program successfully deleted! ID = ' + id)
            // redirect to user page
            res.redirect('/programs')
        }
    })
}

module.exports = {programSearch, programViewAdd, programSave, programViewEdit, programUpdate,programDelete}
