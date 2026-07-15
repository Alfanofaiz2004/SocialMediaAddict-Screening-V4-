const input = {
  svasScores: [1, 2, 3, 4, 5, 5],
  platforms: { instagram: 2, tiktok: 2, youtube: 1, twitter: 0 },
  sleepHours: 6,
  productivityImpact: 8,
};
const result = {
  zone: 'BERISIKO',
  detoxPercentage: 50,
  svasTotal: 20,
  svasCriteria: [{ label: 'test', score: 3 }],
  contextScores: { totalDuration: 5, sleepHours: 6, productivityImpact: 8 }
};

fetch('http://localhost:3000/api/results', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    respondentName: 'TestUser',
    input,
    result,
  })
}).then(r => r.json()).then(console.log).catch(console.error);
