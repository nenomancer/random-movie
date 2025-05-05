import { writable } from "svelte/store";

export const openDropdown = writable<string | null>(null)
export const activeTab = writable<string>("Info");
export const activeTab2 = writable<string>("Poster");

