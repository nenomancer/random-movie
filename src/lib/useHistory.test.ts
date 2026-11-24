import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { get } from "svelte/store";
import { LOCAL_SESSION_HISTORY_KEY } from "./constants";
import { currentHistory } from "./stores";
import { addHistoryLog } from "./useHistory";

const ids = () => get(currentHistory).map((entry) => entry.id);

describe("addHistoryLog", () => {
  beforeEach(() => {
    currentHistory.set([]);
    localStorage.clear();
  });
  afterEach(() => {
    currentHistory.set([]);
    localStorage.clear();
  });

  it("adds movies in the order they were seen, with id and name", () => {
    addHistoryLog(1, "Alien");
    addHistoryLog(2, "Brazil");
    expect(get(currentHistory)).toEqual([
      { id: 1, name: "Alien" },
      { id: 2, name: "Brazil" },
    ]);
  });

  it("never lists the same movie twice", () => {
    addHistoryLog(1, "Alien");
    addHistoryLog(2, "Brazil");
    addHistoryLog(1, "Alien");
    expect(ids().filter((id) => id === 1)).toHaveLength(1);
    expect(get(currentHistory)).toHaveLength(2);
  });

  it("keeps at most 6 entries and drops the oldest", () => {
    for (let id = 1; id <= 8; id++) addHistoryLog(id, `Movie ${id}`);
    expect(ids()).toEqual([3, 4, 5, 6, 7, 8]);
  });

  it("does not drop anything below the limit", () => {
    for (let id = 1; id <= 6; id++) addHistoryLog(id, `Movie ${id}`);
    expect(ids()).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("saves the list to localStorage", () => {
    addHistoryLog(1, "Alien");
    addHistoryLog(2, "Brazil");
    expect(
      JSON.parse(localStorage.getItem(LOCAL_SESSION_HISTORY_KEY)!),
    ).toEqual([
      { id: 1, name: "Alien" },
      { id: 2, name: "Brazil" },
    ]);
  });

  it("saves the trimmed list, not the overflowing one", () => {
    for (let id = 1; id <= 7; id++) addHistoryLog(id, `Movie ${id}`);
    const saved = JSON.parse(localStorage.getItem(LOCAL_SESSION_HISTORY_KEY)!);
    expect(saved.map((entry: { id: number }) => entry.id)).toEqual([
      2, 3, 4, 5, 6, 7,
    ]);
  });

  // Today a re-added movie keeps its old slot (only its name is refreshed), so
  // a movie you just looked at again is the first one dropped when the list
  // fills up. Probably it should move to the most recent position.
  it.todo("moves a re-added movie to the most recent position");
});
