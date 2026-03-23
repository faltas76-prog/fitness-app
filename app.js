// SERVICE WORKER
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

// DETAILNÍ TRÉNINK
const weeklyPlan = {
  "Pondělí": [
    "Kliky – 4x 10",
    "Diamantové kliky – 3x 8",
    "Kliky s nohama nahoře – 3x 6",
    "Plank – 3x 45s"
  ],
  "Úterý": [
    "Dřepy – 4x 15",
    "Výpady – 3x 12/12",
    "Glute bridge – 3x 15",
    "Wall sit – 3x 45s"
  ],
  "Středa": [
    "Lehká chůze / mobilita",
    "Strečink 10 min"
  ],
  "Čtvrtek": [
    "Přítahy (hrazda/stůl) – 4x 8",
    "Australské shyby – 3x 10",
    "Superman – 3x 12",
    "Zkracovačky – 3x 20"
  ],
  "Pátek": [
    "Burpees – 4x 10",
    "Kliky – 3x 12",
    "Dřepy – 3x 15",
    "Mountain climbers – 3x 40s"
  ],
  "Sobota": [
    "Plank – 4x 45s",
    "Side plank – 3x 30s",
    "Leg raises – 3x 12",
    "Hollow hold – 3x 30s"
  ],
  "Neděle": [
    "Volno / regenerace"
  ]
};

// JÍDELNÍČEK
const meals = [
  "Protein + snídaně",
  "Kuřecí + rýže",
  "Ryba + zelenina",
  "Tvaroh / skyr"
];

// RENDER DNŮ
function renderWorkout() {
  const container = document.getElementById("workoutList");
  container.innerHTML = "";

  Object.keys(weeklyPlan).forEach(day => {
    const dayDiv = document.createElement("div");
    const title = document.createElement("h3");
    title.innerText = day;

    const ul = document.createElement("ul");

    let allChecked = true;

    weeklyPlan[day].forEach((exercise, i) => {
      const li = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";

      const key = day + i;

      checkbox.checked = localStorage.getItem(key) === "true";

      if (!checkbox.checked) allChecked = false;

      checkbox.onchange = () => {
        localStorage.setItem(key, checkbox.checked);
        renderWorkout();
      };

      li.appendChild(checkbox);
      li.appendChild(document.createTextNode(" " + exercise));
      ul.appendChild(li);
    });

    // STATUS DNE
    const status = document.createElement("p");

    if (allChecked) {
      status.innerText = "✔ Den splněn";
      status.style.color = "green";
    } else {
      status.innerText = "⏳ Nedokončeno";
      status.style.color = "orange";
    }

    dayDiv.appendChild(title);
    dayDiv.appendChild(ul);
    dayDiv.appendChild(status);

    container.appendChild(dayDiv);
  });
}

// JÍDLO
function renderMeals() {
  const el = document.getElementById("mealList");
  el.innerHTML = "";

  meals.forEach((item, index) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const key = "meal" + index;
    checkbox.checked = localStorage.getItem(key) === "true";

    checkbox.onchange = () => {
      localStorage.setItem(key, checkbox.checked);
    };

    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(" " + item));
    el.appendChild(li);
  });
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
      body: "Nezapomeň dnes splnit svůj plán 💪",
    });
  }
}

setTimeout(sendReminder, 5000);

// AI
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

  } catch {
    document.getElementById("aiResponse").innerText = "Chyba API.";
  }
}

// INIT
renderWorkout();
renderMeals();
displayWeight();
