import { useEffect, useState, useRef } from "react";
import CentauryMark from "./CentauryMark";
import "../styles/intro-loader-v2.css";
/**
 * Intro de marca Centaury — versión monocromática (negro/blanco).
 * Secuencia: punto de luz -> línea se forma -> destello ->
 * el logo emerge (blur a foco + barrido) -> asentamiento con glow ->
 * tagline -> salida.
 *
 * Se muestra una sola vez por sesión de navegación (sessionStorage).
 *
 * Uso (Next.js App Router):
 *
 *   import IntroLoader from "@/components/IntroLoader";
 *
 *   export default function Page() {
 *     return (
 *       <>
 *         <IntroLoader />
 *         <main>...tu home real...</main>
 *       </>
 *     );
 *   }
 */

const AUTO_MS = 3500;
const STORAGE_KEY = "centauryIntroShown";

export default function IntroLoader() {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    setVisible(true);
    const timer = setTimeout(finish, AUTO_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish() {
    if (doneRef.current) return;
    doneRef.current = true;
    setExiting(true);
    sessionStorage.setItem(STORAGE_KEY, "1");
    setTimeout(() => setVisible(false), 650);
  }

  if (!visible) return null;

  return (
    <div className={`centaury-intro${exiting ? " exiting" : ""}`}>
      <div className="intro-inner">
        <div className="seed-line" />
        <div className="seed-flash" />
        <div className="logo-stage">
          <div className="beam" />
          <div className="glow-pulse" />
          <CentauryMark />
        </div>
        <div className="tagline">
          <span>Tienda de ropa</span>
          <div className="rule" />
        </div>
      </div>
      <button className="intro-skip" onClick={finish}>
        Saltar
      </button>
    </div>
  );
}
