import { Publisher } from "./Publisher";
import { Subjects } from "./Subjects";
import { ITicketCreatedEvent } from "./ITicketCreatedEvent";

export class TicketCreatedPublisher extends Publisher<ITicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
