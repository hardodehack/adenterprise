export function saveFormData(value) {
    return {
        type: 'SAVE_FORM_DATA',
        payload: value
    };
}

export function getDbRollDetails() {
    return {
        type: 'GET_DB_ROLL_DETAILS'
    };
}

export function saveDbRollData(value){
    console.log("Hardik into action value ", value)
    return {
        type: 'DB_ROLL_DATA',
        payload: value
    }
}