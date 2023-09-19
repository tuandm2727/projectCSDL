const dbConn  = require('../lib/db');

const subjectSearch = (req, res, next) => {
    let dataSearch = req.query.dataSearch;
    if (dataSearch == undefined || dataSearch == ''){
        dbConn.query('SELECT * FROM subject ORDER BY id desc',function(err,result)     {
            if(result.rowCount == 0) {
                req.flash('error', err);
                res.render('subjects/subjectList',{data:'', dataSearch: ''});
            } else {
                res.render('subjects/subjectList',{data:result.rows, dataSearch: ''});
            }
        });
    } else {
        dbConn.query('SELECT * FROM subject WHERE name LIKE $1 ORDER BY id desc', ['%' + dataSearch + '%'],function(err,result)     {
            if(result == undefined || result.rowCount == 0) {
                req.flash('error', err);
                res.render('subjects/subjectList',{data:'', dataSearch: dataSearch});
            } else {
                res.render('subjects/subjectList',{data:result.rows, dataSearch: dataSearch});
            }
        });
    }
}


const subjectViewAdd = (req, res, next) => {
    res.render('subjects/subjectAdd', {
        name: '',
        code: '',
        total_hours: '',
        room_id:''

    })
}

const subjectSave = (req, res, next) => {
    let name = req.body.name;
    let code = req.body.code;
    let total_hours = req.body.total_hours;
    let room_id = '';
    if (req.body.room_id == ''){
        room_id = null
    } else {
        room_id = req.body.room_id;
    }
    let errors = false;

    if(name.length === 0) {
        errors = true;
        console.log('error');
        // set flash message
        req.flash('error', "Please enter name");
        // render to add.ejs with flash message
        res.render('subjects/subjectAdd', {
            name: name,
            code: code,
            total_hours: total_hours,
            room_id: room_id
        })
    }

    // if no error
    if(!errors) {
        var form_data = [
            name,code,total_hours,room_id
        ];
        // insert query
        dbConn.query('INSERT INTO subject(name, code, total_hours, room_id) VALUES ($1, $2, $3, $4);',
            form_data,function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    // render to add.ejs
                    res.render('subjects/subjectAdd', {
                        name: name,
                        code: code,
                        total_hours: total_hours,
                        room_id: room_id
                    })
                } else {
                    req.flash('success', 'subject successfully added');
                    res.redirect('/subjects');
                }
            })
    }
}

const subjectViewEdit = (req, res, next) => {
    let id = req.params.id;

    dbConn.query('SELECT * FROM subject WHERE id = ' + id, function(err, result, fields) {
        if(err) throw err

        // if user not found
        if (result.length <= 0) {
            req.flash('error', 'User not found with id = ' + id)
            res.redirect('subjects/subjectList')
        }
        // if user found
        else {
            // render to edit.ejs
            res.render('subjects/subjectEdit', {
                id: result.rows[0].id,
                name: result.rows[0].name,
                code: result.rows[0].code,
                total_hours: result.rows[0].total_hours,
                room_id: result.rows[0].room_id
            })
        }
    })
}

const subjectUpdate = (req, res, next) => {
    let id = req.params.id;
    let name = req.body.name;
    let code = req.body.code;
    let total_hours = req.body.total_hours;
    let room_id = '';
    if (req.body.room_id == ''){
        room_id = null
    } else {
        room_id = req.body.room_id;
    }
    let errors = false;

    if(name.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name");
        // render to add.ejs with flash message
        res.render('subjects/subjectEdit', {
            id: req.params.id,
            name: name,
            code: code,
            total_hours: total_hours,
            room_id: room_id
        })
    }

    // if no error
    if( !errors ) {

        var form_data = [
            name,code,total_hours,room_id
        ];
        // update query
        dbConn.query('UPDATE public.subject SET name= $1, code= $2, total_hours= $3, room_id= $4 WHERE id = ' + id
            , form_data, function(err, result) {
                //if(err) throw err
                if (err) {
                    // set flash message
                    req.flash('error', err)
                    // render to edit.ejs
                    res.render('subjects/subjectEdit', {
                        id: req.params.id,
                        name: name,
                        code: code,
                        total_hours: total_hours,
                        room_id: room_id
                    })
                } else {
                    req.flash('success', 'subject successfully updated');
                    res.redirect('/subjects');
                }
            })
    }
}

const subjectDelete = (req, res, next) => {
    let id = req.params.id;

    dbConn.query('DELETE FROM subject WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to user page
            res.redirect('/subjects')
        } else {
            // set flash message
            req.flash('success', 'subject successfully deleted! ID = ' + id)
            // redirect to user page
            res.redirect('/subjects')
        }
    })
}

module.exports = {subjectSearch, subjectViewAdd, subjectSave, subjectViewEdit, subjectUpdate,subjectDelete}
