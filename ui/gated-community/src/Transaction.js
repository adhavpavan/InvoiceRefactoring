
import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormFeedback, Card, Form, FormGroup, Label, Input, Col, CustomInput } from 'reactstrap';
// import { routes, headers } from '../../helper/config'
import axios from 'axios'
import ProgressBar from './ProgressBar'


const Transaction = (props) => {
  const {
    buttonLabel,
    className,
    modal,
    toggle,
    invoiceDetails
  } = props;

  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(false)

  const [transactionId, setTransactionId] = useState('')
  const [fromAccountNumber, setFromAccountNumber] = useState('')
  const [toAccountNumber, setToAccountNumber] = useState('')
  const [amount, setAmount] = useState('')

  const updateInvoice = () => {
    let isInvalid = false

    setIsValidating(true)

    if (transactionId == '') {

      isInvalid = true
    }
    if (fromAccountNumber == '') {

      isInvalid = true
    }
    if (toAccountNumber == '') {

      isInvalid = true
    }
    if (amount == '') {

      isInvalid = true
    }
    if (!isInvalid) {
      addTransactionDetails()
    }

  }

  const addTransactionDetails = () => {

    let owner;
    let department;

    let transaction = {
      "id": transactionId,
      "fromAccountNumber": fromAccountNumber,
      "toAccountNUmber": toAccountNumber,
      "amount": amount,
      "transactionDate": new Date().getTime(),

    }

    // let Timestamp = getTimeStamp(startDate)
    // console.log("====================", Timestamp)

    let data = {
      "fcn": "UpdateInvoice",
      "chaincodeName": "invoice_refactoring",
      "channelName": "mychannel",
      "args": [invoiceDetails.id, `${JSON.stringify(transaction)}`, invoiceDetails.transactions.length ? "Completed" : "Inprogress"]
      // "args": [`${JSON.stringify(contract)}`, document]
    }

    // console.log(contract)

    setIsLoading(true)
    axios.post("http://localhost:4000/channels/mychannel/chaincodes/invoice_refactoring", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(response => {
        console.log(`response id ----------- ${response}`)
        // getVisitorList()
        setIsLoading(false)
        toggle()
      }).catch(err => {

        toggle()
        setIsLoading(false)
      })


  }


  const inputChangeHandler = (value, fieldName) => {
    switch (fieldName) {
      case 'transactionId': setTransactionId(value); break;
      case 'fromAccountNumber': setFromAccountNumber(value); break;
      case 'toAccountNUmber': setToAccountNumber(value); break;
      case 'amount': setAmount(value); break;
      default:
        break;
    }

    // console.log(title)


    console.log(`input changing`)
  }



  return (
    <div>
      <h1>Pavan</h1>
      {/* <Button color="danger" onClick={toggle}>{buttonLabel}</Button> */}
      <Modal isOpen={modal} toggle={toggle} className={className} size={'lg'}>
        <ModalHeader toggle={toggle}>Add Transaction Details</ModalHeader>
        {isLoading ? <ProgressBar /> :
          (<>

            <Card className="bg-secondary  px-md-2">
              <ModalBody>
                <FormGroup row>
                  <Label sm={4}>Invoice ID :</Label>
                  <Col sm={8}>
                    <Label sm={4}>{props && props.invoiceDetails ? props.invoiceDetails.id: ""}</Label>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={4}>Transaction ID</Label>
                  <Col sm={8}>
                    <Input type="text" invalid={isValidating && transactionId == ''} onChange={e => { inputChangeHandler(e.target.value, 'transactionId') }} placeholder="Enter Transaction Id" />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>
                <Form>
                  <FormGroup row>
                    <Label sm={4}>From Account Number</Label>
                    <Col sm={8}>
                      <Input invalid={isValidating && fromAccountNumber == ''} onChange={e => { inputChangeHandler(e.target.value, 'fromAccountNumber') }} placeholder="Enter To Account Number " />
                      <FormFeedback>*Required</FormFeedback>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label sm={4}>To Account Number</Label>
                    <Col sm={8}>
                      <Input invalid={isValidating && toAccountNumber == ''} onChange={e => { inputChangeHandler(e.target.value, 'toAccountNUmber') }} placeholder="Enter First Party Name " />
                      <FormFeedback>*Required</FormFeedback>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={4}>Amount</Label>
                    <Col sm={8}>
                      <Input type="text" invalid={isValidating && amount == ''} onChange={e => { inputChangeHandler(e.target.value, 'amount') }} placeholder="Enter Amount" />
                      <FormFeedback>*Required</FormFeedback>
                    </Col>
                  </FormGroup>
                </Form>

                {/* Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. */}
              </ModalBody>
            </Card>

            <ModalFooter>
              <Button color="primary" onClick={() => { updateInvoice() }}>Add Transaction</Button>{' '}
              <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
          </>)
        }
      </Modal>
    </div>
  );
}

export default Transaction;