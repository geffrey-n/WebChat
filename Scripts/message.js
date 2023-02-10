// Imorting the global variables from the user.js file
import { socket, userPage, messagePage } from "./user.js";

// Declaration of global variables
let userName = document.getElementById("name");
let showOnlineUsers = document.getElementById("online-users");
let onlineUsers = document.getElementById("users");
let messageBox = document.getElementsByClassName("message")[0];
let exit = document.getElementById("exit");
let userMessage = document.getElementById("text-message");
let sendButton = document.getElementById("send-button");

//Event Listener for displaying the online users
showOnlineUsers.addEventListener("click", function () {
  if (showOnlineUsers.value === "Show Online Users") {
    onlineUsers.style.display = "block";
    messageBox.style.opacity = "0.1";
    showOnlineUsers.value = "Close";
  } else if (showOnlineUsers.value === "Close") {
    onlineUsers.style.display = "none";
    messageBox.style.opacity = "1";
    showOnlineUsers.value = "Show Online Users";
  }
});

// Event Listener for getting back to the user page
exit.addEventListener("click", function () {
  socket.emit("user-left", userName.value);
  userPage.style.display = "block";
  messagePage.style.display = "";
});

// Event Listener for displaying the user input in the message box
sendButton.addEventListener("click", function (event) {
  let messageInput = `
  <div class="message-send">
      <div class="send-message">
        <span id="username">You</span>
        <br />
        ${userMessage.value}
      </div>
      </div> `;
  document.getElementsByClassName("message")[0].innerHTML += messageInput;
  socket.emit("send-message", userMessage.value, userName.value);
  messageBox.scrollTop = messageBox.scrollHeight;
  userMessage.value = "";
});

userMessage.addEventListener("keypress", function (event) {
  if (event.key == "Enter") {
    let messageInput = `
  <div class="message-send">
      <div class="send-message">
        <span id="username">You</span>
        <br />
        ${userMessage.value}
      </div>
      </div> `;
    document.getElementsByClassName("message")[0].innerHTML += messageInput;
    socket.emit("send-message", userMessage.value, userName.value);
    messageBox.scrollTop = messageBox.scrollHeight;
    userMessage.value = "";
  }
});

// Getting the received message from the server and displaying it in the message box
socket.on("receive-message", (message, name) => {
  let receiveMessage = `  <div class="receive-message">
            <span id="username">${name}</span>
            <br />
           ${message}
          </div>`;
  document.getElementsByClassName("message")[0].innerHTML += receiveMessage;
  messageBox.scrollTop = messageBox.scrollHeight;
});

// Getting the user status from the server and displaying it in the message box
socket.on("user-name", (name, status) => {
  if (name === userName.value) {
    let userStatus = `  <div class="connection">
            <div id="user-status">You joined the chat</div>
          </div>`;
    document.getElementsByClassName("message")[0].innerHTML += userStatus;
    messageBox.scrollTop = messageBox.scrollHeight;
  } else {
    let userStatus = `  <div class="connection">
            <div id="user-status">${name} ${status} the chat</div>
          </div>`;
    document.getElementsByClassName("message")[0].innerHTML += userStatus;
    messageBox.scrollTop = messageBox.scrollHeight;
  }
});

// Getting the online users from the server and displaying it in the message box
socket.on("online-users", (name) => {
  document.getElementById("users").replaceChildren();
  name.forEach((element) => {
    let onlineStatus = `
  <ul>
     <li>${element}</li>
  </ul>`;
    document.getElementById("users").innerHTML += onlineStatus;
  });
});
