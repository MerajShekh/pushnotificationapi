const mysql =require('mysql2/promise')

const pool = mysql.createPool({
    // host:'127.0.0.1',
    // user:'root',
    // password:'',
    // database:'notification',

    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})

 async function getAllUser(){
    try {
        const [row] = await pool.query(`SELECT * FROM tbl_user`)
    return row
    } catch (error) {
        return error.message
    }
}

async function fetchDeviceToken(user){
    try {
        const [row] = await pool.query(`SELECT tDeviceToken FROM tbl_user WHERE vUserName=?`,[user])
    return row
    } catch (error) {
        return error
    }
   
}

async function createUser(vUserName,vEmail,tDeviceToken){
    try {
        const [row] = await pool.query(`SELECT * FROM tbl_user where vUserName=?`,[vUserName])
        if (row.length) {
           const [update] =  await pool.query(`UPDATE tbl_user SET tDeviceToken = ? where vUserName=?`,[tDeviceToken,vUserName])
            return update.info
        }else{
            const [result] = await pool.query(`INSERT INTO tbl_user (vUserName,vEmail,tDeviceToken) VALUES(?,?,?)`,[vUserName,vEmail,tDeviceToken])
            return result.insertId
        }
        
        
    } catch (error) {
        return error.message
    }
    
}


module.exports = {getAllUser,fetchDeviceToken,createUser}

