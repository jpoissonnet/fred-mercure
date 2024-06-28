import { GROUPS } from "./App.tsx";
import { useState } from "react";

export interface Payload {
  note: string;
}

const sendPayload = (payload: Payload, group: keyof typeof GROUPS) =>
  fetch("https://localhost/.well-known/mercure", {
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
  const [inputs, setInputs] = useState<Record<keyof typeof GROUPS, Payload>>({
    TRUMPET: { note: "C3" },
    SAXOPHONE: { note: "G3" },
    DRUMS: { note: "E3" },
    BASS: { note: "C2" },
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
              type="text"
              id={group}
              value={inputs[group]?.note}
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  [group]: { ...inputs[group], note: e.target.value },
                })
              }
            />
            <button onClick={() => sendPayload(inputs[group] ?? {}, group)}>
              Send
            </button>
          </label>
        );
      })}
    </div>
  );
};

export default Dashboard;
