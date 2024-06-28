import "./App.css";
import { useEffect, useState } from "react";
import { Payload } from "./Dashboard.tsx";

export enum GROUPS {
  TRUMPET,
  SAXOPHONE,
  DRUMS,
  BASS,
}

function App() {
  const [group, setGroup] = useState<GROUPS | null>(null);
  const [message, setMessage] = useState<Payload | null>(null);

  useEffect(() => {
    const url = new URL("https://localhost/.well-known/mercure");
    const group = GROUPS[
      Math.floor((Math.random() * Object.keys(GROUPS).length) / 2)
    ] as unknown as GROUPS;
    setGroup(group);
    url.searchParams.append("topic", `https://fred-mercure.com/group/${group}`); //TODO: make this dynamic

    const eventSource = new EventSource(url);
    eventSource.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessage(data);
      console.log(e);
    };
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <>
      <h1>You are a musician of the group {group}</h1>
      <p>Currently playing {message?.note ?? "nothing"}</p>
    </>
  );
}

export default App;
