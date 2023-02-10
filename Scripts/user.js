// Declaration of global variables
let userName = document.getElementById("name");
let roomId = document.getElementById("room");
let joinButton = document.getElementById("join");
export let userPage = document.getElementsByClassName("user-page")[0];
export let messagePage = document.getElementsByClassName("second-page")[0];
export let socket = io.connect("http://localhost:5000");

//Event Listener for getting the user name from the user
userName.addEventListener("keypress", function (event) {
  document.getElementById("error").innerHTML = "";
  if (event.key == "Enter") {
    roomId.focus();
  }
});

userName.addEventListener("change", function () {
  document.getElementById("error").innerHTML = "";
});

// Event Listener for getting the room ID from the user
roomId.addEventListener("keypress", function (event) {
  document.getElementById("optional").innerHTML = "";
  if (event.key == "Enter") {
    joinButton.focus();
  }
});

roomId.addEventListener("change", function () {
  document.getElementById("optional").innerHTML = "";
  joinButton.focus();
});

roomId.addEventListener("focusout", function () {
  document.getElementById("optional").innerHTML = "";
});

roomId.addEventListener("click", function () {
  document.getElementById("optional").innerHTML = "Optional";
});

roomId.addEventListener("focus", function () {
  document.getElementById("optional").innerHTML = "Optional";
});

// Event Listener for validating the user name and entering the message page
joinButton.addEventListener("click", function () {
  let alphabets = /^[A-Za-z]+$/;
  if (userName.value == "") {
    document.getElementById("error").innerHTML = "Please enter the user name";
  } else if (userName.value.length >= 3 && userName.value.match(alphabets)) {
    userPage.style.display = "none";
    messagePage.style.display = "block";
    socket.emit("user-connect", userName.value, roomId.value);
    socket.emit("join-room", roomId.value);
  } else if (userName.value.length < 3 || !userName.value.match(alphabets)) {
    userName.addEventListener("click", function () {
      userName.value = "";
    });
    document.getElementById("error").innerHTML = "Enter the valid user name";
  }
});
