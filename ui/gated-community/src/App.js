import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { Form, FormGroup, Label, Input, Button, Spinner, Col, CustomInput, Table, Card } from 'reactstrap'
// import AddTransaction from './AddTransaction'
import axios from 'axios'
import jwt from 'jsonwebtoken'
// import ContractView from './ContractView.js';
import InvoiceView from './InvoiceView'


import Transaction from './Transaction'
function App() {

  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdminUser, setIsAdminUser] = useState(false)
  const [isSecurityGuard, setIsSecurityGuard] = useState(false)
  const [isLoading, setisLoading] = useState(false)
  const [visitorId, setVisitorId] = useState('')
  const [name, setName] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [photoURL, setPhotoURL] = useState('')
  const [isQurantined, setIsQurantined] = useState(false)
  const [invoiceList, setInvoiceList] = useState([])
  const [visitirInfoData, setVisitirInfoData] = useState(null)
  const [modal, setModal] = useState(false);
  const [searchVisitorId, setSearchVisitorId] = useState('')
  const [transactioModel, setTransactioModel] = useState(false)

  const [selectedInvoice, setSelectedInvoice] = useState(null)


  const toggleModal = () => setModal(!modal);
  const toggleTransactionModal = ()=> setTransactioModel(!transactioModel)
  // const toggleApproveModel = () => setApproveModel(!approveModel)
  const viewInvoice = (index) => {
    setModal(!modal);
    setSelectedInvoice(invoiceList[index])
  }

  const AddTransaction = (index) => {
    setTransactioModel(!transactioModel)
    setSelectedInvoice(invoiceList[index])
  }

  const inputChangeHandler = (value, fieldName) => {

    switch (fieldName) {
      case 'userName': setUserName(value); break;
      case 'password': setPassword(value); break;
      case 'visitorId': setVisitorId(value); break;
      case 'name': setName(value); break;
      case 'mobileNumber': setMobileNumber(value); break;
      case 'photoURL': setPhotoURL(value); break;
      case 'searchVisitorId': setSearchVisitorId(value); break;
      // case 'isSecurityGuard': setIsSecurityGuard(!isSecurityGuard); console.log(`switch  SG value is : ${isSecurityGuard}`); break;
      case 'isQurantined': setIsQurantined(!isQurantined); console.log(`switch value is : ${isQurantined}`); break;
      default:
        break;
    }
  }

  const headers = () => ({
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const getVisitorData = () => {
    axios.get(`http://localhost:4000/channels/mychannel/chaincodes/gated_community?args=[${searchVisitorId}]&peer=peer0.org1.example.com&fcn=GetVisitorById`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(response => {

        console.log(response.data.result)
        if (response && response.data && response.data.result) {
          setVisitirInfoData(response.data.result)
        }

      }).catch(err => {


      })

  }

  const logout = () => {

    localStorage.removeItem('token')
    setIsLoggedIn(false)
    setIsAdminUser(false)
    setIsSecurityGuard(false)
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true)
      getInvoiceList()
    }
  }, [])

  // const updateQuarantineStatus = (i) => {
  //   // let visitorInfo = {
  //   //   "id": visitor.id,
  //   //   "Name": visitor.name,
  //   //   "mobileNumber": mobileNumber,
  //   //   "photoURL": photoURL,
  //   //   "isQuarantined": isQurantined,
  //   //   "docType": "Visitor",
  //   //   "creator": localStorage.getItem("username")
  //   // }
  //   let visitor = visitorList[i]
  //   visitor.IsQuarantined=visitorList[i].IsQuarantined?false:true

  //   //svisitor.isQuarantined = visitorList[i].isQuarantined?false:true
  //   console.log(`visitor data is : ${JSON.stringify(visitor)}`)
  //   let body = {
  //     "fcn": "CreateVisitor",
  //     "peers": ["peer0.org1.example.com", "peer0.org2.example.com"],
  //     "chaincodeName": "gated_community",
  //     "channelName": "mychannel",
  //     "args": [`${JSON.stringify(visitor)}`]
  //   }
  //   setisLoading(true)
  //   axios.post("http://localhost:4000/channels/mychannel/chaincodes/gated_community", body, {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${localStorage.getItem("token")}`
  //     }
  //   }).then(response => {
  //     console.log(`response id ----------- ${response}`)
  //     getVisitorList()
  //     // setisLoading(false)
  //   }).catch(err => {

  //     setisLoading(false)
  //   })

  // }

  const addVisitor = () => {

    let visitorInfo = {
      "id": visitorId,
      "Name": name,
      "mobileNumber": mobileNumber,
      "photoURL": photoURL,
      "isQuarantined": isQurantined,
      "docType": "Visitor",
      "creator": localStorage.getItem("username")
    }

    setVisitorId('')
    setName('')
    setMobileNumber('')
    setPhotoURL('')
    setIsQurantined(false)


    console.log(`Visitor Info is :${visitorInfo}`)

    // let data = 

    let body = {
      "fcn": "CreateVisitor",
      "peers": ["peer0.org1.example.com", "peer0.org2.example.com"],
      "chaincodeName": "gated_community",
      "channelName": "mychannel",
      "args": [`${JSON.stringify(visitorInfo)}`]
    }
    setisLoading(true)
    axios.post("http://localhost:4000/channels/mychannel/chaincodes/gated_community", body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }).then(response => {
      console.log(`response id ----------- ${response}`)
      getInvoiceList()
      // setisLoading(false)
    }).catch(err => {

      setisLoading(false)
    })

  }

  const login = () => {
    console.log(`user name is ${userName} and password is ${password}`)

    let userInfo = {
      "username": userName,
      "orgName": password
    }
    console.log(userName)

    setisLoading(true)

    axios.post("http://localhost:4000/users", userInfo)
      .then(response => {

        console.log(JSON.stringify(response.data))

        if (response.data.success) {
          localStorage.setItem('token', response.data.token)

          console.log(response.data.token)
          console.log(localStorage.getItem("token"))




          let payload = jwt.decode(response.data.token)
          console.log(payload)
          localStorage.setItem("username", payload.username)
          localStorage.setItem("organisation", payload.orgName)
          // if (payload.username == "superuser") {
          //   // isAdminUser(true)
          // }
          setIsLoggedIn(true)
          // history.push('/admin/index')

          getInvoiceList()

          // axios.get("http://localhost:4000/channels/mychannel/chaincodes/gated_community?args=[]&peer=peer0.org1.example.com&fcn=GetContractsForQuery", {
          //   headers: {
          //     "Content-Type": "application/json",
          //     Authorization: `Bearer ${localStorage.getItem("token")}`
          //   }
          // })
          //   .then(response => {
          //     setisLoading(false)
          //     console.log(response.data.result)
          //     setVisitorList(response.data.result)
          //   })

        } else {

          alert(response.data.error)
        }

      }).catch(err => {
        console.log(`===========================`)
        console.log(err)
        setisLoading(true)
      })
  }


  const getInvoiceList = () => {

    axios.get("http://localhost:4000/channels/mychannel/chaincodes/invoice_refactoring?args=[]&peer=peer0.org1.example.com&fcn=GetContractsForQuery", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(response => {
        setisLoading(false)
        console.log(response.data.result)
        if (response && response.data && response.data.result && response.data.result.length && typeof response.data.result != 'string') {
          setInvoiceList(response.data.result)

        }
      }).catch(err => {

        setisLoading(false)
      })
  }

  let progress = (<div>
    <Spinner type="grow" color="primary" />
    <Spinner type="grow" color="secondary" />
    <Spinner type="grow" color="success" />
    <Spinner type="grow" color="danger" />
    <Spinner type="grow" color="warning" />
    <Spinner type="grow" color="info" />
    <Spinner type="grow" color="light" />
    <Spinner type="grow" color="dark" />
  </div>)

  return (
    <div className="App" style={{ paddingTop: 30, paddingLeft: 100, textAlign: 'center', alignItems: 'center', position: 'absolute' }}>
      {isLoggedIn ? <Button color="primary" onClick={() => { logout() }} style={{ margin: 40 }}>Logout</Button> :


        <Form  >
          <FormGroup>
              {/* <AddTransaction/> */}
            <Label for="exampleEmail" hidden>Email</Label>
            <Input onChange={e => { inputChangeHandler(e.target.value, 'userName') }} placeholder="Email" />
          </FormGroup>
          {' '}
          <FormGroup>
            <Label for="examplePassword" hidden>Password</Label>
            <Input type="password" onChange={e => { inputChangeHandler(e.target.value, 'password') }} placeholder="Password" />
          </FormGroup>
          {' '}
          {/* <FormGroup row>
            <Col sm={2}>
              <CustomInput type="checkbox" value={isSecurityGuard} checked={isSecurityGuard} onChange={e => { inputChangeHandler(e.target.value, 'isSecurityGuard') }} id="exampleCustomCheckbox3" label="" />

            </Col>
            <Col sm={10} style={{ paddingTop: 20 }}>
              <Label >Is Security Login?</Label>
            </Col>
          </FormGroup> */}
          {' '}
          <FormGroup>
            <Button onClick={() => { login() }}>Login</Button>

          </FormGroup>
          {' '}


        </Form>}
      {isLoading ? progress : null}


      {!isSecurityGuard && isLoggedIn ?
        <div>
          <InvoiceView modal={modal} toggle={toggleModal} invoiceDetails={selectedInvoice} />
          {/* <AddTransaction modal={transactioModel} toggle={toggleTransactionModal} invoiceDetails={selectedInvoice}/> */}
          <Transaction modal={transactioModel} toggle={toggleTransactionModal} invoiceDetails={selectedInvoice}/>
          <Form>
            <FormGroup row>
              <Label sm={4}>Visitor Id</Label>
              <Col sm={8}>
                <Input value={visitorId} onChange={e => { inputChangeHandler(e.target.value, 'visitorId') }} placeholder="Enter Contract Type " />
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label sm={4}>Name</Label>
              <Col sm={8}>
                <Input value={name} onChange={e => { inputChangeHandler(e.target.value, 'name') }} placeholder="Enter First Party Name " />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={4}>Mobile No</Label>
              <Col sm={8}>
                <Input type="text" value={mobileNumber} onChange={e => { inputChangeHandler(e.target.value, 'mobileNumber') }} placeholder="Enter Second Party Name" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={4}>Photo Url</Label>
              <Col sm={8}>
                <Input type="text" value={photoURL} onChange={e => { inputChangeHandler(e.target.value, 'photoURL') }} placeholder="Enter Second Party Name" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col sm={4}>
                <Label >Qurantined?</Label>
              </Col>
              <Col sm={1} style={{ paddingTop: -60 }}>
                <CustomInput type="checkbox" value={isQurantined} onChange={e => { inputChangeHandler(e.target.value, 'isQurantined') }} id="exampleCustomCheckbox2" label="" />
              </Col>
            </FormGroup>

            <Button color="primary" onClick={() => addVisitor()}>Add Invoice</Button>{' '}
          </Form>

          <div style={{ padding: 30 }}>
            <Table responsive >
              <thead>
                <tr>
                  <th>#</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Photo URL</th>
                  <th>Is Quarantined</th>
                  <th> View</th>
                  <th>Action</th>
                </tr>
              </thead>

              {invoiceList && invoiceList.length ? invoiceList.map((invoice, i) => {
                return (
                  <tbody>
                    <tr>
                      <th scope="row">{i + 1}</th>
                      <td>{invoice.id}</td>
                      <td>{invoice.consumer.name}</td>
                      <td>{invoice.Status}</td>
                      <td>{invoice.file.url}</td>
                      <td>{invoice.amount}</td>
                      <td> <Button color="primary" onClick={() => viewInvoice(i)}>View Invoice</Button>{' '}</td>
                      <td> <Button color="primary" onClick={() => AddTransaction(i)}>Add Tx</Button>{' '}</td>
                    </tr>
                  </tbody>
                )

              }) : null}
            </Table>
          </div>

        </div>


        : null}


      {isLoggedIn && isSecurityGuard ?
        <div style={{ padding: 60 }}>
          <Card style={{ padding: 60 }}>
            <Form>
              <FormGroup row>
                {/* <Label for="exampleEmail" sm={2}>Email</Label> */}
                <Col sm={5}>
                  <Input type="text" onChange={e => { inputChangeHandler(e.target.value, 'searchVisitorId') }} placeholder="Enter Visitor Id" />
                </Col>

                <Col sm={7}>
                  {/* <Input type="email" name="email" id="exampleEmail" placeholder="with a placeholder" /> */}
                  <Button color="primary" disabled={searchVisitorId == "" || searchVisitorId == null} onClick={() => getVisitorData()}>Get Visitor Details</Button>{' '}
                </Col>
              </FormGroup>
              {visitirInfoData && visitirInfoData.Name ?
                <Card>
                  <div style={{ padding: 10 }}>

                    <FormGroup row>
                      <Label for="exampleEmail" sm={4}>Name</Label>
                      <Col sm={8}>
                        <Label for="exampleEmail" >{visitirInfoData.Name}</Label>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="exampleEmail" sm={4}>ID</Label>
                      <Col sm={8}>
                        <Label for="exampleEmail" >{visitirInfoData.id}</Label>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="exampleEmail" sm={4}>Mobile Number</Label>
                      <Col sm={8}>
                        <Label for="exampleEmail" >{visitirInfoData.mobileNumber}</Label>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col sm={4}>
                        <Label >Photo URL</Label>
                      </Col>
                      <Col sm={1}>
                        <Label >:</Label>
                      </Col>
                      <Col sm={7}>
                        <Label for="exampleEmail" >{visitirInfoData.photoURL}</Label>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col sm={4}>
                        <Label >Querentined?</Label>
                      </Col>
                      <Col sm={1}>
                        <Label >:</Label>
                      </Col>
                      <Col sm={7}>
                        <Label for="exampleEmail" >{visitirInfoData.isQuarantined ? "Yes" : "No"}</Label>
                      </Col>
                    </FormGroup>
                  </div>

                </Card>
                : null}
            </Form>

          </Card>
        </div>

        : null}



    </div>
  );
}

export default App;
