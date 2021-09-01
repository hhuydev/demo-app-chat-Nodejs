const socket = io();
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");
/**get query param from url */
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

/**Template */
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;

// socket.emit("join", { username, room });

socket.on("message", (message) => {
  console.log(message);
  /**Dung mustache de render message ra html */
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    /**Format ngay thang nam bang thu vien Moment */
    createdAt: moment(message.createdAt).format("h:m a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $messageFormButton.setAttribute("disabled", "disabled");
  /**get gia tri input bang thuoc tinh name trong form */
  const mytext = e.target.textMessage.value;
  socket.emit("sendMessage", mytext, (error) => {
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();
    if (error) return console.log(error);
    if (!mytext) return;
    else console.log(mytext);
  });
});

socket.on("updatedText", (message) => {
  if (!message) return;
  console.log("This text has been arrived");
});

socket.on("locationMessage", (locationLink) => {
  // console.log(locationText);
  const html = Mustache.render(locationTemplate, {
    locationLink: locationLink.location,
    createdAt: moment(locationLink.createdAt).format("h:m a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

$sendLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation)
    return alert("Geolocation is not support for your browser!");
  $sendLocationButton.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition(async (position) => {
    const location = await position;

    socket.emit(
      "sendLocation",
      {
        latitude: location.coords.latitude,
        longtitude: location.coords.longitude,
      },
      /**Thiet lap event Acknowledgement -> de biet dc client nao dk su kien  */
      (callbackText) => {
        $sendLocationButton.removeAttribute("disabled");
        console.log(callbackText);
      }
    );
  });
});

socket.emit("join", { username, room }, (err) => {
  if (err) {
    alert(err);
    location.href = "/";
  }
});
