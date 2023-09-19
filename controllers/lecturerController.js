const dbConn  = require('../lib/db');

const lecturerSearch = (req, res, next) => {
    let dataSearch = req.query.dataSearch;
    if (dataSearch == undefined || dataSearch == ''){
        dbConn.query('SELECT * FROM lecturer ORDER BY id desc',function(err,result)     {
            if(result.rowCount == 0) {
                req.flash('error', err);
                res.render('lecturers/lecturerList',{data:'', dataSearch: ''});
            } else {
                res.render('lecturers/lecturerList',{data:result.rows, dataSearch: ''});
            }
        });
    } else {
        dbConn.query('SELECT * FROM lecturer WHERE name LIKE $1 ORDER BY id desc', ['%' + dataSearch + '%'],function(err,result)     {
            if(result == undefined || result.rowCount == 0) {
                req.flash('error', err);
                res.render('lecturers/lecturerList',{data:'', dataSearch: dataSearch});
            } else {
                res.render('lecturers/lecturerList',{data:result.rows, dataSearch: dataSearch});
            }
        });
    }
}


const lecturerViewAdd = (req, res, next) => {
    res.render('lecturers/lecturerAdd', {
        name: '',
        code: '',
        birthday:'',
        gender:''

    })
}

const lecturerSave = (req, res, next) => {
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
        res.render('lecturers/lecturerAdd', {
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
        dbConn.query('INSERT INTO lecturer(name, code, birthday, gender) VALUES ($1, $2, $3, $4);',
            form_data,function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    // render to add.ejs
                    res.render('lecturers/lecturerAdd', {
                        name: name,
                        code: code,
                        birthday: birthday,
                        gender: gender
                    })
                } else {
                    req.flash('success', 'lecturer successfully added');
                    res.redirect('/lecturers');
                }
            })
    }
}

const lecturerViewEdit = (req, res, next) => {
    let id = req.params.id;

    dbConn.query('SELECT * FROM lecturer WHERE id = ' + id, function(err, result, fields) {
        if(err) throw err

        // if user not found
        if (result.length <= 0) {
            req.flash('error', 'User not found with id = ' + id)
            res.redirect('lecturers/lecturerList')
        }
        // if user found
        else {
            // render to edit.ejs
            res.render('lecturers/lecturerEdit', {
                id: result.rows[0].id,
                name: result.rows[0].name,
                code: result.rows[0].code,
                birthday: result.rows[0].birthday,
                gender: result.rows[0].gender
            })
        }
    })
}

const lecturerUpdate = (req, res, next) => {
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
        res.render('lecturers/lecturerEdit', {
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
        dbConn.query('UPDATE public.lecturer SET name= $1, code= $2, birthday= $3, gender= $4 WHERE id = ' + id
            , form_data, function(err, result) {
                //if(err) throw err
                if (err) {
                    // set flash message
                    req.flash('error', err)
                    // render to edit.ejs
                    res.render('lecturers/lecturerEdit', {
                        id: req.params.id,
                        name: name,
                        code: code,
                        birthday: birthday,
                        gender: gender
                    })
                } else {
                    req.flash('success', 'lecturer successfully updated');
                    res.redirect('/lecturers');
                }
            })
    }
}

const lecturerDelete = (req, res, next) => {
    let id = req.params.id;

    dbConn.query('DELETE FROM lecturer WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to user page
            res.redirect('/lecturers')
        } else {
            // set flash message
            req.flash('success', 'lecturer successfully deleted! ID = ' + id)
            // redirect to user page
            res.redirect('/lecturers')
        }
    })
}

module.exports = {lecturerSearch, lecturerViewAdd, lecturerSave, lecturerViewEdit, lecturerUpdate,lecturerDelete}
