"use client";

import type { ShellSurface, Theme, ThemePatch } from "@/library/types";
import { DEFAULT_SHELL_SURFACE } from "@/theme/theme-defaults";

type ShellConfigShellSurfaceProps = {
  theme: Theme;
  onPatch: (patch: ThemePatch) => void;
};

export function ShellConfigShellSurface({ theme, onPatch }: ShellConfigShellSurfaceProps) {
  const shellSurface = theme.shellSurface ?? DEFAULT_SHELL_SURFACE;
  const isSolid = shellSurface === "solid";
  const borderColor = theme.shellBorderColor ?? theme.palette.text;

  return (
    <>
      <label className="shell-config-color-field">
        <span className="shell-config-form-label">Shell surface</span>
        <select
          className="shell-config-input"
          value={shellSurface}
          onChange={(event) => onPatch({ shellSurface: event.target.value as ShellSurface })}
        >
          <option value="solid">Solid</option>
          <option value="glass">Glass</option>
          <option value="transparent">Transparent</option>
        </select>
      </label>

      {isSolid ? (
        <label className="shell-config-color-field">
          <span className="shell-config-form-label">Shell border</span>
          <div className="shell-config-color-input">
            <input
              type="color"
              value={borderColor}
              onChange={(event) => onPatch({ shellBorderColor: event.target.value })}
              aria-label="Shell border color"
            />
            <input
              type="text"
              value={borderColor}
              onChange={(event) => onPatch({ shellBorderColor: event.target.value })}
              className="shell-config-input"
            />
          </div>
        </label>
      ) : null}

      {!isSolid ? (
        <label className="shell-config-color-field">
          <span className="shell-config-form-label">
            Glass opacity <span className="tabular-nums">{Math.round(theme.glassOpacity * 100)}%</span>
          </span>
          <input
            type="range"
            min={0.2}
            max={1}
            step={0.01}
            value={theme.glassOpacity}
            onChange={(event) => onPatch({ glassOpacity: Number(event.target.value) })}
            className="shell-config-range"
          />
        </label>
      ) : null}
    </>
  );
}
