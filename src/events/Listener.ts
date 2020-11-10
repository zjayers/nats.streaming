import { Message, Stan } from "node-nats-streaming";
import { IEvent } from "./IEvent";

export abstract class Listener<T extends IEvent> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  protected ackWait: number = 5 * 1000;
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  abstract onMessage(data: T["data"], msg: Message): void;

  // Setup subscription options
  // -- -- -- -- -- -- -- -- -- --
  // 1) Set Manual Acknowledge Mode
  // Modify the default behaviour of dropping events after processing them
  // If an event fails, or is not processed correctly, the event will be
  // re-processed. This is done by setting ManualAckMode to true.
  // ManualAckMode requires manual processing of the event.
  // If the event is not acknowledged manually, NATS will wait for a
  // timeout, after timeout, NATS will send the event over to another
  // service in the queue group, or to the same service if the service is
  // not in a queue group.
  // -- -- -- -- -- -- -- -- -- --
  // 2) Setup re-delivery of missed events
  // Set deliver all available sends all missed events to listeners once
  // they are capable of accepting events
  // -- -- -- -- -- -- -- -- -- --
  // 3) Set Durable name of subscription
  // Nats will create a record of all subscriptions and keep a record of the
  // subscriptions that have successfully processed events. This keeps

  // subscriptions from re-processing already processed events.
  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  // Subscribe to events from the NATS client and setup connection to
  // Queue Group
  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    // Subscribe to the 'message' event from NATS
    subscription.on("message", (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const messageData = msg.getData();
    return typeof messageData === "string"
      ? JSON.parse(messageData)
      : JSON.parse(messageData.toString("utf8"));
  }
}
