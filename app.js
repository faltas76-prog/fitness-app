// ===== DATA =====
const weeklyPlan = {
  "Pondělí": ["Kliky 4x10","Plank 3x45s"],
  "Úterý": ["Dřepy 4x15","Výpady"],
  "Středa": ["Mobilita"],
  "Čtvrtek": ["Shyby","Core"],
  "Pátek": ["Burpees","Kliky"],
  "Sobota": ["Core"],
  "Neděle": ["Volno"]
};

// ===== RENDER =====
function renderWorkout() {
  const container = document.getElementById("workoutList");
  container.innerHTML = "";

  let total = 0;
  let done = 0;

  Object.keys(weeklyPlan).forEach(day => {

    const wrapper = document.createElement("div");
    wrapper.className = "day";

    const header = document.createElement("div");
    header.className = "day-header";
    header.innerText = day;

    const content = document.createElement("div");
    content.className = "day-content";

    header.onclick = () => {
      content.style.display =
        content.style.display === "block" ? "none" : "block";
    };

    weeklyPlan[day].forEach((exercise, i) => {
      total++;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";

      const key = day + i;
      checkbox.checked = localStorage.getItem(key) === "true";

      if (checkbox.checked) done++;

      checkbox.onchange = () => {
        localStorage.setItem(key, checkbox.checked);
        renderWorkout();
        updateStreak();
      };

      const label = document.createElement("label");
      label.appendChild(checkbox);
      label.append(" " + exercise);

      content.appendChild(label);
      content.appendChild(document.createElement("br"));
    });

    wrapper.appendChild(header);
    wrapper.appendChild(content);

    container.appendChild(wrapper);
  });

  updateProgress(done, total);
}

// ===== PROGRESS =====
function updateProgress(done, total) {
  const percent = Math.round((done / total) * 100);
  document.getElementById("progress").innerText =
    "📊 Progres: " + percent + "%";
}

// ===== STREAK =====
function updateStreak() {
  let streak = parseInt(localStorage.getItem("streak")) || 0;

  streak++;
  localStorage.setItem("streak", streak);

  document.getElementById("streak").innerText =
    "🔥 Streak: " + streak + " dní";
}

// ===== TIMER =====
let timer;
function startTimer(seconds) {
  let time = seconds;

  clearInterval(timer);

  timer = setInterval(() => {
    document.getElementById("timer").innerText =
      "⏱️ " + time + "s";
    time--;

    if (time < 0) {
      clearInterval(timer);
      document.getElementById("timer").innerText = "✔ hotovo";
    }
  }, 1000);
}

// ===== VÁHA + GRAF =====
function saveWeight() {
  const weight = document.getElementById("weightInput").value;

  let weights = JSON.parse(localStorage.getItem("weights")) || [];
  weights.push(weight);

  localStorage.setItem("weights", JSON.stringify(weights));

  drawChart();
}

function drawChart() {
  const ctx = document.getElementById("weightChart");

  const weights = JSON.parse(localStorage.getItem("weights")) || [];

  new Chart(ctx, {
    type: "line",
    data: {
      labels: weights.map((_, i) => i + 1),
      datasets: [{
        label: "Váha",
        data: weights
      }]
    }
  });
}

// ===== AI =====
async function askAI() {
  const input = document.getElementById("aiInput").value;

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
        { role: "user", content: input }
      ]
    })
  });

  const data = await response.json();
  document.getElementById("aiResponse").innerText =
    data.choices[0].message.content;
}

// ===== INIT =====
renderWorkout();
drawChart();
