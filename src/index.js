const express = require("express");
const app = express();
const fetch = require('node-fetch');
// import {fetch} from 'node-fetch';
const cors = require('cors'); 
const PORT = 3000;
const urlSendVideo =  "https://open-api.tiktok.com/share/video/upload/";
const FormData = require('form-data')
const fs = require('fs')
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
const client_key = "aw9peiqeuy3zt46t";

const path = require('path');

const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    },
});

const upload = multer({storage: storage})

app.post('/enviar', upload.single('video'), async(req, res) => {
    const {name} = req.body;
    console.log(req.file);

    const body = {video: req.file}
    const url = urlSendVideo;
    const response = await fetch(urlSendVideo, {
        method: 'post',
        body: JSON.stringify(body),
        Headers: {'Content-type' : 'multform-data'}
    })
});


app.get('/oauth', (req, res) => {
    const csrfState = Math.random().toString(36).substring(2);
    res.cookie('csrfState', csrfState, { maxAge: 60000 });

    let url = 'https://www.tiktok.com/auth/authorize';

    url += '?client_key=aw9peiqeuy3zt46t';
    url += '&scope=user.info.basic,video.list';
    url += '&response_type=code';
    url += '&redirect_uri=https://www.tiktok.com/auth/authorize/';
    url += '&state=' + csrfState;

    res.redirect(url);
});

app.get('/redirect', (req, res) => {
    const { code, state } = req.query;
    console.log(req.query);
    const { csrfState } = req.cookies;
    if (state !== csrfState) {
        res.status(422).send('Invalid state');
        return;
    }

    let url_access_token = 'https://open-api.tiktok.com/oauth/access_token/';
    url_access_token += '?client_key=' + "aw9peiqeuy3zt46t";
    url_access_token += '&client_secret=' + "204d113bf65f622e0c1136ff4c4ec293";
    url_access_token += '&code=' + code;
    url_access_token += '&grant_type=authorization_code';

    fetch(url_access_token, {method: 'post'})
        .then(res => res.json())
        .then(json => {
            res.send(json);
        });
})



app.get('/', (req, res) => {
    res.render(__dirname + "/index.html");
})


app.post('/sendVideo', (req,res) => {

})

app.listen(PORT, () => {
    console.log("app runniing");
})
