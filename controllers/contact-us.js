const express = require("express");
const https = require("https");
const router = express.Router();

const Mailchimp = require("mailchimp-api-v3");
const mailchimp = new Mailchimp("57c81d79138286b859ac9a773fb99237-us14");
const client = require("@mailchimp/mailchimp_marketing");
client.setConfig({
  apiKey: "57c81d79138286b859ac9a773fb99237-us14",
  server: "us14",
});

var mailchimpInstance = "us14",
  listUniqueId = "2d35290df9",
  mailchimpApiKey = "57c81d79138286b859ac9a773fb99237-us14";


router.post("/", async (req, res) => {
  var firstName = req.body.name;
  var email = req.body.email;
  var phone=req.body.phone
  var message = req.body.message;
  console.log(message);
  var data = {
    members: [
      {
        email_address: email,
        status: "unsubscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: message,
          PHNO:phone,
        },
      },
    ],
  };
  // Converting string data to JSON data
  const jsonData = JSON.stringify(data);
  const url = `https://${mailchimpInstance}.api.mailchimp.com/3.0/lists/${listUniqueId}`;
  const options = {
    method: "POST",
    auth: `${listUniqueId}:${mailchimpApiKey}`,
  };
  // On success send users to success, otherwise on failure template
  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
res.status(200).json({msg:'SUCCESS'})   
 } 
else {
  res.status(500).json({msg:'FAILED'})    }
  });
  request.write(jsonData);
  request.end();

  //sending notification to admin

  let result = await mailchimp.post("/campaigns", {
    type: "regular",
    recipients: {
      list_id: listUniqueId,
    },
    settings: {
      subject_line: "USER QUERY ALERT",
      from_name: "GoAutomate Inc",
      from_email: "hamzaashfaqidenbrid7866@gmail.com",
      reply_to: "hamzaashfaqidenbrid7866@gmail.com",
      title: "USER QUERY",
      template_id: 10024711,
    },
  });
  if (result) {
    const compaign_id = result.id;

    const run = async (compaign_id) => {
      const response = await client.campaigns.send(compaign_id);

      console.log("SUCCESS");
    };

    run(compaign_id);
  }
});

module.exports = router;
