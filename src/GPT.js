import { Configuration, OpenAIApi } from "openai";

// THIS FILE IS USED TO TEST OPENAI API

// Hard-coded API Key:
// const configuration = new Configuration({
//   apiKey: "your api key",
// });


/* Environment variable API Key:
  How to set the environment variable:
  Linux command:
  export REACT_APP_OPENAI_API_KEY=your API key

  *note that the api key should NOT be in quotations

  to check if it was set correctly run:
  echo $REACT_APP_OPENAI_API_KEY

  Windows Powershell command:
  $env:REACT_APP_OPENAI_API_KEY='your API KEY'

  *note that here your API key should be in single quotes
*/
const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});


const GPT35TurboMessage = [
  { role: "system", content: "You are a helpful assistant" },
  {
    role: "user",
    content: "Below you will find a message history. Each message will be labeled with 'A' or 'B'. 'A' labels signify the messages sent by the user, and 'B' labels signify the messages sent by the user's friend. Each message will also be numbered. You will also find a list of categories. If a message fits into a given category, it should be flagged. Here are the categories for what to flag for:\
    1. offensive\
    2. very off topic\
    3. manipulative\
    4. pyramid scheme\
    5. rude\
    6. Physically threatening\
    7. Financially dangerous\
    8. Very repetitive relative to the previous messages sent by the same person\
    9. Displaying inappropriate emotions for the situation\
    If a message falls into one of those categories can you return the number corresponding with the message, the number of the category the message falls into, and an explanation for why it was flagged? The output will be a json. Here's an example json response:\
    {\"response\": {\
    \"message index\": 4,\
    \"category index\": 7,\
    \"explanation\": \"The user's friend is trying to get the user to put a large amount of money into a new cryptocurrency. This is financially dangerous, because cryptocurrencies are typically volatile.\"\
    }\
    }\
    If no message should be flagged, return an empty list in this json format:\
    {\"response\": []\
    }\
    Give a json response in the same format as above for the following message history:\
    1 A: Hey, how's it going?\
    2 B: It's going good! How are you?\
    3 A: I'm great! Thanks for asking! I just got back from a trip to Puerto Rico!\
    4 B: No Way! What did you do there?\
    5 A: I spent most of my time at the beach.\
    6 B: Did you go scuba diving?\
    7: A: What the hell! Why would you even ask that! You know I don't have money for things like that!!!\
    8 B: Oh, my bad.\
    ",
  },
  {
    role: "assistant",
    content: "{\
      \"response\": {\
      \"message index\": 7,\
      \"category index\": 1,\
      \"explanation\": \"The user's message contains offensive language and is inappropriate for this conversation.\"\
      }\
      }\
      ",
  },
  {
    role: "user",
    content: "Give a json response in the same format as above for the following message history:\
    1 A: Hey, how's it going?\
    2 B: It's going good! How are you?\
    3 A: I'm doing good too!\
    4 B: That's cool! That reminds me of the Tupperware company I'm starting. You pay 50 dollars a month to get a new piece of Tupperware in a yearlong subscription service. For each friend you get subscribed, your subscription goes down by 15 dollars per month for that year. Doesn't that sound great?\
    5 A: Wow! That is really cool!\
    ",
  },
  // {
  //   role: "user",
  //   content: "Tell me a fun fact",
  // },
];

const openai = new OpenAIApi(configuration);
const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo", 
    messages: GPT35TurboMessage
});
const message = response.data.choices[0].message.content;
console.log(message)
var jsonObject = JSON.parse(message);
var messageIndex = jsonObject.response["message index"];
var categoryIndex = jsonObject.response["category index"];

console.log("message index:", messageIndex); 
console.log("category index: ", categoryIndex);



function GPT (props) {

  return (
    <div>
      <p> IN GPT </p>
    </div>
  );
}

export default GPT;