const fs = require('fs');

const filePath = './src/data/eventsData.js';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace all ₹ with Rs 
content = content.replace(/₹/g, 'Rs ');

// Rephrase "Elimination Rounds if Any: No"
content = content.replace(/'Elimination Rounds if Any: No\.?'/g, "'There will be no elimination rounds for this event.'");

// Rephrase "Elimination Rounds: Yes"
content = content.replace(/'Elimination Rounds: Yes'/g, "'Elimination rounds will be conducted before the finals.'");

// Rephrase "Elimination Rounds: No"
content = content.replace(/'Elimination Rounds: No'/g, "'There will be no elimination rounds for this event.'");

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Replacements completed successfully.');
