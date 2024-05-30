import { Toot } from "../types";

export default class InMemoryPrintQueue {
    private queue: (string | Toot)[] = [];

    constructor() {
        this.queue = [];
    }

    public push(item: string | Toot) {
        this.queue.push(item);
    }

    public async processQueue(tryProcessSingleMessage: (filetype: string, contents: string) => Promise<void>) {
        while (this.queue.length > 0) {
            const item = this.queue.shift();
            const filetype = typeof item === "string" ? "txt" : "json";
            const content = typeof item === "string" ? item : JSON.stringify(item);

            try {
                await tryProcessSingleMessage(filetype, content);
            } catch (e) {
                console.error(`Error processing message: `, e);
            }
        }

        setTimeout(() => {
            this.processQueue(tryProcessSingleMessage);
        }, 5000);
    }
}
