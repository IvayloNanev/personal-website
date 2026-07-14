const categories = {
  distance: {
    defaults: ["km", "mi"],
    units: {
      km: { label: "Kilometers", singular: "kilometer", symbol: "km", toBase: v => v * 1000, fromBase: v => v / 1000 },
      mi: { label: "Miles", singular: "mile", symbol: "mi", toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
      m: { label: "Meters", singular: "meter", symbol: "m", toBase: v => v, fromBase: v => v },
      ft: { label: "Feet", singular: "foot", symbol: "ft", toBase: v => v * .3048, fromBase: v => v / .3048 },
      yd: { label: "Yards", singular: "yard", symbol: "yd", toBase: v => v * .9144, fromBase: v => v / .9144 },
      nmi: { label: "Nautical Miles", singular: "nautical mile", symbol: "nmi", toBase: v => v * 1852, fromBase: v => v / 1852 }
    }
  },
  temperature: {
    defaults: ["c", "f"],
    units: {
      c: { label: "Celsius", singular: "degree Celsius", symbol: "°C", toBase: v => v, fromBase: v => v },
      f: { label: "Fahrenheit", singular: "degree Fahrenheit", symbol: "°F", toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
      k: { label: "Kelvin", singular: "kelvin", symbol: "K", toBase: v => v - 273.15, fromBase: v => v + 273.15 }
    }
  },
  weight: {
    defaults: ["kg", "lb"],
    units: {
      kg: { label: "Kilograms", singular: "kilogram", symbol: "kg", toBase: v => v, fromBase: v => v },
      lb: { label: "Pounds", singular: "pound", symbol: "lb", toBase: v => v * .45359237, fromBase: v => v / .45359237 },
      g: { label: "Grams", singular: "gram", symbol: "g", toBase: v => v / 1000, fromBase: v => v * 1000 },
      oz: { label: "Ounces", singular: "ounce", symbol: "oz", toBase: v => v * .028349523125, fromBase: v => v / .028349523125 },
      st: { label: "Stone", singular: "stone", symbol: "st", toBase: v => v * 6.35029318, fromBase: v => v / 6.35029318 }
    }
  }
};

const els = {
  input: document.querySelector("#from-value"), output: document.querySelector("#to-value"),
  from: document.querySelector("#from-unit"), to: document.querySelector("#to-unit"),
  swap: document.querySelector("#swap-button"), convert: document.querySelector("#convert-button"),
  resultCard: document.querySelector(".result-card"),
  resultFrom: document.querySelector("#result-from"), resultTo: document.querySelector("#result-to"),
  note: document.querySelector("#conversion-note"), route: document.querySelector("#route-label")
};

let activeCategory = "distance";

function formatNumber(value) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 6 }).format(Number(value.toPrecision(10)));
}

function unitName(unit, value) {
  return Math.abs(value) === 1 ? unit.singular : unit.label.toLowerCase();
}

function populateUnits() {
  const category = categories[activeCategory];
  const options = Object.entries(category.units).map(([key, unit]) => `<option value="${key}">${unit.label}</option>`).join("");
  els.from.innerHTML = options;
  els.to.innerHTML = options;
  [els.from.value, els.to.value] = category.defaults;
  clearResult();
}

function clearResult() {
  els.output.textContent = "";
  els.resultFrom.textContent = "";
  els.resultTo.textContent = "";
  els.resultCard.classList.add("is-empty");
  updateLabels();
}

function updateLabels() {
  const units = categories[activeCategory].units;
  const from = units[els.from.value];
  const to = units[els.to.value];
  if (!from || !to) return;
  els.route.innerHTML = `${from.label} <span aria-hidden="true">◆</span> ${to.label}`;
  const one = to.fromBase(from.toBase(1));
  els.note.textContent = `ⓘ  1 ${from.singular} = ${formatNumber(one)} ${unitName(to, one)}`;
}

function convert() {
  if (els.input.value.trim() === "") {
    clearResult();
    els.input.focus();
    return;
  }
  const value = Number(els.input.value);
  const units = categories[activeCategory].units;
  const from = units[els.from.value];
  const to = units[els.to.value];
  const result = to.fromBase(from.toBase(value));
  const formatted = formatNumber(result);
  els.output.textContent = formatted;
  els.resultFrom.textContent = `${formatNumber(value)} ${unitName(from, value)}`;
  els.resultTo.textContent = `${formatted} ${unitName(to, result)}`;
  els.resultCard.classList.remove("is-empty");
  els.route.innerHTML = `${from.label} <span aria-hidden="true">◆</span> ${to.label}`;
  const one = to.fromBase(from.toBase(1));
  els.note.textContent = `ⓘ  1 ${from.singular} = ${formatNumber(one)} ${unitName(to, one)}`;
}

document.querySelectorAll(".category").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".category.active").classList.remove("active");
    button.classList.add("active");
    activeCategory = button.dataset.category;
    populateUnits();
  });
});

els.swap.addEventListener("click", () => {
  [els.from.value, els.to.value] = [els.to.value, els.from.value];
  clearResult();
});
els.convert.addEventListener("click", convert);
els.input.addEventListener("input", clearResult);
els.from.addEventListener("change", clearResult);
els.to.addEventListener("change", clearResult);
els.input.addEventListener("keydown", event => { if (event.key === "Enter") convert(); });

populateUnits();
