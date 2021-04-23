import React, { Component } from 'react'

import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { DateTimePicker } from '@progress/kendo-react-dateinputs'
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Button } from '@progress/kendo-react-buttons';

import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { filterBy } from '@progress/kendo-data-query';

import { Notification } from '@progress/kendo-react-notification';

import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';

import { connect } from 'react-redux';
import { createStructuredSelector } from "reselect";


import actions from '../actions';

import { NumericTextBox } from '@progress/kendo-react-inputs'
import selectors from '../selectors';

const formValidation = (values) => {
    const errors = {};

    if (!values.date) {
        errors.date = "Please select a date";
    }

    if (!values.time) {
        errors.time = "Please select a time";
    }

    if (!values.tissueType || values.tissueType === "Select the tissue type") {
        errors.tissueType = "Tissue Type is Required";
    }

    if (!values.machineSize || values.machineSize === "Select the machine size") {
        errors.machineSize = "Machine Size is Required";
    }

    if (!values.rollSize || values.rollSize === "Select the roll size") {
        errors.rollSize = "Roll Size is Required";
    }

    if (!values.gsm || values.gsm === "Select the Gsm") {
        errors.gsm = "GSM is Required";
    }

    if (!values.ppp || values.ppp === "Select pieces per packet") {
        errors.ppp = "Pieces per Packet is Required";
    }

    if (!values.millWeight) {
        errors.millWeight = "Mill Weight is Required";
    }

    if (!values.factoryWeight) {
        errors.factoryWeight = "Factory Weight is Required";
    }

    if (!values.machineReading) {
        errors.machineReading = "Machine Reading is Required";
    }

    if (!values.wastePacket) {
        errors.wastePacket = "Waste Packet is Required";
    }

    if (!values.wastePanni) {
        errors.wastePanni = "Waste Panni is Required";
    }

    if (!values.rollCoreWeight) {
        errors.rollCoreWeight = "Roll Core Weight is Required";
    }

    return errors;
}

class cellWithBackGround extends React.Component {
    render() {
        const examplePrice = this.props.dataItem.packetDifference < 0;

        const icon = examplePrice ?
            <span className="k-icon k-i-sort-desc-sm" /> :
            <span className="k-icon k-i-sort-asc-sm" />;

        const style = {
            backgroundColor: examplePrice ?
                "rgb(243, 23, 0, 0.32)" :
                "rgb(55, 180, 0,0.32)"
        };

        return (
            <td style={style}>
                {this.props.dataItem[this.props.field]} {icon}
            </td>
        );
    }
}


class Production extends Component {

    defaultValue = new Date();

    constructor(props) {
        super(props);

        this.state = {
            testTempVar: 0,
            packetByMill: 0,
            packetDifference: 0,
            visible: false,

            skip: 0,
            take: 10,

            filter: {
                logic: "and",
                filters: [
                    // { field: "gsm", operator: "contains", value: "15" }
                ]
            }
        }
    }

    toggleDialog = () => {
        this.setState({
            visible: !this.state.visible
        });
    }

    pageChange = (event) => {
        this.setState({
            skip: event.page.skip,
            take: event.page.take
        });
    }

    componentDidMount() {
        this.props.getDbRollDetails();
    }

    onSubmit = values => {



        var sol_1 = (values.machineSize * values.rollSize * values.gsm * values.ppp) / 10000000;


        var pbm = Math.round((1 / sol_1) * values.millWeight);


        var diff = values.packetsByFactory - pbm;

        this.setState({ packetByMill: pbm });
        this.setState({ packetDifference: diff });

        values.packetByMill = pbm;
        values.packetDifference = diff;

        this.props.setFormData(values);
        console.log("Hardik into onubmit()  ")
        this.props.getDbRollDetails();

        this.setState({ visible: true })


    }

    handleChange = (e) => {

        this.setState({ value: e.target.value });
    };




