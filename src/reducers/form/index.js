import { fromJS } from "immutable";

const initialState = fromJS({
  oneVar: 0,
  dbRollData: []
});


const stockFormReducer = (state = initialState, action = {}) => {

  switch (action.type) {

    case 'SAVE_FORM_DATA':
      return state
        .set("oneVar", fromJS(action.payload));

    case 'DB_ROLL_DATA':
      console.log("Hardik into reducer action.payload ",action.payload)
      return state.
        set("dbRollData", fromJS(action.payload));

    default:
      return state;

  }
};

export default stockFormReducer;