import { YetiLogo } from "./yeti-logo";

type LoadingGateProps = {
  label: string;
};

export function LoadingGate({ label }: LoadingGateProps) {
  return (
    <div className="yeti-loading-gate" role="status">
      <YetiLogo size={40} animated />
      <p className="yeti-loading-gate-label">{label}</p>
    </div>
  );
}
