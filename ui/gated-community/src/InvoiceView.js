
import React, { useState } from 'react';
import { Button, Modal, ModalHeader, FormGroup, Card, CardTitle, CardHeader, ModalBody, Label, Col, Input, ModalFooter } from 'reactstrap';
// import WorkIcon from './Icon'
// import SchoolIcon from './Icon'
// import StarIcon from './Icon'
// import { GetFormattedDate } from '../../helper/utils';


var dateFormat = require('dateformat');



const InvoiceView = (props) => {
    const {
        buttonLabel,
        className,
        invoiceDetails,
        modal,
        toggle
    } = props;

    console.log("========================================", props.invoiceDetails)



    return (
        <div style={{ background: 'rgb(33, 150, 243)', color: '#fff' }}>
            {/* <Button color="danger" onClick={toggle}>{buttonLabel}</Button> */}
            {invoiceDetails ? (
                <Modal isOpen={modal} toggle={toggle} className={className} size="lg">
                    <ModalHeader className="border-0" toggle={toggle} bsSize='lg'>
                        <h3 className="mb-0">Invoice Details</h3> </ModalHeader>

                    <Card className="bg-secondary px-md-2">
                        <ModalBody >
                            {/* {JSON.stringify(invoiceDetails)} */}
                            <Card className="py-4 px-md-4">
                                {JSON.stringify(invoiceDetails)}


                                <FormGroup row>
                                    {/* <Label  sm={2}>Title</Label> */}
                                    <Col sm={3}>
                                        <Label>Id</Label>
                                    </Col>
                                    <Col sm={1}>
                                        <Label>: </Label>
                                    </Col>
                                    <Col sm={8}>
                                        <Label>{invoiceDetails.id}</Label>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col sm={3}>
                                        <Label >Status</Label>
                                    </Col>
                                    <Col sm={1}>
                                        <Label >:</Label>
                                    </Col>
                                    <Col sm={8}>
                                        <Label for="exampleEmail" >{invoiceDetails.Status}</Label>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col sm={3}>
                                        <Label >Consumer Name</Label>
                                    </Col>
                                    <Col sm={1}>
                                        <Label >:</Label>
                                    </Col>
                                    <Col sm={8}>
                                        <Label for="exampleEmail" >{invoiceDetails.consumer.name}</Label>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col sm={3}>
                                        <Label >Cnsumer ID</Label>
                                    </Col>
                                    <Col sm={1}>
                                        <Label >:</Label>
                                    </Col>
                                    <Col sm={8}>
                                        <Label for="exampleEmail" >{invoiceDetails.consumer.id}</Label>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col sm={3}>
                                        <Label >Amount</Label>
                                    </Col>
                                    <Col sm={1}>
                                        <Label >:</Label>
                                    </Col>
                                    <Col sm={8}>
                                        <Label for="exampleEmail" >{invoiceDetails.amount}</Label>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col sm={3}>
                                        <Label >Product Details</Label>
                                    </Col>
                                    <Col sm={1}>
                                        <Label >:</Label>
                                    </Col>
                                    <Col sm={8}>
                                        <Label for="exampleEmail" >{"Name : " + invoiceDetails.Products[0].name + " & Amount: " + invoiceDetails.Products[0].amount}</Label>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col sm={3}>
                                        <Label >Start Date</Label>
                                    </Col>
                                    <Col sm={1}>
                                        <Label >:</Label>
                                    </Col>
                                    <Col sm={8}>
                                        <Label  >{dateFormat(invoiceDetails.startDate, "yyyy-mm-dd")}</Label>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col sm={3}>
                                        <Label >End Date</Label>
                                    </Col>
                                    <Col sm={1}>
                                        <Label >:</Label>
                                    </Col>
                                    <Col sm={8}>
                                        <Label  >{dateFormat(invoiceDetails.endDate, "yyyy-mm-dd")}</Label>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col sm={3}>
                                        <Label >Invoice File Name</Label>
                                    </Col>
                                    <Col sm={1}>
                                        <Label >:</Label>
                                    </Col>
                                    <Col sm={8}>
                                        <Label src={invoiceDetails.file.name} >{"Open File"}</Label>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col sm={3}>
                                        <Label >Invoice File</Label>
                                    </Col>
                                    <Col sm={1}>
                                        <Label >:</Label>
                                    </Col>
                                    <Col sm={8}>
                                        {/* <Label href={invoiceDetails.document.url} >{"Open File"}</Label> */}
                                        <a href={invoiceDetails.file.url} target="_blank">Show File</a>
                                    </Col>
                                </FormGroup>

                                {invoiceDetails && invoiceDetails.transactions.length ?
                                    invoiceDetails.transactions.map((tx, index) => {
                                        return (
                                            <FormGroup row>
                                                <Col sm={2}>
                                                    <Label ></Label>
                                                </Col>
                                                <Col sm={2}>
                                                    <Label style={{padding:10}}>{index+ 1 +" ) "}</Label>
                                                </Col>
                                                <Col sm={8}>
                                                    <Card border="primary" style={{ padding: 10, MozBorderRadius: 20 }}>
                                                        <Label> {"Transaction ID : " + tx.transactionId}</Label>
                                                        <Label> {"From Account Number : " + tx.fromAccountNumber}</Label>
                                                        <Label> {"To Account Number : " + tx.toAccountNUmber}</Label>
                                                        <Label> {"Amount : " + tx.amount}</Label>
                                                        <Label> {"Transaction Date : " + dateFormat(tx.transactionDate, "yyyy-mm-dd")}</Label>
                                                    </Card>
                                                </Col>
                                            </FormGroup>

                                        )
                                    })
                                    : null}
                            </Card>

                        </ModalBody>

                    </Card>
                    <ModalFooter>
                        <Button color="primary" onClick={toggle}>OK</Button>{' '}
                        {/* <Button color="secondary" onClick={toggle}>Cancel</Button> */}
                    </ModalFooter>
                </Modal>
            ) : null}
        </div>
    );
}

export default InvoiceView;