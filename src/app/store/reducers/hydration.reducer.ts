import { ActionReducer, INIT, UPDATE } from "@ngrx/store";

/**
 * saves/loads the app state to the local storage
 */
export const hydrationMetaReducer = (reducer: ActionReducer<any>): ActionReducer<any> => {

    return (state, action) => {
        if (action.type === INIT || action.type === UPDATE) {
            state = loadState(state);
        }
        const nextState = reducer(state, action);

        if (JSON.stringify(nextState) !== JSON.stringify(state)) {
            saveState(nextState);
        }

        return nextState;
    };
};

function loadState(state: any): any {
    const storageKey = "_state_";
    const storageValue = localStorage.getItem(storageKey);
    if (storageValue) {
        try {
            return { ...state, ...JSON.parse(storageValue) };
        } catch {
            localStorage.removeItem(storageKey);
        }
    }
    return state;
}

function saveState(state: any): void {
    const storageKey = "_state_";
    const value = (<any>state);
    localStorage.setItem(storageKey, JSON.stringify(value));
}