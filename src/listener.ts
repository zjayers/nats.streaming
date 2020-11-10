// Imports
import { randomBytes } from "crypto";
import nats from "node-nats-streaming";
import { TicketCreatedListener } from "./events/TicketCreatedListener";

// Clear the console
console.clear();

// Randomly generate a clientID for the listener
const clientId = randomBytes(4).toString("hex");

// Connect to the nats client (documentation refers to this as 'stan'
// instead of 'client')
const client = nats.connect("ticketing", clientId, {
  url: "http://localhost:4222",
});

// Wait for NATS client connection
client.on("connect", () => {
  // Setup service close listener
  client.on("close", () => {
    console.log(`- Listener '${clientId}' disconnected from NATS`);
    process.exit();
  });

  console.log(`- Listener '${clientId}' connected to NATS`);
  new TicketCreatedListener(client).listen();
});

// Setup SIGINT and SIGTERM onClose listeners
process.on("SIGINT", () => {
  client.close();
});
process.on("SIGTERM", () => {
  client.close();
});