    render() {

        return (

            <React.Fragment>
                <div>
                    <h3>{'Production'}</h3>
                    {

                        <Form
                            validate={formValidation}
                            onSubmit={this.onSubmit}

                            render={({ handleSubmit, reset, submitting, pristine, values, valid }) => (

                                <FormElement>
                                    <label name="packetsByMill">FormElement <br></br></label>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: 50 }}>



                                        {/* <div style={{ width: 950 }}> */}
                                        <form onSubmit={handleSubmit}>

                                            <fieldset>

                                                <label name="packetsByMill">Date <br></br></label>
                                                <Field
                                                    name="date"
                                                    component={DateTimePicker}
                                                    format={"dd-MM-yyyy hh:mm:ss a"}
                                                    defaultValue={this.defaultValue}
                                                    label="Date And Time" />

                                                <Field
                                                    name="machineSize"
                                                    component={DropDownList}
                                                    data={[22, 29]}
                                                    label="Machine Size" />

                                                <Field
                                                    name="rollSize"
                                                    component={DropDownList}
                                                    data={[22, 27, 29, 30, 33, 40]}
                                                    label="Roll Size" />

                                                <Field
                                                    name="gsm"
                                                    component={DropDownList}
                                                    data={[14, 15, 16, 17, 18]}
                                                    label="GSM" />

                                                <Field
                                                    name="ppp"
                                                    component={DropDownList}
                                                    data={[44, 45, 74, 75, 76, 77, 78, 79, 80, 94, 95, 96, 97, 98, 99, 100]}
                                                    label="Pieces per Packet" />

                                                <Field
                                                    name="millWeight"
                                                    component={NumericTextBox}
                                                    min={1}
                                                    label="Mill Weight" />

                                                <Field
                                                    name="wastePolythene"
                                                    component={NumericTextBox}
                                                    min={1}
                                                    label="Waste Polythene" />

                                                <Field
                                                    name="packetsByFactory"
                                                    component={NumericTextBox}
                                                    min={1}
                                                    label="Packets By Factory" />

                                                <br></br>

                                                <label name="packetsByMill">Packets By Mill <br></br></label>
                                                <input readOnly value={this.state.packetByMill} /><br></br><br></br>

                                                <label name="wasteOfPacket">Waste of Packet <br></br></label>
                                                <input readOnly value={this.state.packetDifference} />

                                                <div className="k-form-buttons">

                                                    <Button type="submit" primary={true} disabled={submitting || !valid}>
                                                        Submit Roll Details
                                        </Button>

                                        &nbsp;
                                        <Button onClick={reset}>
                                                        Reset
                                        </Button>

                                                </div>
                                            </fieldset>

                                        </form>
                                    </div>


                                    <Grid
                                        style={{ height: '400px' }}

                                        data={filterBy(this.props.dbRollData.slice(this.state.skip, this.state.take + this.state.skip), this.state.filter)}


                                        skip={this.state.skip}
                                        take={this.state.take}
                                        total={this.props.dbRollData.length}
                                        pageable={true}
                                        onPageChange={this.pageChange}


                                        filterable={true}

                                        filter={this.state.filter}
                                        onFilterChange={(e) => {
                                            this.setState({
                                                filter: e.filter
                                            });
                                        }}
                                    >
                                        <Column field="date" title="Date" width="200px" filter="date" />
                                        <Column field="gsm" title="GSM" width="200px" filter="numeric" />
                                        <Column field="machineSize" title="Machine Size" width="200px" filter="numeric" />
                                        <Column field="packetByMill" title="Packet By Mill" width="200px" filter="numeric" />
                                        <Column field="packetsByFactory" title="Packet By Factory" width="200px" filter="numeric" />
                                        <Column field="packetDifference" title="Packet Difference" cell={cellWithBackGround} filter="numeric" />

                                    </Grid>

                                </FormElement>


                            )} />
                    }
                </div>

                <div>
                    {this.state.visible && <Dialog title={"Alert"} onClose={this.toggleDialog}>
                        <p style={{ margin: "25px", textAlign: "center", color: "black" }}>Roll Details Submitted Successfully.</p>
                        {<DialogActionsBar>
                            <button className="k-button" onClick={this.toggleDialog}>Okay</button>
                        </DialogActionsBar>}
                    </Dialog>}
                </div>
            </React.Fragment>
        );

    }
}


const mapStateToProps = () =>
    createStructuredSelector({
        //  formOneVar : selectors.makeSelectFromOneVar()
        //showretrytable: selectors.makeSelectorsShowRetrytable();
        dbRollData: selectors.makeSelectDbRollData()
    });


function mapDispatchToProps(dispatch) {
    return {
        setFormData: (params) => { dispatch(actions.saveFormData(params)) },
        getDbRollDetails: () => { dispatch(actions.getDbRollDetails()) }
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Production);