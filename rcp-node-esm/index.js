import { CancellablePromise } from "real-cancellable-promise";

console.log("Delaying for 3 seconds...");

CancellablePromise.delay(3000).then(() => console.log("Done."));
