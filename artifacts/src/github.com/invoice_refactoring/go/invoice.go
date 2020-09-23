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

type Invoice struct {
	ID           string        `json:"id"`
	Consumer     Consumer      `json:"consumer"`
	Transactions []Transaction `json:"transactions"`
	Amount       string        `json:"amount"`
	Status       string        `json"status"`
	DocType      string        `json:"docType"`
	StartDate    uint64        `json:"startDate"`
	EndDate      uint64        `json:"endDate"`
	Creator      string        `json:"creator"`
	Products     []Product     `json"products"`
	Description  string        `json:"description"`
	File         File          `json:"file"`
}

type File struct {
	Name        string `json:"name"`
	URL         string `json:"url"`
	ContentHash string `json:"contentHash"`
}

type Product struct {
	Name   string `json:"name"`
	Amount string `json:"amount"`
}

type Consumer struct {
	Name    string `json:"name"`
	ID      string `json:"id"`
	Address string `json:"address"`
	Phone   string `json:"phone"`
}

type Transaction struct {
	TransactionID     string `json:"transactionId"`
	FromAccountNumber string `json:"fromAccountNumber"`
	ToAccountNumber   string `json:"toAccountNUmber"`
	Amount            string `json:"amount"`
	TransactionDate   uint64 `json:"transactionDate"`
}

func (s *SmartContract) CreateInvoice(ctx contractapi.TransactionContextInterface, invoiceData string) (string, error) {

	if len(invoiceData) == 0 {
		return "", fmt.Errorf("Please pass the correct contract data")
	}

	var invoice Invoice
	err := json.Unmarshal([]byte(invoiceData), &invoice)
	if err != nil {
		return "", fmt.Errorf("Failed while unmarshling contract. %s", err.Error())
	}

	invoiceDetails, err := ctx.GetStub().GetState(invoice.ID)

	if err != nil {
		return "", fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if invoiceDetails != nil {
		return "", fmt.Errorf(" Invoice with ID %s already exist in database", invoice.ID)
	}

	invoiceAsBytes, err := json.Marshal(invoice)
	if err != nil {
		return "", fmt.Errorf("Failed while marshling contract. %s", err.Error())
	}

	//  txId := ctx.GetStub().GetTxID()

	return ctx.GetStub().GetTxID(), ctx.GetStub().PutState(invoice.ID, invoiceAsBytes)
}

var logger = flogging.MustGetLogger("fabcar_cc")

func (s *SmartContract) UpdateInvoice(ctx contractapi.TransactionContextInterface, invoiceID string, transactionDetails string, status string) (string, error) {

	if len(invoiceID) == 0 {
		return "", fmt.Errorf("Please pass the correct visitor id")
	}

	invoiceAsBytes, err := ctx.GetStub().GetState(invoiceID)

	if err != nil {
		return "", fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if invoiceAsBytes == nil {
		return "", fmt.Errorf("%s does not exist", invoiceID)
	}

	invoice := new(Invoice)
	_ = json.Unmarshal(invoiceAsBytes, invoice)

	var transaction Transaction
	err = json.Unmarshal([]byte(transactionDetails), &transaction)

	invoice.Transactions = append(invoice.Transactions, transaction)
	invoice.Status = status

	invoiceAsBytes, err = json.Marshal(invoice)
	if err != nil {
		return "", fmt.Errorf("Failed while marshling invoice. %s", err.Error())
	}

	//  txId := ctx.GetStub().GetTxID()

	return ctx.GetStub().GetTxID(), ctx.GetStub().PutState(invoice.ID, invoiceAsBytes)

}

func (s *SmartContract) GetHistoryForAsset(ctx contractapi.TransactionContextInterface, invoiceID string) (string, error) {

	resultsIterator, err := ctx.GetStub().GetHistoryForKey(invoiceID)
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

func (s *SmartContract) GetInvoiceById(ctx contractapi.TransactionContextInterface, invoiceID string) (*Invoice, error) {
	if len(invoiceID) == 0 {
		return nil, fmt.Errorf("Please provide correct contract Id")
		// return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	invoiceAsBytes, err := ctx.GetStub().GetState(invoiceID)

	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if invoiceAsBytes == nil {
		return nil, fmt.Errorf("%s does not exist", invoiceID)
	}

	invoice := new(Invoice)
	_ = json.Unmarshal(invoiceAsBytes, invoice)

	return invoice, nil

}

func (s *SmartContract) GetContractsForQuery(ctx contractapi.TransactionContextInterface, queryString string) ([]Invoice, error) {

	queryResults, err := s.getQueryResultForQueryString(ctx, queryString)

	if err != nil {
		return nil, fmt.Errorf("Failed to read from ----world state. %s", err.Error())
	}

	return queryResults, nil

}

func (s *SmartContract) getQueryResultForQueryString(ctx contractapi.TransactionContextInterface, queryString string) ([]Invoice, error) {

	// resultsIterator, err := ctx.GetStub().GetPrivateDataQueryResult("collectionMarbles", queryString)
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	results := []Invoice{}

	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		newInvoice := new(Invoice)

		err = json.Unmarshal(response.Value, newInvoice)
		if err != nil {
			return nil, err
		}

		results = append(results, *newInvoice)
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
