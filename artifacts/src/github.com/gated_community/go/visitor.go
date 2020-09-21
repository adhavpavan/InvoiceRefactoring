package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"github.com/hyperledger/fabric/common/flogging"
)

type SmartContract struct {
	contractapi.Contract
}

type Visitor struct {
	Name          string `json:"Name"`
	MobileNumber  string `json:"mobileNumber"`
	ID            string `json:"id"`
	PhotoURL      string `json:"photoURL"`
	IsQuarantined bool   `json:isQuarantined`
	DocType       string `json:"docType"`
	Creator       string `json:"creator"`
}

func (s *SmartContract) CreateVisitor(ctx contractapi.TransactionContextInterface, visitorData string) error {

	if len(visitorData) == 0 {
		return fmt.Errorf("Please pass the correct contract data")
	}

	var visitor Visitor
	err := json.Unmarshal([]byte(visitorData), &visitor)
	if err != nil {
		return fmt.Errorf("Failed while unmarshling contract. %s", err.Error())
	}

	visitorAsBytes, err := json.Marshal(visitor)
	if err != nil {
		return fmt.Errorf("Failed while marshling contract. %s", err.Error())
	}

	//  txId := ctx.GetStub().GetTxID()

	return ctx.GetStub().PutState(visitor.ID, visitorAsBytes)
}

var logger = flogging.MustGetLogger("fabcar_cc")

func (s *SmartContract) UpdateVisitor(ctx contractapi.TransactionContextInterface, visitorID string, isQuarantined bool) error {

	// val, ok, err := cid.GetAttributeValue(ctx.GetStub(), "role")
	// if err != nil {
	// 	// There was an error trying to retrieve the attribute
	// 	return fmt.Errorf("Error while retriving attributes")
	// }
	// if !ok {
	// 	// The client identity does not possess the attribute
	// 	return fmt.Errorf("Client identity doesnot posses the attribute")
	// }
	// // Do something with the value of 'val'
	// if val != "admin" {
	// 	// fmt.Println("Attribute role: " + val)
	// 	return fmt.Errorf("Only user with role as ADMIN have access this method!")
	// } else {

	if len(visitorID) == 0 {
		return fmt.Errorf("Please pass the correct visitor id")
	}

	visitorAsBytes, err := ctx.GetStub().GetState(visitorID)

	if err != nil {
		return fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if visitorAsBytes == nil {
		return fmt.Errorf("%s does not exist", visitorID)
	}

	visitor := new(Visitor)
	_ = json.Unmarshal(visitorAsBytes, visitor)

	visitor.IsQuarantined = isQuarantined

	visitorAsBytes, err = json.Marshal(visitor)
	if err != nil {
		return fmt.Errorf("Failed while marshling contract. %s", err.Error())
	}

	//  txId := ctx.GetStub().GetTxID()

	return ctx.GetStub().PutState(visitor.ID, visitorAsBytes)
	// }

}

func (s *SmartContract) GetHistoryForAsset(ctx contractapi.TransactionContextInterface, visitorId string) (string, error) {

	resultsIterator, err := ctx.GetStub().GetHistoryForKey(visitorId)
	if err != nil {
		return "", fmt.Errorf(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing historic values for the marble
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return "", fmt.Errorf(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"TxId\":")
		buffer.WriteString("\"")
		buffer.WriteString(response.TxId)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Value\":")
		// if it was a delete operation on given key, then we need to set the
		//corresponding value null. Else, we will write the response.Value
		//as-is (as the Value itself a JSON marble)
		if response.IsDelete {
			buffer.WriteString("null")
		} else {
			buffer.WriteString(string(response.Value))
		}

		buffer.WriteString(", \"Timestamp\":")
		buffer.WriteString("\"")
		buffer.WriteString(time.Unix(response.Timestamp.Seconds, int64(response.Timestamp.Nanos)).String())
		buffer.WriteString("\"")

		buffer.WriteString(", \"IsDelete\":")
		buffer.WriteString("\"")
		buffer.WriteString(strconv.FormatBool(response.IsDelete))
		buffer.WriteString("\"")

		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	return string(buffer.Bytes()), nil
}

func (s *SmartContract) GetVisitorById(ctx contractapi.TransactionContextInterface, visitorId string) (*Visitor, error) {
	if len(visitorId) == 0 {
		return nil, fmt.Errorf("Please provide correct contract Id")
		// return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	visitorAsBytes, err := ctx.GetStub().GetState(visitorId)

	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if visitorAsBytes == nil {
		return nil, fmt.Errorf("%s does not exist", visitorId)
	}

	visitor := new(Visitor)
	_ = json.Unmarshal(visitorAsBytes, visitor)

	return visitor, nil

}

func (s *SmartContract) GetContractsForQuery(ctx contractapi.TransactionContextInterface, queryString string) ([]Visitor, error) {
	// if len(contractId) == 0 {
	// 	return nil, fmt.Errorf("Please provide correct contract Id")
	// 	// return shim.Error("Incorrect number of arguments. Expecting 1")
	// }

	// queryString := fmt.Sprintf("{\"selector\":{\"owner\":\"%s\"}}", org)

	queryResults, err := s.getQueryResultForQueryString(ctx, queryString)

	if err != nil {
		return nil, fmt.Errorf("Failed to read from ----world state. %s", err.Error())
	}

	return queryResults, nil

}

func (s *SmartContract) getQueryResultForQueryString(ctx contractapi.TransactionContextInterface, queryString string) ([]Visitor, error) {

	// resultsIterator, err := ctx.GetStub().GetPrivateDataQueryResult("collectionMarbles", queryString)
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	results := []Visitor{}

	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		newVisitor := new(Visitor)

		err = json.Unmarshal(response.Value, newVisitor)
		if err != nil {
			return nil, err
		}

		results = append(results, *newVisitor)
	}
	return results, nil
}

func main() {

	chaincode, err := contractapi.NewChaincode(new(SmartContract))

	if err != nil {
		fmt.Printf("Error create fabcar chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting fabcar chaincode: %s", err.Error())
	}
}
