
  // @ts-ignore: TS7016 - missing type declarations for react-dom/client
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
// @ts-ignore: CSS import without type declarations
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(<App />);
  