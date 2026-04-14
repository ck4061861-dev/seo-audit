import { createAvatar } from "@dicebear/core";
import { adventurer } from "@dicebear/collection";

export function generateAvatar(name = "User") {
  return createAvatar(adventurer, {
    seed: name, // same name = same avatar
    size: 128,
  }).toDataUri();
}