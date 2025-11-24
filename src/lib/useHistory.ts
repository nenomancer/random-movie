import { LOCAL_SESSION_HISTORY_KEY } from "./constants";
import { currentHistory } from "./stores";

/**
   * Logs movie to history without duplicates (local storage)
   * @param movieId used to write and retrieve movie from history
   * @param movieTitle used for display
   */
export function addHistoryLog(movieId: number, movieTitle: string) {
    const maxHistory = 6;
    currentHistory.update((currentHistory) => {
        const updated = [...currentHistory, { id: movieId, name: movieTitle }];
        const uniqueHistory = Array.from(
            new Map(updated.map((item) => [item.id, item])).values(),
        );

        if (uniqueHistory.length > maxHistory) {
            uniqueHistory.shift();
        }
        window.localStorage.setItem(
            LOCAL_SESSION_HISTORY_KEY,
            JSON.stringify(uniqueHistory),
        );
        return uniqueHistory;
    });
}
