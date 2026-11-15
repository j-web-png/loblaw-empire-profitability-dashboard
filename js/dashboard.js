const colors = {
  loblaw: "#176b87",
  empire: "#e29a3b"
};

function makeChart(elementId, labels, values, title) {
  const canvas = document.getElementById(elementId);

  if (!canvas) return;

  new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: title,
        data: values,
        backgroundColor: labels.map(label =>
          label.includes("Loblaw")
            ? colors.loblaw
            : colors.empire
        ),
        borderRadius: 6,
        barThickness: 45
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: context => context.raw + "%"
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 40,
          ticks: {
            callback: value => value + "%"
          },
          title: {
            display: true,
            text: "Margin (%)"
          }
        }
      }
    }
  });
}

// Gross margin
const gross = financialData.grossMargin;

makeChart(
  "grossChart",
  gross.map(d => `${d.company} (${d.period})`),
  gross.map(d => d.value),
  "Gross Profit Margin"
);

const grossDifference =
  gross[0].value - gross[1].value;

document.getElementById("grossAnalysis").textContent =
  `The supplied figures show a ${grossDifference.toFixed(1)} ` +
  `percentage-point difference (${(grossDifference * 100).toFixed(0)} bps) ` +
  `in favour of Loblaw. The comparison uses different reporting periods ` +
  `and requires further verification.`;

// EBITDA margin
const ebitda = financialData.ebitdaMargin;

makeChart(
  "ebitdaChart",
  ebitda.map(d => `${d.company} (${d.period})`),
  ebitda.map(d => d.value),
  "Adjusted EBITDA Margin"
);

const loblaw = ebitda.filter(d => d.company === "Loblaw");
const empire = ebitda.filter(d => d.company === "Empire");

const differences = [];

loblaw.forEach(l => {
  empire.forEach(e => {
    differences.push(l.value - e.value);
  });
});

document.getElementById("ebitdaAnalysis").textContent =
  `The supplied figures show a Loblaw EBITDA margin advantage ` +
  `ranging from ${Math.min(...differences).toFixed(1)} to ` +
  `${Math.max(...differences).toFixed(1)} percentage points ` +
  `(${Math.min(...differences) * 100}–${Math.max(...differences) * 100} bps). ` +
  `These are indicative cross-period comparisons, not matched-period results.`;
