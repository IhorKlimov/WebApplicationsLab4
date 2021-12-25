const express = require('express')
const app = express()
const port = process.env.PORT || 80
fs = require('fs')
var bodyParser = require('body-parser')

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({extended: false})

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/lab4.html")
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

app.post('/saveDropdown', urlencodedParser, (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')

    const content = "title=" + req.body.title
        + ";content=" + req.body.content + ";"
        + ";html=" + req.body.html + ";";

    fs.writeFile('dropdown.txt', content, function (err) {
        if (err) return console.log(err);
        console.log("Saved file");

        fs.readFile("dropdown.txt", 'utf8', function (err, data) {
            if (err) {
                console.log(err);
            }
            res.send("response from /test " + data);
        });
    });
});

app.get('/getDropdown', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')

    fs.readFile("dropdown.txt", 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        }
        res.send(data);
    });
});

app.use(express.static(__dirname));