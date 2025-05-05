import { writable } from "svelte/store";
import { LOCAL_SESSION_HISTORY_KEY } from "../lib/constants";
import type { HistoryLog } from "../lib/types";

const storedHistory = localStorage.getItem(LOCAL_SESSION_HISTORY_KEY);
export const currentHistory = writable<HistoryLog[]>(
    storedHistory ? JSON.parse(storedHistory) : [],
);