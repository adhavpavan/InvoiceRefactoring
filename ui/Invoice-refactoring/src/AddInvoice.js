
import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormFeedback, Card, Form, FormGroup, Label, Input, Col, CustomInput } from 'reactstrap';
// import { routes, headers } from '../../helper/config'
import axios from 'axios'
import ProgressBar from './ProgressBar'
// import { nanoid } from 'nanoid'
// import { useToasts } from 'react-toast-notifications'

// import { getTimeStamp } from '../../helper/utils'

const AddInvoice = (props) => {
  const {
    buttonLabel,
    className,
    modal,
    toggle,
    updateData
  } = props;

  const [id, setId] = useState('')
  const [amount, setAmount] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [description, setDescription] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [productName, setProductName] = useState('')
  const [productAmount, setProductAmount] = useState('')
  const [document, setDocument] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(false)



  const getTimeStamp = (dateString) => {
    let date = dateString.split("-");
    var newDate = new Date(date[0], date[1] - 1, date[2]);
    let timestamp = newDate.getTime()
    return timestamp
  }



  // let token = localStorage.getItem('token')

  const validateAndAddInvoice = () => {
    let isInvalid = false

    setIsValidating(true)

    if (id == '') {
      isInvalid = true
    }
    if (amount == '') {

      isInvalid = true
    }
    if (startDate == '') {

      isInvalid = true
    }
    if (endDate == '') {

      isInvalid = true
    }
    if (description == '') {

      isInvalid = true
    }
    if (customerName == '') {

      isInvalid = true
    }
    if (customerId == '') {

      isInvalid = true
    }
    if (address == '') {

      isInvalid = true
    }
    if (phone == '') {

      isInvalid = true
    }
    if (productName == '') {

      isInvalid = true
    }
    if (productAmount == '') {

      isInvalid = true
    }


    if (!isInvalid) {
      addInvoice()
    }

  }

  const addInvoice = () => {


    let invoice = {
      "id":id,
      "amount": amount,
      "startDate": getTimeStamp(startDate),
      "endDate": getTimeStamp(endDate),
      "description": description,
      "consumer":{
        "name": customerName,
        "id": customerId,
        "address": address,
        "phone": phone
      },
      "products":[{
        "name": productName,
        "amount": productAmount

      }],
      "file":{
        "name":"Test",
        "url":"www.abc.com",
        "contentHash":"YWSERGFEOFJMOSEPMPSEINISUYFESUINFHIUOS"
      },
      "transactions":[],
      "docType": "Invoice",
      "status": "InProgress",
      "creator": localStorage.getItem("username")
    }

    let Timestamp = getTimeStamp(startDate)
    console.log("====================", Timestamp)

    let data = {
      "fcn": "CreateInvoice",
      "chaincodeName": "invoice_refactoring",
      "channelName": "mychannel",
      // "args": [`${JSON.stringify(invoice)}`]
      "args": [invoice, document]
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
        updateData()
        console.log(`response id ----------- ${response}`)
        // getVisitorList()
        setIsLoading(false)
        toggle()
      }).catch(err => {

        toggle()
        setIsLoading(false)
      })


  }

  const getFile = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        // let fileType = reader.result.split(';')[0];
        let fileDetails = {
          fileData: reader.result.split(";base64,")[1],
          name: file.name,
        };

        console.log("aaaaaaaaaaaaaaaaa", fileDetails)

        setDocument(fileDetails)

        // let doc = {
        //   "id": "1233",
        //   "name": "Rent Agrement",
        //   "url": "abc.com",
        //   "contentHash": "12233324regrdssd"
        // }

        // setDocument(doc)
      };
    }
  };

  const inputChangeHandler = (value, fieldName) => {
    switch (fieldName) {
      case 'id': setId(value); break;
      case 'amount': setAmount(value); break;
      case 'description': setDescription(value); break;
      case 'customerName': setCustomerName(value); break;
      case 'startDate': setStartDate(value); break;
      case 'endDate': setEndDate(value); break;

      case 'customerId': setCustomerId(value); break;
      case 'address': setAddress(value); break;
      case 'phone': setPhone(value); break;
      case 'productName': setProductName(value); break;
      case 'productAmount': setProductAmount(value); break;
      // case 'endDate': setEndDate(value); break;


      default:
        break;
    }


    console.log(`input changing`)
  }



  return (
    <div>
      {/* <Button color="danger" onClick={toggle}>{buttonLabel}</Button> */}
      <Modal isOpen={modal} toggle={toggle} className={className} size={'lg'}>
        <ModalHeader toggle={toggle}>Add Invoice Details</ModalHeader>
        {isLoading ? <ProgressBar /> :
          (<>

            <Card className="bg-secondary  px-md-2">
              <ModalBody>
                <FormGroup row>
                  <Label sm={3}>ID</Label>
                  <Col sm={9}>
                    <Input type="text" invalid={isValidating && id == ''} onChange={e => { inputChangeHandler(e.target.value, 'id') }} placeholder="Enter Title of Contract" />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>
                <Form>
                  <FormGroup row>
                    <Label sm={3}>Amount</Label>
                    <Col sm={9}>
                      <Input invalid={isValidating && amount == ''} onChange={e => { inputChangeHandler(e.target.value, 'amount') }} placeholder="Enter Contract Type " />
                      <FormFeedback>*Required</FormFeedback>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label sm={3}>Description</Label>
                    <Col sm={9}>
                      <Input invalid={isValidating && description == ''} onChange={e => { inputChangeHandler(e.target.value, 'description') }} placeholder="Enter First Party Name " />
                      <FormFeedback>*Required</FormFeedback>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label for="examplePassword" sm={3}>Customer Name</Label>
                    <Col sm={9}>
                      <Input type="text" invalid={isValidating && customerName == ''} onChange={e => { inputChangeHandler(e.target.value, 'customerName') }} placeholder="Enter customer Name" />
                      <FormFeedback>*Required</FormFeedback>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="examplePassword" sm={3}>Customer ID</Label>
                    <Col sm={9}>
                      <Input type="text" invalid={isValidating && customerId == ''} onChange={e => { inputChangeHandler(e.target.value, 'customerId') }} placeholder="Enter customer ID" />
                      <FormFeedback>*Required</FormFeedback>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="examplePassword" sm={3}>Address</Label>
                    <Col sm={9}>
                      <Input type="text" invalid={isValidating && address == ''} onChange={e => { inputChangeHandler(e.target.value, 'address') }} placeholder="Enter customer address" />
                      <FormFeedback>*Required</FormFeedback>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="examplePassword" sm={3}>Phone</Label>
                    <Col sm={9}>
                      <Input type="text" invalid={isValidating && phone == ''} onChange={e => { inputChangeHandler(e.target.value, 'phone') }} placeholder="Entercustomer phone number" />
                      <FormFeedback>*Required</FormFeedback>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="examplePassword" sm={3}>Product Name</Label>
                    <Col sm={9}>
                      <Input type="text" invalid={isValidating && productName == ''} onChange={e => { inputChangeHandler(e.target.value, 'productName') }} placeholder="Enter product name" />
                      <FormFeedback>*Required</FormFeedback>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="examplePassword" sm={3}>Product Amount</Label>
                    <Col sm={9}>
                      <Input type="text" invalid={isValidating && productAmount == ''} onChange={e => { inputChangeHandler(e.target.value, 'productAmount') }} placeholder="Enter product amount" />
                      <FormFeedback>*Required</FormFeedback>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={3}>Start Date</Label>
                    <Col sm={9}>
                      <Input
                        invalid={isValidating && startDate == ''}
                        onChange={e => { inputChangeHandler(e.target.value, 'startDate') }}
                        type="date"
                        name="date"
                        id="exampleDate"
                        placeholder="date placeholder"
                      />
                      <FormFeedback>*Required</FormFeedback>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label sm={3}>End Date</Label>
                    <Col sm={9}>
                      <Input
                        invalid={isValidating && endDate == ''}
                        onChange={e => { inputChangeHandler(e.target.value, 'endDate') }}
                        type="date"
                        name="date"
                        id="exampleDate"
                        placeholder="date placeholder"
                      />
                      <FormFeedback>*Required</FormFeedback>
                    </Col>
                  </FormGroup>

                  <FormGroup row>

                    <Col sm={2}>
                      <Label > Document</Label>
                    </Col>
                    <Col sm={1}>
                      <Label > : </Label>
                    </Col>
                    <Col sm={9}>
                      <CustomInput invalid={isValidating && document == ''} type="file" accept=".pdf, .PDF" onChange={e => { getFile(e) }} id="exampleCustomFileBrowser" name="customFile" />
                      <FormFeedback>*Required</FormFeedback>
                    </Col>
                  </FormGroup>




                </Form>

                {/* Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. */}
              </ModalBody>
            </Card>

            <ModalFooter>
              <Button color="primary" onClick={() => { validateAndAddInvoice() }}>Submit Invoice</Button>{' '}
              <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
          </>)
        }
      </Modal>
    </div>
  );
}

export default AddInvoice;