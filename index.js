var Promise = require("es6-promise").Promise,
  request = require("superagent"),
  md5 = require("md5");

var API_URL = ".api.mailchimp.com/3.0/lists/",
  DATACENTER = process.env.DATACENTER,
  API_KEY = process.env.API_KEY,
  LIST_ID = process.env.LIST_ID,
  USERNAME = process.env.USERNAME,
  STATUS = process.env.STATUS;

function urlForList() {
  return "https://" + DATACENTER + API_URL + LIST_ID + "/members/";
}

function urlForUser(email) {
  return urlForList() + md5(email);
}

function createSubscription(email, name, mergeFields) {
  var nameSplit = name ? name.split(" ") : [];
  var merge_fields = mergeFields || {};
  if (nameSplit[0]) {
    merge_fields.FNAME = nameSplit[0];
  }
  if (nameSplit[1]) {
    merge_fields.LNAME = nameSplit.slice(1).join(' ');
  }
  return new Promise(function(resolve, reject) {
    request
      .post(urlForList())
      .auth(USERNAME, API_KEY)
      .set("Accept", "application/json")
      .send({
        email_address: email,
        merge_fields: merge_fields,
        status: STATUS
      })
      .end(function(err, res) {
        if (err) {
          reject({ status: err.status, message: err.response.text });
        } else {
          var returnRes = {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
              message: "Subscribed"
            })
          };
          resolve(returnRes);
        }
      });
  });
}

exports.handler = function(event, context, callback) {
  var payload = JSON.parse(event.body);
  console.log("Invoking Lambda with payload", payload);
  createSubscription(payload.email, payload.name)
    .then(function(res) {
      console.log("MAILCHIMP SUCCESS", res);
      callback(null, res);
    })
    .catch(function(err) {
      console.log("MAILCHIMP ERROR", err);
      callback(err);
    });
};
