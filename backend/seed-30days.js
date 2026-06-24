const Database = require('better-sqlite3');
const db = new Database('database.db');

function randomBetween(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function iso(date) { return date.toISOString(); }

function genSvg() {
  const points = [];
  let x = randomBetween(100, 180), y = randomBetween(130, 160);
  for (let i = 0; i < randomBetween(30, 55); i++) {
    x += randomBetween(-18, 18);
    y += randomBetween(-10, 10);
    points.push(x + ',' + y);
  }
  return '<svg width="550" height="270" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="white"/><polyline points="' + points.join(' ') + '" stroke="black" stroke-width="3" fill="none"/></svg>';
}

const deelnemers = [
  { id: 1, name: 'Jan' },
  { id: 2, name: 'Maria' }
];

const now = new Date();
const insertAttendance = db.prepare('INSERT INTO Attendances (deelnemerID, clockinDate, clockoutDate, workDuration) VALUES (?, ?, ?, ?)');
const insertSignature = db.prepare('INSERT INTO Signatures (deelnemerID, date, signature) VALUES (?, ?, ?)');

// Clear existing data
db.prepare('DELETE FROM Signatures').run();
db.prepare('DELETE FROM Attendances').run();
db.prepare('UPDATE Deelnemers SET clockedin = 0').run();

let attCount = 0, sigCount = 0;

for (const d of deelnemers) {
  for (let daysAgo = 30; daysAgo >= 1; daysAgo--) {
    const day = new Date(now);
    day.setDate(day.getDate() - daysAgo);
    if (day.getDay() === 0 || day.getDay() === 6) continue;

    if (Math.random() > 0.7) continue;

    const clockin = new Date(day);
    clockin.setHours(randomBetween(7, 9), randomBetween(0, 59), randomBetween(0, 59), 0);
    const durationMins = randomBetween(240, 540);
    const clockout = new Date(clockin.getTime() + durationMins * 60000);

    insertAttendance.run(d.id, iso(clockin), iso(clockout), durationMins);
    attCount++;

    if (Math.random() > 0.4) {
      insertSignature.run(d.id, iso(clockin), genSvg());
      sigCount++;
    }
  }
}

// Jan clocked in today (open attendance)
const today = new Date();
today.setHours(randomBetween(7, 9), randomBetween(0, 30), 0, 0);
insertAttendance.run(1, iso(today), null, null);
db.prepare('UPDATE Deelnemers SET clockedin = 1 WHERE id = 1').run();
attCount++;

console.log('Inserted ' + attCount + ' attendances, ' + sigCount + ' signatures');

const total = db.prepare('SELECT COUNT(*) as c FROM Attendances').get();
const sigs = db.prepare('SELECT COUNT(*) as c FROM Signatures').get();
const perPerson = db.prepare('SELECT deelnemerID, COUNT(*) as cnt FROM Attendances GROUP BY deelnemerID').all();
console.log('Total: ' + total.c + ' attendances, ' + sigs.c + ' signatures');
perPerson.forEach(r => console.log('  deelnemerID ' + r.deelnemerID + ': ' + r.cnt + ' records'));

console.log('\nLast 5 records:');
const sample = db.prepare('SELECT * FROM Attendances ORDER BY clockinDate DESC LIMIT 5').all();
sample.forEach(r => console.log(JSON.stringify(r)));
