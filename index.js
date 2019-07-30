const rp = require("request-promise");
const config = require("./config.json");

function getGreeting(person) {
  var r = Math.random();
  if (r < 0.25) {
    return `Hi ${person}!`;
  } else if (r < 0.5) {
    return `Howdy ${person}!`;
  } else if (r < 0.75) {
    return `Hey ${person}`;
  } else {
    return `Yo ${person}, what's up?`;
  }
}

function sendHi(threadID, person) {
  console.log(`Sending hi to thread: ${threadID}`);
  return rp({
    method: "POST",
    uri: config.botAddress + "message",
    body: {
      password: config.password,
      message: getGreeting(person.split(" ")[0]),
      threadID,
      delayMillisMin: 4000,
      delayMillisMax: 14000
    },
    json: true
  });
}

exports.handler = async function(event, context) {
  console.log("Received event:");
  console.dir(event);

  switch (event.httpMethod) {
    case "POST":
      try {
        let body = JSON.parse(event.body);
        return sendHi(body.threadID, body.person)
          .then(() => ({ statusCode: "200", body: "Success" }))
          .catch(() => ({ statusCode: "500", body: "Internal Error" }));
      } catch (error) {
        return { statusCode: "400", body: "Invalid parameters: " + error };
      }
    default:
      return { statusCode: "400", body: "Unsupported Method" };
  }
};
