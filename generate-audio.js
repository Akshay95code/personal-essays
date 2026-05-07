require('dotenv').config();
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY || API_KEY === 'your_key_here') {
  console.error('Error: Add your Google API key to the .env file.');
  process.exit(1);
}

const essayText = `
For most of the internet era, if you had an idea for a product, a tool, or a business, you needed a developer. Not because the idea required one, but because the act of building required one. The ability to code was the toll booth. And most people, no matter how sharp their thinking or how real their problem, could not pay it.

Vibe coding is dismantling that toll booth. A schoolteacher in Nairobi can now build a grading tool tailored to her exact classroom. A physiotherapist can create a patient tracking app that reflects how she actually works, not how some product team imagined she works. A first-generation entrepreneur who never went to university can ship software. These are not hypotheticals. They are already happening, and they are only going to accelerate.

The honest thing to say is that this is hard news for a certain kind of software engineering career. The developer who built their identity around being the only person in the room who could make things, that role is shrinking. I do not think we should pretend otherwise. But I also think this discomfort is the normal friction of any technological leap. The printing press was hard news for scribes. Spreadsheets were hard news for rooms full of human calculators. In each case, the world got more legible to more people, and that was worth it.

What vibe coding gives the world is not just faster software. It gives us ideas that never would have survived the translation from human to engineer. Every time a person with real domain knowledge had to explain what they needed to a developer who did not share that context, something was lost: a nuance, a workflow quirk, a piece of lived experience that never made it into the spec. Now the person with the insight can build the thing directly. The fidelity between idea and execution goes up dramatically.

The gatekeepers of creation were never villains. They were just people who happened to hold a scarce skill at a scarce moment. That moment is passing. What comes next belongs to whoever thinks most clearly about what actually needs to be built, and that is a much bigger, more interesting group of people than the one we had before.
`.trim();

function buildWav(pcmBuffer, sampleRate = 24000, channels = 1, bitsPerSample = 16) {
  const dataSize = pcmBuffer.length;
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * channels * bitsPerSample / 8, 28);
  header.writeUInt16LE(channels * bitsPerSample / 8, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);
  return Buffer.concat([header, pcmBuffer]);
}

async function generate() {
  console.log('Calling Gemini TTS API with Algieba voice...');

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: essayText }] }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algieba' }
            }
          }
        }
      })
    }
  );

  if (!response.ok) {
    const err = await response.text();
    console.error('API error:', err);
    process.exit(1);
  }

  const json = await response.json();
  const audioBase64 = json.candidates[0].content.parts[0].inlineData.data;
  const pcmBuffer = Buffer.from(audioBase64, 'base64');
  const wavBuffer = buildWav(pcmBuffer);

  const outputDir = path.join(__dirname, 'audio');
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, 'who-gets-to-build.wav');
  fs.writeFileSync(outputPath, wavBuffer);

  console.log('Done. Audio saved to:', outputPath);
}

generate().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
