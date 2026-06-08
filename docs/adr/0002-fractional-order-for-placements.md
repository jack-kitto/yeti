# Fractional order for all user-ordered placements

Status: Accepted

Quickshell lets users reorder edge groups on a rim, links inside groups, pin strip entries, and other sequences. Integer indices make insert-and-push painful and cause write amplification across siblings.

We store **fractional order keys** (string ranks between neighbors) on every ordered placement. Reordering assigns a new key between neighbors; no full-list renumbering. Visual edge slots are computed from viewport size; persistence uses fractional keys only.

Considered integer arrays and linked-list ordering; rejected because drag-insert on dense rims and concurrent reordering are simpler with fractional keys at the cost of occasional rebalancing when keys run out of precision.
