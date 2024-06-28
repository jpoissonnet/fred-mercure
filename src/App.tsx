import "./App.css";
import { useEffect, useRef, useState } from "react";
import { Payload } from "./Dashboard.tsx";
import { SplendidGrandPiano } from "smplr";

export enum GROUPS {
  TRUMPET,
  SAXOPHONE,
  DRUMS,
  BASS,
}

const url = new URL("http://mercure.frommelt.fr/.well-known/mercure");

function App() {
  const [group, setGroup] = useState<GROUPS | null>(null);
  const [message, setMessage] = useState<Payload | null>(null);
  const context = useRef<any>();
  const piano = useRef<any>();

  useEffect(() => {
    context.current = new AudioContext();
    piano.current = new SplendidGrandPiano(context.current);
    const group = GROUPS[
      Math.floor((Math.random() * Object.keys(GROUPS).length) / 2)
    ] as unknown as GROUPS;
    setGroup(group);
    url.searchParams.append("topic", `https://fred-mercure.com/group/${group}`);

    const eventSource = new EventSource(url);

    eventSource.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessage(data);
      console.log(data);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    if (message) {
      console.log("Playing", message.note);
      piano.current.start(message.note);
    }
  }, [message]);

  return (
    <>
      <h1>You are a musician of the group {group}</h1>
      <p>Currently playing {message?.note ?? "nothing"}</p>
      <button
        onClick={() => {
          context.current.resume();
        }}
      >
        Catch focus
      </button>
      <button onClick={() => piano.current.start(message?.note ?? "C3")}>
        Play {message?.note ?? "C3"}
      </button>
    </>
  );
}

export default App;
