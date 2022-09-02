import { vr } from 'voice-recognition';

const recognizer = new vr('en-US');
recognizer.listen();

recognizer.on('vc:recognized', (result) => {
  console.log(result);
});
