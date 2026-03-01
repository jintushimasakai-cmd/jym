const STORAGE_KEY = "jym.workouts";

const form = document.getElementById("workout-form");
const list = document.getElementById("workout-list");
const emptyState = document.getElementById("empty-state");

let workouts = loadWorkouts();
renderWorkouts();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const exercise = String(formData.get("exercise") || "").trim();
  const weight = Number(formData.get("weight"));
  const reps = Number(formData.get("reps"));

  if (!exercise || Number.isNaN(weight) || Number.isNaN(reps) || reps <= 0 || weight < 0) {
    return;
  }

  workouts.unshift({
    id: crypto.randomUUID(),
    exercise,
    weight,
    reps,
  });

  saveWorkouts();
  renderWorkouts();
  form.reset();
  document.getElementById("exercise").focus();
});

list.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const button = target.closest("button[data-id]");
  if (!button) {
    return;
  }

  const id = button.dataset.id;
  workouts = workouts.filter((workout) => workout.id !== id);
  saveWorkouts();
  renderWorkouts();
});

function renderWorkouts() {
  list.innerHTML = "";

  if (workouts.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  for (const workout of workouts) {
    const item = document.createElement("li");
    item.className = "workout-item";
    item.innerHTML = `
      <div>
        <strong>${escapeHtml(workout.exercise)}</strong>
        <span class="meta">${workout.weight} lb × ${workout.reps} reps</span>
      </div>
      <button class="delete" data-id="${workout.id}" type="button">Delete</button>
    `;
    list.appendChild(item);
  }
}

function saveWorkouts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
}

function loadWorkouts() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function escapeHtml(input) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
