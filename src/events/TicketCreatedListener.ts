import { Message } from "node-nats-streaming";
import { Listener } from "./Listener";
import { Subjects } from "./Subjects";
import { ITicketCreatedEvent } from "./ITicketCreatedEvent";

export class TicketCreatedListener extends Listener<ITicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName: string = "payments-service";

  onMessage(data: ITicketCreatedEvent["data"], msg: Message): void {
    console.log("Event data:", data);
    // Acknowledge the message (this is required when setManualAckMode is set
    // to true)
    msg.ack();
  }
}
