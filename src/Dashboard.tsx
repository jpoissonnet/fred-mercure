// @ts-ignore
import { KeyboardShortcuts, MidiNumbers, Piano } from "react-piano";
import "react-piano/dist/styles.css";

export interface Payload {
  note: string;
}

const sendPayload = (payload: Payload) =>
  fetch(`https://mercure.frommelt.fr/.well-known/mercure`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJtZXJjdXJlIjp7InB1Ymxpc2giOlsiKiJdLCJzdWJzY3JpYmUiOlsiaHR0cHM6Ly9leGFtcGxlLmNvbS9teS1wcml2YXRlLXRvcGljIiwie3NjaGVtZX06Ly97K2hvc3R9L2RlbW8vYm9va3Mve2lkfS5qc29ubGQiLCIvLndlbGwta25vd24vbWVyY3VyZS9zdWJzY3JpcHRpb25zey90b3BpY317L3N1YnNjcmliZXJ9Il0sInBheWxvYWQiOnsidXNlciI6Imh0dHBzOi8vZXhhbXBsZS5jb20vdXNlcnMvZHVuZ2xhcyIsInJlbW90ZUFkZHIiOiIxMjcuMC4wLjEifX19.KKPIikwUzRuB3DTpVw6ajzwSChwFw5omBMmMcWKiDcM",
    },
    body: new URLSearchParams({
      topic: `https://fred-mercure.com/play`,
      data: JSON.stringify(payload),
    }),
  });

const Dashboard = () => {
  const firstNote = MidiNumbers.fromNote("c3");
  const lastNote = MidiNumbers.fromNote("f5");
  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: firstNote,
    lastNote: lastNote,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
  });

  return (
    <div>
      <h1>Dashboard</h1>
      <Piano
        noteRange={{ first: firstNote, last: lastNote }}
        playNote={(midiNumber: number) => {
          console.log(MidiNumbers.getAttributes(midiNumber).note);
          // Play a given note - see notes below
          sendPayload({ note: MidiNumbers.getAttributes(midiNumber).note });
        }}
        stopNote={(midiNumber: number) => {
          console.log(MidiNumbers.getAttributes(midiNumber).note);
          // Stop playing a given note - see notes below
        }}
        width={1000}
        keyboardShortcuts={keyboardShortcuts}
      />
    </div>
  );
};

export default Dashboard;
