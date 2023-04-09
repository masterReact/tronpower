#include <WiFi.h>
#include <TronWeb.h>

// Define the WiFi network credentials
const char* ssid = "your_network_name";
const char* password = "your_network_password";

// Define the Tron node information
const char* fullNode = "your_full_node_url";
const char* solidityNode = "your_solidity_node_url";
const char* eventServer = "your_event_server_url";
const char* privateKey = "your_private_key";

// Define the smart contract information
const char* contractAddress = "your_contract_address";
const char* abi = "your_contract_abi";

// Define the function to call on the smart contract
const char* functionName = "your_function_name (consumeElectricity)";
const char* functionArgs = "your_function_arguments (amount Used and id of prosumer)";

void setup() {
  // Connect to the WiFi network
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Initialize the TronWeb object with the node information and private key
  TronWeb tron(fullNode, solidityNode, eventServer, privateKey);

  // Create a new contract object using the contract address and ABI
  Contract contract = tron.contract(abi, contractAddress);

  // Call the function on the smart contract with the specified arguments
  contract.callFunction(functionName, functionArgs);
}

void loop() {
  // Do nothing in the loop
}
