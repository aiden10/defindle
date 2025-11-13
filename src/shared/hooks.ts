import { useState, useEffect } from "react";
import { CHECK_TOKEN_URL, PROD_URL, CUSTOM_WORD_URL, GET_STATS_URL, UPDATE_STATS_URL } from "./constants";
import { Auth } from "./types";

export function useAuth() {
  const [auth, setAuth] = useState<Auth>({ loading: true, user: null });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return setAuth({ loading: false, user: null });

    fetch(CHECK_TOKEN_URL, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setAuth({ loading: false, user: d.valid ? d.user : null }))
      .catch(() => setAuth({ loading: false, user: null }));
  }, []);

  return auth;
}

export function useCustomWord(base64Word: string | null) {
  const [data, setData] = useState<{ word: string; definition: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!base64Word) return;

    const fetchCustomWord = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${CUSTOM_WORD_URL}?word=${encodeURIComponent(base64Word)}`);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        setData({ word: json.word, definition: json.definition });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomWord();
  }, [base64Word]);

  return { data, error, loading };
}

export function useDailyWord() {
  const [data, setData] = useState<{ word: string; definition: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDailyWord = async () => {
      try {
        const response = await fetch(PROD_URL);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        setData({ word: json.word, definition: json.definition });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDailyWord();
  }, []);

  return { data, error, loading };
}

export function useStats(setters: {
  setCurrentStreak: (streak: number) => void;
  setCompletedGames: (games: number) => void;
  setGiveUpCount: (count: number) => void;
  setIncorrectGuesses: (guesses: number) => void;
  setCorrectGuesses: (guesses: number) => void;
  setDaysPlayed: (days: number) => void;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(GET_STATS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token })
        });

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        const stats = json.stats;
        console.log(stats);

        setters.setCurrentStreak(stats.current_streak);
        setters.setCompletedGames(stats.completed_games);
        setters.setGiveUpCount(stats.give_up_count);
        setters.setIncorrectGuesses(stats.incorrect_guesses);
        setters.setCorrectGuesses(stats.correct_guesses);
        setters.setDaysPlayed(stats.days_played);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [setters]);

  return { loading, error };
}

export function useUpdateStats(stats: {
  currentStreak: number;
  completedGames: number;
  giveUpCount: number;
  incorrectGuesses: number;
  correctGuesses: number;
  daysPlayed: number;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateStats = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No auth token, skipping stats update");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(UPDATE_STATS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          stats: {
            current_streak: stats.currentStreak,
            completed_games: stats.completedGames,
            give_up_count: stats.giveUpCount,
            incorrect_guesses: stats.incorrectGuesses,
            correct_guesses: stats.correctGuesses,
            days_played: stats.daysPlayed
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      console.log("Stats updated:", json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error("Failed to update stats:", err);
    } finally {
      setLoading(false);
    }
  };

  return { updateStats, loading, error };
}