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

renderList(workouts, "workoutList");
renderList(meals, "mealList");
displayWeight();
