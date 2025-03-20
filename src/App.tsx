import { useState } from "react";
import Terminal from "./components/Terminal";
import LoadingScreen from "./components/LoadingScreen";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <div>
      {loadingComplete ? <Terminal /> : <LoadingScreen onComplete={() => setLoadingComplete(true)} />}
    </div>
  );
}
