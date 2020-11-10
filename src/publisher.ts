// Imports
import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/TicketCreatedPublisher";

// Clear the console
console.clear();

// Connect to the nats client (documentation refers to this as 'stan'
// instead of 'client')
const client = nats.connect("ticketing", "publisher", {
  url: "http://localhost:4222",
});

// Wait for NATS client connection
client.on("connect", async () => {
  console.log("- Publisher connected to NATS");
  const publisher = new TicketCreatedPublisher(client);
  await publisher.publish({
    id: "1234",
    title: "Title",
    price: 20,
  });
});
