// const { GoogleGenerativeAI } = require('@google/generative-ai');
// require('dotenv').config();

// const genAI = new GoogleGenerativeAI('AIzaSyDsbn8fhEKeUOpPj5bwPYoemLv-fEIR990');
// const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// async function getRiskAnalysis(questionAnswers) {
//   const formatted = questionAnswers.map((qa, i) =>
//     `Q${i + 1}: ${qa.q}\nUser Answer: ${qa.a}`
//   ).join('\n\n');

//   const prompt = `
// Based on the user's responses to a financial risk profiling questionnaire, generate a personalized investment profile and asset allocation strategy. Include recommendations across asset types (stocks, mutual funds, SIPs, FDs, crypto, etc).

// Responses:
// ${formatted}
//   `;

//   const result = await model.generateContent(prompt);
//   return result.response.text();
// }

// module.exports = { getRiskAnalysis };
