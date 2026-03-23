// SERVICE WORKER
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

// ====== DATA ======
const weeklyPlan = {
  "Pondělí": ["Kliky 4x10","Diamantové kliky 3x8","Plank 3x45s"],
  "Úterý": ["Dřepy 4x15","Výpady 3x12","Glute bridge 3x15"],
  "Středa": ["Mobilita","Strečink"],
  "Čtvrtek": ["Shyby 4x8","Australské shyby 3x10","Core"],
  "Pátek": ["Burpees 4x10","Kliky 3x12","Dřepy 3x15"],
  "Sobota": ["Core workout"],
  "Neděle": ["Regenerace"]
};

const days = Object.keys(weeklyPlan);

// ====== WORKOUT ======
function renderWorkout() {
  const container = document.getElementById("workoutList");
  container.innerHTML = "";

  let total = 0;
  let done = 0;

  days.forEach((day, dayIndex) => {

    const unlocked = dayIndex === 0 || isDayComplete(days[dayIndex - 1]);

    const dayDiv = document.createElement("div");
    const title = document.createElement("h3");

    title.innerText = unlocked ? day : "🔒 " + day;

    const ul = document.createElement("ul");

    let allChecked = true;

    weeklyPlan[day].forEach((exercise, i) => {
      total++;

      const li = document.createElement("li");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";

      const key = day + i;

      checkbox.checked = localStorage.getItem(key) === "true";

      if (checkbox.checked) done++;
      if (!checkbox.checked) allChecked = false;

      checkbox.disabled = !unlocked;

      checkbox.onchange = () => {
        localStorage.setItem(key, checkbox.checked);
        renderWorkout();
      };

      li.appendChild(checkbox);
      li.appendChild(document.createTextNode(" " + exercise));
      ul.appendChild(li);
    });

    const status = document.createElement("p");

    if (allChecked && unlocked) {
      status.innerText = "✔ Hotovo";
      status.style.color = "green";
    } else {
      status.innerText = unlocked ? "⏳ Probíhá" : "🔒 Zamčeno";
      status.style.color = "orange";
    }

    dayDiv.appendChild(title);
    dayDiv.appendChild(ul);
    dayDiv.appendChild(status);

    container.appendChild(dayDiv);
  });

  updateProgress(done, total);
}

function isDayComplete(day) {
  return weeklyPlan[day].every((_, i) =>
    localStorage.getItem(day + i) === "true"
  );
}

// ====== PROGRESS ======
function updateProgress(done, total) {
  const percent = Math.round((done / total) * 100);
  document.getElementById("progress").innerText =
    "📊 Týdenní progres: " + percent + "%";
}

// ====== TIMER ======
let timer;
function startTimer(seconds = 60) {
  let time = seconds;

  clearInterval(timer);

  timer = setInterval(() => {
    document.getElementById("timer").innerText =
      "⏱️ Pauza: " + time + "s";

    time--;

    if (time < 0) {
      clearInterval(timer);
      document.getElementById("timer").innerText = "✔ Konec pauzy";
    }
  }, 1000);
}

// ====== VÁHA ======
function saveWeight() {
  const weight = document.getElementById("weightInput").value;
  localStorage.setItem("weight", weight);
  displayWeight();
}

function displayWeight() {
  const weight = localStorage.getItem("weight");
  document.getElementById("weightDisplay").innerText =
    weight ? "⚖️ " + weight + " kg" : "";
}

// ====== NOTIFIKACE ======
function requestNotificationPermission() {
  Notification.requestPermission();
}

function sendReminder() {
  if (Notification.permission === "granted") {
    new Notification("🏋️ Trénink", {
      body: "Splň dnešní plán 💪"
    });
  }
}

// ====== AI ======
async function askAI() {
  const input = document.getElementById("aiInput").value;

  const context = `
  Uživatelský plán:
  ${JSON.stringify(weeklyPlan)}
  `;

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
          { role: "system", content: "Jsi fitness trenér." },
          { role: "system", content: context },
          { role: "user", content: input }
        ]
      })
    });

    const data = await response.json();
    document.getElementById("aiResponse").innerText =
      data.choices[0].message.content;

  } catch {
    document.getElementById("aiResponse").innerText = "Chyba AI.";
  }
}

// ====== INIT ======
renderWorkout();
displayWeight();
