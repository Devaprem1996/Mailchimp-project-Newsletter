const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');



let app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended:true }));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/signup.html')
});


app.post('/', function (req, res) {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.emailId;
    
    // step 1 : creating the data to add list in mailchimp audience and make it string formats using json .
    const data =
    {
        members:
            [
                {
                    email_address: email,
                    status: 'subscribed',
                    merge_fields:
                    {
                        FNAME: firstName,
                        LNAME: lastName,
                    }
                }
            ]
    };
    const JsonData = JSON.stringify(data);

    // step2: setting up the https module (request);
    const url = "https://us9.api.mailchimp.com/3.0/lists/ae670fae56";
    const options = {
        method: 'post',
        auth: 'deva1:d2b3a4d8af3ea00c06b9ef9fd73d231d-us9',
    };
    
    // finally ; create a https request() and merge to JsonData to send the details of login to mailchimp server.
    const request = https.request(url, options, function (response) {
        
        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
        } else {
            res.sendFile(__dirname + '/failure.html');
        };
        
        response.on('data', function (data) {
            console.log(JSON.parse(data));
        });
    
    })

    request.write(JsonData);
    request.end();
    

});

app.post('/failure', function (req, res) {
    res.redirect('/');
})

app.listen(process.env.PORT || 3000, function (req, res) {
    console.log('server is running on port 3000');
});


// mailchimp api key
// d2b3a4d8af3ea00c06b9ef9fd73d231d-us9

// list id
// ae670fae56

// url
//  "https://$API_SERVER.api.mailchimp.com/3.0/lists/$list_id/members" 