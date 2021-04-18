import { createSelector } from 'reselect';

const selectResult = state => state["form"];

export const makeSelectFromOneVar = () =>
    createSelector(
        [selectResult],
        (result) => 
            result.get("oneVar") ? result.get("oneVar").toJS() : null
);

export const makeSelectDbRollData = () =>
    createSelector(
        [selectResult],
        (result) => 
            result.get("dbRollData") ? result.get("dbRollData").toJS() : null
);