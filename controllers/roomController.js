const dbConn  = require('../lib/db');

const roomSearch = (req, res, next) => {
    let dataSearch = req.query.dataSearch;
    if (dataSearch == undefined || dataSearch == ''){
        dbConn.query('SELECT * FROM room ORDER BY id desc',function(err,result)     {
            if(result.rowCount == 0) {
                req.flash('error', err);
                res.render('rooms/roomList',{data:'', dataSearch: ''});
            } else {
                res.render('rooms/roomList',{data:result.rows, dataSearch: ''});
            }
        });
    } else {
        dbConn.query('SELECT * FROM room WHERE name LIKE $1 ORDER BY id desc', ['%' + dataSearch + '%'],function(err,result)     {
            if(result == undefined || result.rowCount == 0) {
                req.flash('error', err);
                res.render('rooms/roomList',{data:'', dataSearch: dataSearch});
            } else {
                res.render('rooms/roomList',{data:result.rows, dataSearch: dataSearch});
            }
        });
    }
}


const roomViewAdd = (req, res, next) => {
    res.render('rooms/roomAdd', {
        name: '',
        code: '',
        address:''

    })
}

const roomSave = (req, res, next) => {
    let name = req.body.name;
    let code = req.body.code;
    let address = req.body.address;
    let errors = false;

    if(name.length === 0) {
        errors = true;
        console.log('error');
        // set flash message
        req.flash('error', "Please enter name");
        // render to add.ejs with flash message
        res.render('rooms/roomAdd', {
            name: name,
            code: code,
            address: address
        })
    }

    // if no error
    if(!errors) {
        var form_data = [
            name,code,address
        ];
        // insert query
        dbConn.query('INSERT INTO room(name, code, address) VALUES ($1, $2, $3);',
            form_data,function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    // render to add.ejs
                    res.render('rooms/roomAdd', {
                        name: name,
                        code: code,
                        address: address
                    })
                } else {
                    req.flash('success', 'room successfully added');
                    res.redirect('/rooms');
                }
            })
    }
}

const roomViewEdit = (req, res, next) => {
    let id = req.params.id;

    dbConn.query('SELECT * FROM room WHERE id = ' + id, function(err, result, fields) {
        if(err) throw err

        // if user not found
        if (result.length <= 0) {
            req.flash('error', 'User not found with id = ' + id)
            res.redirect('rooms/roomList')
        }
        // if user found
        else {
            // render to edit.ejs
            res.render('rooms/roomEdit', {
                id: result.rows[0].id,
                name: result.rows[0].name,
                code: result.rows[0].code,
                address: result.rows[0].address
            })
        }
    })
}

const roomUpdate = (req, res, next) => {
    let id = req.params.id;
    let name = req.body.name;
    let code = req.body.code;
    let address = req.body.address;
    let errors = false;

    if(name.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name");
        // render to add.ejs with flash message
        res.render('rooms/roomEdit', {
            id: req.params.id,
            name: name,
            code: code,
            address: address
        })
    }

    // if no error
    if( !errors ) {

        var form_data = [
            name,code,address
        ];
        // update query
        dbConn.query('UPDATE public.room SET name= $1, code= $2, address= $3 WHERE id = ' + id
            , form_data, function(err, result) {
                //if(err) throw err
                if (err) {
                    // set flash message
                    req.flash('error', err)
                    // render to edit.ejs
                    res.render('rooms/roomEdit', {
                        id: req.params.id,
                        name: name,
                        code: code,
                        address: address
                    })
                } else {
                    req.flash('success', 'room successfully updated');
                    res.redirect('/rooms');
                }
            })
    }
}

const roomDelete = (req, res, next) => {
    let id = req.params.id;

    dbConn.query('DELETE FROM room WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to user page
            res.redirect('/rooms')
        } else {
            // set flash message
            req.flash('success', 'room successfully deleted! ID = ' + id)
            // redirect to user page
            res.redirect('/rooms')
        }
    })
}

module.exports = {roomSearch, roomViewAdd, roomSave, roomViewEdit, roomUpdate,roomDelete}
