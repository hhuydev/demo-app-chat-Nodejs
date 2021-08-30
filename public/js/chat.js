const socket = io();
const $messageForm = document.querySelector("#formChat");
const $messageFormInput = $messageForm.querySelector(".textInput");
const $messageFormButton = $messageForm.querySelector(".submitBtn");
const $sendLocationButton = document.querySelector(".sendLocation");

socket.on("message", (message) => console.log(message));

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // if ($messageFormInput.value === "") {
  //   $messageFormButton.setAttribute("disabled", "disabled");
  //   return;
  // }
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
