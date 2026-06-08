"use client";

type ShellConfigPanelProps = {
  workspaceName: string;
};

export function ShellConfigPanel({ workspaceName }: ShellConfigPanelProps) {
  return (
    <div className="shell-config">
      <p className="shell-config-title">Config</p>
      <p className="shell-config-subtitle">{workspaceName}</p>
      <ul className="shell-config-list">
        <li>Workspace & theme editing</li>
        <li>Link catalog CRUD</li>
        <li>Edge group ordering</li>
        <li>Library snapshot import/export</li>
      </ul>
      <p className="shell-config-note">Full config panel — issue 06</p>
    </div>
  );
}
