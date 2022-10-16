let mouseData = [];
let isInactiveData = [];

let apiKey = localStorage.getItem("upsideApiKey")
  ? localStorage.getItem("upsideApiKey")
  : "";

let user = localStorage.getItem("upsideUser")
  ? localStorage.getItem("upsideUser")
  : "";

let currentPosition = {
  x: 0,
  y: 0,
  time: new Date().toISOString(),
  url: window.location.href,
};

let isInactive = {
  stoppedTime: new Date().toISOString(),
  activatedTime: new Date().toISOString(),
  duration: 0,
};

document.addEventListener("visibilitychange", () => {
  const now = new Date();
  console.log(now);
  if (document.hidden) {
    isInactive.stoppedTime = now.toISOString();
  } else {
    isInactive.activatedTime = now.toISOString();
    isInactive.duration =
      (new Date(isInactive.activatedTime) - new Date(isInactive.stoppedTime)) /
      1000;
    isInactiveData.push(isInactive);
  }
});

document.addEventListener("mousemove", (e) => {
  currentPosition.x = e.clientX;
  currentPosition.y = e.clientY;
});

setInterval(() => {
  const newPosition = Object.assign(
    { time: new Date().toISOString(), url: window.location.href },
    { x: currentPosition.x, y: currentPosition.y }
  );

  if (mouseData.length < 1) {
    return mouseData.push(newPosition);
  }

  mouseData.push(newPosition);
}, 1000);

setInterval(() => {
  fetch("http://localhost:5000/data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({ mouseData, isInactiveData, user }),
  });
  mouseData = [];
  isInactiveData = [];
}, 5000);
