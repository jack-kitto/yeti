"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutateLibrary } from "@/hooks/use-library";
import { resolveLinkTitle } from "@/link-display/link-display";
import type { EdgePosition, Library } from "@/library/types";
import {
  addEdgeGroup,
  addLinkToEdgeGroup,
  addPinToStrip,
  deleteEdgeGroup,
  moveLinkInEdgeGroup,
  removeLinkFromEdgeGroup,
  removePinFromStrip,
  updateEdgeGroup,
} from "@/placement/placement-mutations";
import {
  reorderEdgeGroupOnRim,
  resolveEdgeGroupLinks,
  resolveEdgeGroups,
  resolvePins,
} from "@/placement/placement";

const EDGES: EdgePosition[] = ["left", "top", "bottom"];

type ShellConfigPlacementsProps = {
  library: Library;
};

type GroupFormState = {
  name: string;
  handleIcon: string;
};

const EMPTY_GROUP_FORM: GroupFormState = {
  name: "",
  handleIcon: "",
};

export function ShellConfigPlacements({ library }: ShellConfigPlacementsProps) {
  const mutateLibrary = useMutateLibrary();
  const workspaceId = library.activeWorkspaceId;
  const [edge, setEdge] = useState<EdgePosition>("left");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [groupForm, setGroupForm] = useState<GroupFormState>(EMPTY_GROUP_FORM);
  const [newGroupForm, setNewGroupForm] = useState<GroupFormState>(EMPTY_GROUP_FORM);
  const [linkToAdd, setLinkToAdd] = useState("");
  const [pinToAdd, setPinToAdd] = useState("");

  const groups = useMemo(() => resolveEdgeGroups(library, edge), [library, edge]);
  const selectedGroup =
    groups.find((group) => group.id === selectedGroupId) ?? groups[0] ?? null;
  const groupLinks = selectedGroup
    ? resolveEdgeGroupLinks(library, edge, selectedGroup.id)
    : [];
  const pins = useMemo(() => resolvePins(library), [library]);

  useEffect(() => {
    if (groups.length === 0) {
      setSelectedGroupId(null);
      return;
    }
    if (!selectedGroupId || !groups.some((group) => group.id === selectedGroupId)) {
      setSelectedGroupId(groups[0].id);
    }
  }, [groups, selectedGroupId]);

  useEffect(() => {
    if (!selectedGroup) {
      setGroupForm(EMPTY_GROUP_FORM);
      return;
    }
    setGroupForm({
      name: selectedGroup.name,
      handleIcon: selectedGroup.handleIcon ?? "",
    });
  }, [selectedGroup]);

  function saveGroupDetails(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedGroup) {
      return;
    }
    const name = groupForm.name.trim();
    if (!name) {
      return;
    }

    mutateLibrary.mutate((current) =>
      updateEdgeGroup(current, workspaceId, edge, selectedGroup.id, {
        name,
        handleIcon: groupForm.handleIcon.trim(),
      }),
    );
  }

  function handleAddGroup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = newGroupForm.name.trim();
    if (!name) {
      return;
    }

    mutateLibrary.mutate(
      (current) =>
        addEdgeGroup(current, workspaceId, edge, {
          name,
          ...(newGroupForm.handleIcon.trim()
            ? { handleIcon: newGroupForm.handleIcon.trim() }
            : {}),
        }),
      {
        onSuccess: (updated) => {
          const created = resolveEdgeGroups(updated, edge).find((group) => group.name === name);
          if (created) {
            setSelectedGroupId(created.id);
          }
        },
      },
    );
    setNewGroupForm(EMPTY_GROUP_FORM);
  }

  function handleDeleteGroup() {
    if (!selectedGroup) {
      return;
    }
    const confirmed = window.confirm(`Delete edge group "${selectedGroup.name}"?`);
    if (!confirmed) {
      return;
    }
    mutateLibrary.mutate((current) =>
      deleteEdgeGroup(current, workspaceId, edge, selectedGroup.id),
    );
  }

  function handleMoveGroupToSlot(slotIndex: number) {
    if (!selectedGroup) {
      return;
    }
    mutateLibrary.mutate((current) =>
      reorderEdgeGroupOnRim(current, edge, selectedGroup.id, slotIndex),
    );
  }

  function handleAddLinkToGroup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedGroup || !linkToAdd) {
      return;
    }
    mutateLibrary.mutate((current) =>
      addLinkToEdgeGroup(current, workspaceId, edge, selectedGroup.id, linkToAdd),
    );
    setLinkToAdd("");
  }

  function handleRemoveLinkFromGroup(linkId: string) {
    if (!selectedGroup) {
      return;
    }
    mutateLibrary.mutate((current) =>
      removeLinkFromEdgeGroup(current, workspaceId, edge, selectedGroup.id, linkId),
    );
  }

  function handleMoveLink(linkId: string, targetIndex: number) {
    if (!selectedGroup) {
      return;
    }
    mutateLibrary.mutate((current) =>
      moveLinkInEdgeGroup(
        current,
        workspaceId,
        edge,
        selectedGroup.id,
        linkId,
        targetIndex,
      ),
    );
  }

  function handleAddPin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!pinToAdd) {
      return;
    }
    mutateLibrary.mutate((current) => addPinToStrip(current, workspaceId, pinToAdd));
    setPinToAdd("");
  }

  function handleRemovePin(linkId: string) {
    mutateLibrary.mutate((current) => removePinFromStrip(current, workspaceId, linkId));
  }

  const catalogOptions = useMemo(
    () =>
      [...library.catalog].sort((left, right) =>
        resolveLinkTitle(left).localeCompare(resolveLinkTitle(right)),
      ),
    [library.catalog],
  );

  const pinnedIds = new Set(pins.map((link) => link.id));
  const currentGroupSlotIndex = selectedGroup
    ? groups.findIndex((group) => group.id === selectedGroup.id)
    : -1;

  return (
    <>
      <section className="shell-config-section">
        <h2 className="shell-config-heading">Edge groups</h2>

        <div className="shell-config-edge-tabs" role="tablist" aria-label="Edge">
          {EDGES.map((edgeName) => (
            <button
              key={edgeName}
              type="button"
              role="tab"
              aria-selected={edge === edgeName}
              className={`shell-config-edge-tab${edge === edgeName ? " active" : ""}`}
              onClick={() => setEdge(edgeName)}
            >
              {edgeName}
            </button>
          ))}
        </div>

        {groups.length > 0 ? (
          <ul className="shell-config-group-list">
            {groups.map((group) => (
              <li key={group.id}>
                <button
                  type="button"
                  className={`shell-config-group-select${
                    selectedGroup?.id === group.id ? " active" : ""
                  }`}
                  onClick={() => setSelectedGroupId(group.id)}
                >
                  <span>{group.handleIcon ?? "•"}</span>
                  <span>{group.name}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="shell-config-empty">No groups on this edge yet.</p>
        )}

        {selectedGroup ? (
          <div className="shell-config-group-editor">
            <form className="shell-config-form" onSubmit={saveGroupDetails}>
              <p className="shell-config-form-label">Group details</p>
              <input
                type="text"
                required
                value={groupForm.name}
                onChange={(event) =>
                  setGroupForm((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Group name"
                className="shell-config-input"
              />
              <input
                type="text"
                value={groupForm.handleIcon}
                onChange={(event) =>
                  setGroupForm((current) => ({ ...current, handleIcon: event.target.value }))
                }
                placeholder="Handle icon (emoji or image URL)"
                className="shell-config-input"
              />
              <div className="shell-config-form-actions">
                <button type="submit" className="shell-config-submit">
                  Save group
                </button>
                <button
                  type="button"
                  className="shell-config-action shell-config-action-danger"
                  onClick={handleDeleteGroup}
                >
                  Delete
                </button>
              </div>
            </form>

            <div className="shell-config-slot-rail">
              <p className="shell-config-form-label">Slot rail</p>
              <div className="shell-config-slot-buttons">
                {groups.map((group, index) => (
                  <button
                    key={group.id}
                    type="button"
                    className={`shell-config-slot${
                      currentGroupSlotIndex === index ? " active" : ""
                    }`}
                    aria-label={`Move ${selectedGroup.name} to slot ${index + 1}`}
                    onClick={() => handleMoveGroupToSlot(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="shell-config-scroll">
              <ul className="shell-config-catalog">
                {groupLinks.map((link, index) => (
                  <li key={link.id} className="shell-config-catalog-item">
                    <div className="shell-config-catalog-copy">
                      <span className="shell-config-catalog-title">
                        {resolveLinkTitle(link)}
                      </span>
                    </div>
                    <div className="shell-config-catalog-actions">
                      <button
                        type="button"
                        className="shell-config-action"
                        disabled={index === 0}
                        onClick={() => handleMoveLink(link.id, index - 1)}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="shell-config-action"
                        disabled={index === groupLinks.length - 1}
                        onClick={() => handleMoveLink(link.id, index + 1)}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className="shell-config-action shell-config-action-danger"
                        onClick={() => handleRemoveLinkFromGroup(link.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <form className="shell-config-form" onSubmit={handleAddLinkToGroup}>
              <p className="shell-config-form-label">Add link to group</p>
              <select
                value={linkToAdd}
                onChange={(event) => setLinkToAdd(event.target.value)}
                className="shell-config-input"
              >
                <option value="">Choose a catalog link…</option>
                {catalogOptions.map((link) => (
                  <option key={link.id} value={link.id}>
                    {resolveLinkTitle(link)}
                  </option>
                ))}
              </select>
              <button type="submit" className="shell-config-submit" disabled={!linkToAdd}>
                Add to group
              </button>
            </form>
          </div>
        ) : null}

        <form className="shell-config-form" onSubmit={handleAddGroup}>
          <p className="shell-config-form-label">New edge group</p>
          <input
            type="text"
            required
            value={newGroupForm.name}
            onChange={(event) =>
              setNewGroupForm((current) => ({ ...current, name: event.target.value }))
            }
            placeholder="Group name"
            className="shell-config-input"
          />
          <input
            type="text"
            value={newGroupForm.handleIcon}
            onChange={(event) =>
              setNewGroupForm((current) => ({ ...current, handleIcon: event.target.value }))
            }
            placeholder="Handle icon (optional)"
            className="shell-config-input"
          />
          <button type="submit" className="shell-config-submit">
            Add edge group
          </button>
        </form>
      </section>

      <section className="shell-config-section">
        <h2 className="shell-config-heading">Pin strip</h2>
        <div className="shell-config-scroll">
          <ul className="shell-config-catalog">
            {pins.map((link) => (
              <li key={link.id} className="shell-config-catalog-item">
                <div className="shell-config-catalog-copy">
                  <span className="shell-config-catalog-title">{resolveLinkTitle(link)}</span>
                </div>
                <button
                  type="button"
                  className="shell-config-action shell-config-action-danger"
                  onClick={() => handleRemovePin(link.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        <form className="shell-config-form" onSubmit={handleAddPin}>
          <select
            value={pinToAdd}
            onChange={(event) => setPinToAdd(event.target.value)}
            className="shell-config-input"
          >
            <option value="">Choose a catalog link…</option>
            {catalogOptions
              .filter((link) => !pinnedIds.has(link.id))
              .map((link) => (
                <option key={link.id} value={link.id}>
                  {resolveLinkTitle(link)}
                </option>
              ))}
          </select>
          <button type="submit" className="shell-config-submit" disabled={!pinToAdd}>
            Pin to canvas
          </button>
        </form>
      </section>
    </>
  );
}
