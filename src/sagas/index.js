import { put, takeLatest, call, all, select } from 'redux-saga/effects';
import selector from '../selectors';
import action from '../actions';
import moment from 'moment';


function* saveFormData() {

  let roll = yield select(selector.makeSelectFromOneVar());
  var rollDate = roll.date;

  var epoch = getEpochTime(rollDate);
  roll.epoch = epoch;

  var formattedDate = formatDate(rollDate);
  roll.date = formattedDate;

  let rollString = JSON.stringify(roll);

  const headerParams = {
    "Content-Type": "application/json"
  };

  const json = yield fetch('https://ad-enterprise.firebaseio.com/rolls.json', {
    method: 'POST',
    body: rollString,
    headerParams: headerParams
  })
    .then(response => response.json(),);

}

function* getDbRollDetails() {

  const dbRollDetails = yield fetch('https://ad-enterprise.firebaseio.com/rolls.json?orderBy="epoch"', {
    method: 'GET'
  })
    .then(response => response.json(),);

  var dbRollDetailsFormatted = Object.values(dbRollDetails)

  // Sorting by decending epoch to get latest added roll at top.
  dbRollDetailsFormatted.sort(function (x, y) {
    return y.epoch - x.epoch;
  });

  dbRollDetailsFormatted.forEach(roll => {

    var formattedDate = formatDate(roll.date);
    roll.date = formattedDate;
  })

  console.log('dbRollDetailsFormatted   Hardik into sagas', dbRollDetailsFormatted);
  yield put(action.saveDbRollData(dbRollDetailsFormatted));

}

function* actionWatcher() {
  yield takeLatest('SAVE_FORM_DATA', saveFormData);
  yield takeLatest('GET_DB_ROLL_DETAILS', getDbRollDetails);
}

function formatDate(date) {
  const format1 = "YYYY-MM-DD hh:mm:ss A";
  var d = new Date(date),

    dateTime1 = moment(d).format(format1);

  return dateTime1;
}

function getEpochTime(date) {
  var d = new Date(date)
  return Math.floor(d.valueOf() / 1000)
}


export default function* rootSaga() {
  yield all([
    actionWatcher(),
  ]);
}