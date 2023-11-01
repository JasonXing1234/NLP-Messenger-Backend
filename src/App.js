import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router-dom';

import languageIcon from './img/languageIcon146.png';
import newMessageIcon from "./img/newMessageIcon200.png";
import headshot from "./img/headshot300.jpg";
import searchIcon from "./img/search-icon.png";
import newCallIcon from "./img/newCallIcon.png";

import currentMessagesIcon from "./img/footer/messages.png";
import videoCallsIcon from "./img/footer/videoCalls.png";
import peopleIcon from "./img/footer/people.png";
import connectIcon from "./img/footer/connect.png";

import info from "./info.js";

import Messages from './Messages.js';
// import GPT from './GPT.js';

const MenuBar = () => (
  <div id="menuBar">
    <img src={headshot} id="profileButton" className="menuBarIcon leftFloat menuLeft1 circle"/>
    {/* <Link to="/GPT" id="profileButton" className="menuBarIcon leftFloat menuLeft1 circle" >
      <img src={headshot} id="profileButton" className="menuBarIcon leftFloat menuLeft1 circle"/>
    </Link> */}
    <h1 className="menuBarTitle">Chats</h1>
    <img src={languageIcon} id="languageChangeButton" className="menuBarIcon rightFloat menuRight2"/>
    <img src={newMessageIcon} id="newMessageButton" className="menuBarIcon rightFloat menuRight1"/>
  </div>
)

const SearchBar = () => (
  <div id="searchBar">
    <div id="searchInputContainer">
      <img src={searchIcon} id="searchIcon" className="menuBarIcon"/>
      <input id="searchInput" type="text" placeholder="Search"/>
    </div>
  </div>
)

const CallIcon = () => (
  <div className="profile">
    <div id="newCallContainer" className="profilePicture">
      <img src={newCallIcon} id="newCallIcon"/>
    </div>
    <div className="profileName"><p>Create New Call</p></div>
  </div>
)

function ProfilePicture( friend ) {
  if (friend["online"]) {
    return (
      <div className="profilePictureContainer">
        <img src={ friend.photo } className="profilePicture"/>
        <div className="onlineIndicator"></div>
      </div>
    )
  } else {
    return (
      <div className="profilePictureContainer">
        <img src={ friend.photo } className="profilePicture"/>
      </div>
    )
  }
}

const Profile = ({ friend }) => (
  <div className="profile">
    { ProfilePicture(friend) }
    <div className="profileName"><p>{ friend.name }</p></div>
  </div>
)

const AvailableUsers = () => (
  <div id="availableUsersContainer">
    <div id="availableUsersBar">
      <CallIcon/>
      {Object.keys(info.friends).map((key, index) => (
        <Profile key={index} friend={info.friends[key]} />
      ))}
    </div>
  </div>
)

const Footer = () => (
  <div id="footerContainer">
    <div id="footer">
      <div className="footerButton">
        <img src={currentMessagesIcon} id="messagesButton" className="footerIcon"/>
        <p className="greyText">Messages</p>
      </div>
      <div className="footerButton">
        <img src={videoCallsIcon} id="videoCallsButton" className="footerIcon"/>
        <p className="greyText">Calls</p>
      </div>
      <div className="footerButton">
        <img src={peopleIcon} id="peopleButton" className="footerIcon"/>
        <p className="greyText">People</p>
      </div>
      <div className="footerButton">
        <img src={connectIcon} id="connectButton" className="footerIcon"/>
        <p className="greyText">Connect</p>
      </div>
    </div>
  </div>
)

function SeenMessageBlueDot ( messageThread ) {
  if (!messageThread.seen) {
    return ( <div className="messageUnreadInd" /> )
  } else {
    return null
  }
}

class MessageThread extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick = () => {
    console.log(info.friends[this.props.messageThread.peerId].name);
    this.props.nav("/Messages/" + this.props.messageThread.peerId);
  }
  render () {
    let isInvite = false;
    const lastMsg = this.props.messageThread.messages[this.props.messageThread.messages.length - 1];
    if (lastMsg && lastMsg.msg && lastMsg.msg.props && lastMsg.msg.props.children && Array.isArray(lastMsg.msg.props.children) && 
      lastMsg.msg.props.children[0] && lastMsg.msg.props.children[0].props && lastMsg.msg.props.children[0].props.children &&
      lastMsg.msg.props.children[0].props.children === "Invitation to Chat") {
      isInvite = true;
    }
    return (
      <div className="messageThreadSelect" onClick={this.handleClick}>
        <div className="messageThreadInfoLeft">
          { ProfilePicture(info.friends[this.props.messageThread.peerId]) }
          <div className="messageThreadPeek">
            <h3 className="messageTitle">{ info.friends[this.props.messageThread.peerId].name }</h3>
            {isInvite ? <p className="messageSnippet">Chat Invitation</p> : <p className="messageSnippet">{ lastMsg.msg }</p>}
          </div>
        </div>
        <div className="messageThreadInfoRight">
          <p className="messageTime">Nov 28</p>
          { SeenMessageBlueDot(this.props.messageThread) }
        </div>
      </div>
    )
  }
}


function MessageThreads() {
  const navigate = useNavigate();
  return (
    Object.keys(info.messageThreads).map(( thread, key ) => (
      <MessageThread 
        key={ key }
        messageThread={ info.messageThreads[thread] }
        nav={ navigate }
      />
    ))
  );
}

function Home() {
  return (
    <div>
      <MenuBar/>
      <div id="scrollable">
        <SearchBar/>
        <div>
          <AvailableUsers/>
        </div>
        <div id="messageBodyContainer">
          <div id="messageBody">
            <MessageThreads/>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

function App () {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Messages/:friend_id" element={<Messages />} />
          {/* <Route path="/GPT" element={<GPT />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
