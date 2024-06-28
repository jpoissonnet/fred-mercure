import { GROUPS } from "./App.tsx";
import { useState } from "react";
// @ts-ignore
import { Piano, KeyboardShortcuts, MidiNumbers } from "react-piano";
import "react-piano/dist/styles.css";

export interface Payload {
  note: string;
}

const sendPayload = (payload: Payload, group: keyof typeof GROUPS) =>
  fetch(`http://mercure.frommelt.fr/.well-known/mercure`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJtZXJjdXJlIjp7InB1Ymxpc2giOlsiKiJdLCJzdWJzY3JpYmUiOlsiaHR0cHM6Ly9leGFtcGxlLmNvbS9teS1wcml2YXRlLXRvcGljIiwie3NjaGVtZX06Ly97K2hvc3R9L2RlbW8vYm9va3Mve2lkfS5qc29ubGQiLCIvLndlbGwta25vd24vbWVyY3VyZS9zdWJzY3JpcHRpb25zey90b3BpY317L3N1YnNjcmliZXJ9Il0sInBheWxvYWQiOnsidXNlciI6Imh0dHBzOi8vZXhhbXBsZS5jb20vdXNlcnMvZHVuZ2xhcyIsInJlbW90ZUFkZHIiOiIxMjcuMC4wLjEifX19.KKPIikwUzRuB3DTpVw6ajzwSChwFw5omBMmMcWKiDcM",
    },
    body: new URLSearchParams({
      topic: `https://fred-mercure.com/group/${group}`,
      data: JSON.stringify(payload),
    }),
  });

const Dashboard = () => {
  const [selectedGroup, setSelectedGroup] =
    useState<keyof typeof GROUPS>("TRUMPET");

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
      {(Object.keys(GROUPS) as Array<keyof typeof GROUPS>).map((group) => {
        if (!isNaN(Number(group))) return null;
        return (
          <label key={group} htmlFor={group}>
            <p>{group.toLowerCase()}</p>
            <input
              type="radio"
              name="group"
              id={group}
              checked={selectedGroup === group}
              onChange={() => setSelectedGroup(group)}
            />
          </label>
        );
      })}
      <Piano
        noteRange={{ first: firstNote, last: lastNote }}
        playNote={(midiNumber) => {
          // Play a given note - see notes below
          sendPayload(
            { note: MidiNumbers.getAttributes(midiNumber).note },
            selectedGroup,
          );
        }}
        stopNote={(midiNumber) => {
          // Stop playing a given note - see notes below
        }}
        width={1000}
        keyboardShortcuts={keyboardShortcuts}
      />
    </div>
  );
};

export default Dashboard;
