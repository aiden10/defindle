
export enum END_CAUSES {
    NONE,
    GIVE_UP,
    CORRECT,
    ALREADY_DONE,
    INCORRECT_GUESSES
};

export type LoginResponse = {
    credential: string;
};

export type Auth = {
    loading: boolean;
    user: string | null;
};