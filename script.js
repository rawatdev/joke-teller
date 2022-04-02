const audioElement = document.getElementById("audio");
const button = document.getElementById("button");
const jokeEl = document.querySelector(".joke");

// Typing Effect Variables
let i = 0;
let text = "";
let speed = 50; /* The speed/duration of the effect in milliseconds */

// Disable/Enable Button
function toggleButton() {
  button.disabled = !button.disabled;
}

// Passing Joke to VoiceRSS API
function tellMe(joke) {
  VoiceRSS.speech({
    key: "27e2cee5b67f46e2a1e1e9d736a6af8f",
    src: joke,
    hl: "en-us",
    r: 0,
    c: "mp3",
    f: "44khz_16bit_stereo",
    ssml: false,
  });
}

// Typing Effect
function typeWriter(text) {
  if (i < text.length) {
    jokeEl.textContent += text.charAt(i);
    i++;
    setTimeout(() => typeWriter(text), speed);
  } else {
    i = 0;
  }
}

// Get Jokes from Joke API
async function getJokes() {
  const apiUrl =
    "https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit";

  let joke = "";
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.setup) {
      joke = `${data.setup} ... ${data.delivery}`;
    } else {
      joke = data.joke;
    }
    // Typing Effect
    jokeEl.textContent = "";
    if (joke.length > 200) {
      jokeEl.classList.add("text-sm");
    }
    typeWriter(joke);
    // Text-to-Speech
    tellMe(joke);

    // Disable Button
    toggleButton();
  } catch (err) {
    // Catch Errors here
    console.log("whoops", err);
  }
}

// Event Listeners
button.addEventListener("click", getJokes);

audioElement.addEventListener("ended", toggleButton);
