import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


import info from "./info.js";

import backbutton from "./img/messaging/backbutton.png";
import videoCallsIcon from "./img/footer/videoCalls.png";
import callIcon from "./img/messaging/callIcon.png";
import sendMessageIcon from "./img/messaging/sendIcon.png";
import messageIcon from "./img/messaging/messageIcon.png";
import moonIcon from "./img/messaging/moonIcon.png";


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
];

const MessageHeaderBar = ({ friend, time, nav }) => (
    <div id="menuBar">
        <img src={backbutton} id="backbutton" className="menuBarIcon leftFloat menuLeft1" 
            onClick={ () => { nav("/") } }/>
        <img src={friend.photo} id="peerPhoto" className="menuBarIcon leftFloat menuLeft2 circle"/>
        <h3 className="leftFloat menuLeft3">{ friend.name }</h3>
        <img src={callIcon} id="callButton" className="menuBarIcon rightFloat menuRight2"/>
        <img src={videoCallsIcon} id="videoCallIcon" className="menuBarIcon rightFloat menuRight1"/>
    </div>
)

const FromMeBubble = ({ message }) => (
    <div className="bubbleWrapper">
        <div className="from messageBubble">
            <p>{message.msg}</p>
        </div>
    </div>
)

const FromPeerBubble = ({ message }) => (
    <div className="bubbleWrapper">
        <div className="to messageBubble">
            <p>{message.msg}</p>
        </div>
    </div>
)

const TimeInd = ({ time }) => (
    <div className="bubbleWrapper">
        <p className="bubbleTimeInd">{time}</p>
    </div>
)

function formatTime(millis) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    var t = new Date(millis);
    var formatted = (t.getHours() % 12 == 0 ? "12" : t.getHours() % 12) + ":" + ('0' + t.getMinutes()).slice(-2);
    formatted = (t.getHours() / 12 >= 1) ? formatted + " pm" : formatted + " am";
    formatted = months[t.getMonth()] + " " + t.getDate() + ", " + formatted;
    return formatted;
}

function MessageChain( friend_id ) {
    const messages = info.messageThreads[friend_id]["messages"];
    const chain = [];
    var ind = 0;
    var last_time = null;


    messages.forEach(message => {
        if ("time" in message) { 
            if (last_time == null || last_time < message["time"] - 3600000) {
                // var t = new Date(message["time"]);
                var formatted = formatTime(message["time"]);
                // formatted = t.getFullYear() + " " + t.getDate() + " " + formatted;
                chain.push(<TimeInd key={ind + "_time"} time={formatted}/>);
            }
            last_time = message["time"];
        }
        if (message.sender == 0) {
            chain.push(<FromMeBubble key={ind} message={message}/>)
        } else {
            chain.push(<FromPeerBubble key={ind} message={message}/>)
        }
        ind += 1;
    });
    return (
        <div className="messageChain">
            {chain}
        </div>
    )
}


function MessagePrompt_( friend_id ) {
  const [value, setValue] = useState("");
  const [height, setHeight] = useState("");
  const scrollRef = useRef(null);
  const friend = info.friends[friend_id];


  const sendMessage = () => {
    if (value.replace(/\s+/g, '').length !== 0) {
      info.messageThreads[friend_id].messages.push(
        { "sender": 0, "time": Date.now(), "msg": value },
      );
      setValue("");
    }
  }
  
  const handleChange = (event) => {
      setValue(event.target.value);
      event.target.style.height = "0px";
      event.target.style.height = (event.target.scrollHeight - 21) + "px";
      scrollRef.current.scrollIntoView();
  };


  return (
    <div>
      <div id="messagePrompt" ref={scrollRef} className="bottomMessageBar">
        <textarea
          id="messageTextArea"
          style={{ height: height }}
          rows="1"
          value={value}
          onChange={handleChange}
        />
        <img src={sendMessageIcon} id="sendMessageIcon" className="menuBarIcon" onClick={sendMessage} />
      </div>
    </div>
  );
}

function checkOutgoingMessage( friend_id ) {
  // here we will put the info to actually send the message history to chat GPT
  // and make sure the message being sent is appropriate
}

function checkIncomingMessage( friend_id ) {
  // here we will put the info to actually send the message history to chat GPT
  // and make sure all messages being recieved are appropriate
}

function formatMessageHistory(messageHistory) {
  let formattedMessages = messageHistory.map((message, index) => {
    const sender = message.sender === 0 ? 'A' : 'B';
    const text = `${index + 1} ${sender}: ${message.msg}`;
    return text;
  });

  const content = `Give a json response in the same format as above for the following message history:\n${formattedMessages.join('\n')}\n`;

  return { content };
}


function Messages (props) {
  const navigate = useNavigate();
  // find the friend for this page
  const friend_id = parseInt(useParams().friend_id, 10);
  var friend = info.friends[friend_id];
  info.messageThreads[friend_id]["seen"] = true;

  // scroll to the bottom 
  const messagesEndRef = useRef(null);
  useEffect(() => {
      scrollToBottom();
  }, []);
  const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView();
  };

  const formattedMessages = formatMessageHistory(info.messageThreads[friend_id].messages);

  console.log(formattedMessages);

  GPT35TurboMessage[GPT35TurboMessage.length - 1].content = formattedMessages;

  console.log(GPT35TurboMessage);


  // console.log(info.messageThreads[friend_id].messages)

  return (
    <div>
      <MessageHeaderBar friend={friend} nav={navigate} />
      <div class="alignPopup">
        <div id="messageChain">{MessageChain(friend_id)}</div>
        <div style={{ position: "relative", zIndex: 2 }}>
          {MessagePrompt_(friend_id)}
        </div>
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
}


export default Messages;
