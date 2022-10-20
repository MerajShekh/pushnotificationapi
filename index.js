let admin =require("firebase-admin");
const bodyParser = require('body-parser')
const express= require('express');
const app = express();
const {getAllUser,fetchDeviceToken,createUser} = require("./database.js");

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
let PORT = process.env.PORT || 5000

const serviceAccount = require("D:/Meraj/React Native/superchat-34597-firebase-adminsdk-serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.get("/users",async(req,res)=>{
    const {user}=req.body
    const token = await fetchDeviceToken(user)
    res.send(token)
    
})

app.post("/createUser",async(req,res)=>{
    const {name,email,deviceToken} = req.body
    const userId = await createUser(name,email,deviceToken)
    res.status(200).json({message:'',userId})
})


app.post('/pushNotification', async (req, res)=>{
        const {title,body,user} = req.body
       let token = await fetchDeviceToken(user)
       token = token.map(e=>e.tDeviceToken)
        let options={
            priority:"high",
            timeToLive:60 * 60 * 24
        }
    
    
        // let token = ['dObaT-q0QXmt3Njp6bHldO:APA91bECuw-LADMBeAwWJjFoZDs2lIvqn7JWE1_V95Lu5aQGT9PtlgrWmCTUr3Ar']
        
        let payload = {
            notification:{
                title:'fcm push notification new',
                body:'this is the body of fcm push notification'
            }
        }

        if (title) {
            payload.notification.title=title
        }
        if (body) {
            payload.notification.body=body
        }
        try {
            admin.messaging().sendToDevice(token,payload,options)
            .then(response=>{
                console.log('response',response)
                res.status(200).send(response)
            })
            .catch(error=>{
                console.log("Error sending message:",error)
                res.status(500).send(error)
            })

        } catch (error) {
            res.status(500).send(error)
        }
  })

  
app.listen(PORT,()=>console.log(`API Server is running on port ${PORT}`))