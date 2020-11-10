import { Stan } from "node-nats-streaming";
import { IEvent } from "./IEvent";

export abstract class Publisher<T extends IEvent> {
  abstract subject: T["subject"];
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T["data"]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}
