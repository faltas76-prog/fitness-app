// SERVICE WORKER
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

// DATA
const workouts = [
  "Pondělí – Trénink",
  "Úterý – Trénink",
  "Středa – Volno",
  "Čtvrtek – Trénink",
  "Pátek – Trénink",
  "Sobota – Core",
  "Neděle – Volno"
];

const meals = [
  "Snídaně: ovesná kaše + protein",
  "Oběd: kuřecí + rýže",
  "Večeře: ryba + zelenina",
  "Snack: tvaroh / skyr"
];

// RENDER
function renderList(list, elementId) {
  const el = document.getElementById(elementId);
  el.innerHTML = "";

  list.forEach((item, index) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.onchange = () => saveState(elementId, index, checkbox.checked);

    checkbox.checked = loadState(elementId, index);

    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(" " + item));
    el.appendChild(li);
  });
}

function saveState(type, index, value) {
  localStorage.setItem(type + index, value);
}

function loadState(type, index) {
  return localStorage.getItem(type + index) === "true";
}

// VÁHA
function saveWeight() {
  const weight = document.getElementById("weightInput").value;
  localStorage.setItem("weight", weight);
  displayWeight();
}

function displayWeight() {
  const weight = localStorage.getItem("weight");
  document.getElementById("weightDisplay").innerText =
    weight ? "Aktuální váha: " + weight + " kg" : "";
}

// NOTIFIKACE
function requestNotificationPermission() {
  Notification.requestPermission();
}

function sendReminder() {
  if (Notification.permission === "granted") {
    new Notification("🏋️ Trénink!", {
      body: "Nezapomeň dnes cvičit 💪",
    });
  }
}

// TEST NOTIFIKACE (po 5s)
setTimeout(sendReminder, 5000);

// AI TRENÉR
async function askAI() {
  const input = document.getElementById("aiInput").value;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer TVUJ_API_KLIC"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Jsi fitness trenér. Odpovídej stručně."
          },
          {
            role: "user",
            content: input
          }
        ]
      })
    });

    const data = await response.json();
    document.getElementById("aiResponse").innerText =
      data.choices[0].message.content;

  } catch (error) {
    document.getElementById("aiResponse").innerText =
      "Chyba: zkontroluj API klíč.";
  }
}

// INIT
renderList(workouts, "workoutList");
renderList(meals, "mealList");
displayWeight();
