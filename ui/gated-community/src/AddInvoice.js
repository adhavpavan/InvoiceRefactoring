
import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormFeedback, Card, Form, FormGroup, Label, Input, Col, CustomInput } from 'reactstrap';
import { routes, headers } from '../../helper/config'
import axios from 'axios'
import ProgressBar from './ProgressBar'
import { nanoid } from 'nanoid'
import { useToasts } from 'react-toast-notifications'

import { getTimeStamp } from '../../helper/utils'

const AddContract = (props) => {
  const {
    buttonLabel,
    className,
    modal,
    toggle
  } = props;

  const { addToast } = useToasts()


  const [title, setTitle] = useState('')
  const [typrOfContract, setTyprOfContract] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [firstParty, setFirstParty] = useState('')
  const [secondParty, setSecondParty] = useState('')
  const [document, setDocument] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(false)






  // let token = localStorage.getItem('token')

  const validateAndAddContract = () => {
    let isInvalid = false

    setIsValidating(true)

    if (title == '') {
      addToast(`Please add correct contract name`, {
        appearance: 'error',
        autoDismiss: true,
      })
      isInvalid = true
    }
    if (typrOfContract == '') {
      addToast(`Please add correct type of contract `, {
        appearance: 'error',
        autoDismiss: true,
      })
      isInvalid = true
    }
    if (startDate == '') {
      addToast(`Please add correct contract Start Date`, {
        appearance: 'error',
        autoDismiss: true,
      })
      isInvalid = true
    }
    if (endDate == '') {
      addToast(`Please add correct contract End Date`, {
        appearance: 'error',
        autoDismiss: true,
      })
      isInvalid = true
    }
    if (firstParty == '') {
      addToast(`Please add correct First Party name`, {
        appearance: 'error',
        autoDismiss: true,
      })
      isInvalid = true
    }
    if (secondParty == '') {
      addToast(`Please add correct Second Party name`, {
        appearance: 'error',
        autoDismiss: true,
      })
      isInvalid = true
    }
    if (document == '') {
      addToast(`Please select contract agrement file`, {
        appearance: 'error',
        autoDismiss: true,
      })
      isInvalid = true
    }

    if (!isInvalid) {
      addContract()
    }

  }

  const addContract = () => {

    let owner;
    let department;

    if (localStorage.getItem("org") == "Org1") {
      if (localStorage.getItem("department") == "Legal") {
        owner = "Org1"
        department = "Finantial"
      } else {
        owner = "Org2"
        department = "Legal"
      }
    } else if (localStorage.getItem("org") == "Org2") {
      if (localStorage.getItem("department") == "Legal") {
        owner = "Org2"
        department = "Finantial"
      } else {
        owner = "Org2"
        department = "Legal"
      }
    }

    let contract = {
      "id": nanoid(10),
      "typeOfContract": typrOfContract,
      "startDate": getTimeStamp(startDate),
      "endDate": getTimeStamp(endDate),
      "title": title,
      "firstParty": firstParty,
      "secondParty": secondParty,
      "status": "InProgress",
      "comments": ["Contract Created"],
      "document": {},
      "owner": owner,
      "department": department,
      "addedAt": new Date().getTime(),
      "docType": "Contract",
      "creator": {
        "email": localStorage.getItem("email"),
        "name": localStorage.getItem("username"),
        "org": localStorage.getItem("org"),
        "department": localStorage.getItem("department"),
        "role": "Approver"

      },
      steps: [
        {
          "description": "step 1 description",
          "status": "Approved",
          "comment": "This is comment",
          "addedAt": new Date().getTime(),
          user: {
            "email": localStorage.getItem("email"),
            "name": localStorage.getItem("username"),
            "org": localStorage.getItem("org"),
            "department": localStorage.getItem("department"),
            "role": "Approver"

          }
        }
      ]
    }

    let Timestamp = getTimeStamp(startDate)
    console.log("====================", Timestamp)

    let data = {
      "fcn": "CreateContract",
      "chaincodeName": "contract_cc",
      "channelName": "mychannel",
      "args": [contract, document]
      // "args": [`${JSON.stringify(contract)}`, document]
    }

    console.log(contract)

    setIsLoading(true)
    axios.post(routes.addContract, data, headers())
      .then(response => {

        addToast('Yeah! ContractAdded Successfully!', {
          appearance: 'success',
          autoDismiss: true,
        })
        console.log(`response id ----------- ${response}`)
        // getVisitorList()
        setIsLoading(false)
        toggle()
      }).catch(err => {
        addToast(`Ohh! Error Occured ${err}`, {
          appearance: 'error',
          autoDismiss: true,
        })
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
      case 'title': setTitle(value); break;
      case 'typeOfContract': setTyprOfContract(value); break;
      case 'firstParty': setFirstParty(value); break;
      case 'secondParty': setSecondParty(value); break;
      case 'startDate': setStartDate(value); break;
      case 'endDate': setEndDate(value); break;


      default:
        break;
    }

    console.log(title)


    console.log(`input changing`)
  }



  return (
    <div>
      {/* <Button color="danger" onClick={toggle}>{buttonLabel}</Button> */}
      <Modal isOpen={modal} toggle={toggle} className={className} size={'lg'}>
        <ModalHeader toggle={toggle}>Add Contract Details</ModalHeader>
        {isLoading ? <ProgressBar /> :
          (<>

            <Card className="bg-secondary  px-md-2">
              <ModalBody>
                <FormGroup row>
                  <Label sm={2}>Title</Label>
                  <Col sm={10}>
                    <Input type="text" invalid={isValidating && title == ''} onChange={e => { inputChangeHandler(e.target.value, 'title') }} placeholder="Enter Title of Contract" />
                    <FormFeedback>*Required</FormFeedback>
                  </Col>
                </FormGroup>
                <Form>
                  <FormGroup row>
                    <Label sm={2}>Contract Type</Label>
                    <Col sm={10}>
                      <Input invalid={isValidating && typrOfContract == ''} onChange={e => { inputChangeHandler(e.target.value, 'typeOfContract') }} placeholder="Enter Contract Type " />
                      <FormFeedback>*Required</FormFeedback>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label sm={2}>First Party</Label>
                    <Col sm={10}>
                      <Input invalid={isValidating && firstParty == ''} onChange={e => { inputChangeHandler(e.target.value, 'firstParty') }} placeholder="Enter First Party Name " />
                      <FormFeedback>*Required</FormFeedback>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="examplePassword" sm={2}>Second Party</Label>
                    <Col sm={10}>
                      <Input type="text" invalid={isValidating && secondParty == ''} onChange={e => { inputChangeHandler(e.target.value, 'secondParty') }} placeholder="Enter Second Party Name" />
                      <FormFeedback>*Required</FormFeedback>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={2}>Start Date</Label>
                    <Col sm={10}>
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
                    <Label sm={2}>End Date</Label>
                    <Col sm={10}>
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
              <Button color="primary" onClick={() => { validateAndAddContract() }}>Submit Contract</Button>{' '}
              <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
          </>)
        }
      </Modal>
    </div>
  );
}

export default AddContract;