import USB from "@node-escpos/usb-adapter";

// Promisify because callbacks are ugly.

export async function openUsbDevice(): Promise<USB>  {
    const device = new USB();
    
    return await new Promise((resolve, reject) => {
        device.open((err) => {
            if (err) { 
                console.error("Error opening device:", err);
                reject(err); 
                return; 
            }

            console.log("Device opened successfully.");
            resolve(device);
        });
    });
}