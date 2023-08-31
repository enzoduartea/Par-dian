const firebaseConfig = {
  apiKey: "AIzaSyDdVZpTDvPM3kxO8rai6V0boxlc9rk-8V0",
  authDomain: "friendschat-a9e50.firebaseapp.com",
  databaseURL: "https://friendschat-a9e50-default-rtdb.firebaseio.com",
  projectId: "friendschat-a9e50",
  storageBucket: "friendschat-a9e50.appspot.com",
  messagingSenderId: "43656559235",
  appId: "1:43656559235:web:07b20f3b391330ca7ef9b6",
};

firebase.initializeApp(firebaseConfig);

user_name = localStorage.getItem("name_of_user");
room_name = localStorage.getItem("room_name");

if (!user_name || !room_name) {
  console.error("user_name ou room_name não definidos corretamente.");
}

function send() {
  var msg = document.getElementById("msg").value;
  if (msg.trim() !== "") {
    firebase.database().ref(room_name).push({
      name: user_name,
      message: msg,
      like: 0,
    });
    document.getElementById("msg").value = "";
  }
}

function displayMessages(messages) {
  var outputDiv = document.getElementById("output");
  outputDiv.innerHTML = "";

  messages.forEach(function (message) {
    var name = message.name;
    var messageText = message.message;
    var like = message.like;

    var messageDiv = document.createElement("div");
    messageDiv.className = "message";

    var nameWithTick =
      "<h4>" + name + "<img class='user_tick' src='tick.png'></h4>";
    var messageContent = "<p>" + messageText + "</p>";
    var likeButton =
      "<button class='btn btn-warning' id='" +
      message.id +
      "' value='" +
      like +
      "' onclick='updateLike(this.id)'>";
    likeButton +=
      "<span class='glyphicon glyphicon-thumbs-up'></span> Curtidas: " +
      like +
      "</button>";

    messageDiv.innerHTML = nameWithTick + messageContent + likeButton;
    outputDiv.appendChild(messageDiv);
  });
}

function getData() {
  firebase
    .database()
    .ref("/" + room_name)
    .on("value", function (snapshot) {
      var messages = [];
      snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        if (childSnapshot.key !== "purpouse") {
          childData.id = childSnapshot.key;
          messages.push(childData);
        }
      });
      displayMessages(messages);
    });
}
getData();

function updateLike(message_id) {
  var button = document.getElementById(message_id);
  var likes = parseInt(button.value) + 1;

  firebase
    .database()
    .ref(room_name + "/" + message_id)
    .update({
      like: likes,
    });
}

function Logout() {
  localStorage.removeItem("name_of_user");
  localStorage.removeItem("room_name");
  window.location.replace("index (1).html");
}
