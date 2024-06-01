import { Entity } from "megalodon";

export default class InMemoryPrintQueue {
    private queue: (string | Entity.Status)[] = [];

    constructor() {
        this.queue = [];
    }

    public push(item: string | Entity.Status) {
        this.queue.push(item);
    }

    public async processQueueAsync(processMessageCallback: (filetype: string, contents: string) => Promise<void>) {
        while (this.queue.length > 0) {
            const item = this.queue.shift();
            const filetype = typeof item === "string" ? "txt" : "json";
            const content = typeof item === "string" ? item : JSON.stringify(item);

            try {
                // This await is *very* important to make sure we don't
                // run concurrent print jobs on the physical hardware

                await processMessageCallback(filetype, content);
            } catch (e) {
                console.error(`Error processing message: `, e);
            }
        }

        setTimeout(() => {
            this.processQueueAsync(processMessageCallback);
        }, 5000);
    }
}
