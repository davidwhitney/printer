import { EpsonLX350CompatiblePrinter } from "./EpsonLX350CompatiblePrinter"
import sharp from 'sharp';
import fetch from 'node-fetch'
import { convert } from "html-to-text";
import { convert_options, styles } from "./configuration";
import { splitLines } from "../util";
import { Image } from "@node-escpos/core";

export default async function printToot(printer: EpsonLX350CompatiblePrinter, contents: string) {
    var toot = JSON.parse(contents);

    console.log(toot.account.display_name, toot.account.acct)
    console.log(convert(toot.content, convert_options))

    console.log("\n\n🖨️ printing text portion");

    const convertedToot = convert(toot.content, convert_options);
    const asLines = splitLines(convertedToot, 83);

    printer.initialise()
    printer
        .lineSpace(48)
        .feed()
        .pureText(styles.dw)
        .pureText(styles.dh)
        .pureText(styles.bold)
        .pureText(toot.account.display_name)
        .pureText(styles.bold_cancel)
        .pureText(styles.dw_cancel)
        .pureText(styles.dh_cancel)
        .pureText(styles.italic)
        .text(toot.account.acct)
        .pureText(styles.italic_cancel)
        .lineSpace()
        .drawLine()
        .pureText(styles.proportional)
        .text(asLines)
        .feed()
        .flush()

    console.log("Media Attachments: " + toot.media_attachments.length)

    var attachment = 0;
    if (toot.media_attachments.length >= 1) {
        toot.media_attachments.forEach(async (item) => {
            attachment++
            console.log("\nNew Attachment " + attachment + ": " + item.type)
            //console.log(item.preview_url)
            //console.log(item.description)

            if (item.preview_url.length > 0) {
                console.log("Got Preview URL for att " + attachment)
                const img_fetched = await fetch(item.preview_url)
                const img_buffered = await img_fetched.arrayBuffer()

                const img_converted = await sharp(img_buffered)
                    .resize(150)
                    .toFormat("png")
                    .toFile("tmp/image.png")

                const image = await Image.load("tmp/image.png");
                console.log("Image loaded for att " + attachment + ", size:", image.size);

                console.log("attempting to print image for att " + attachment)
                await printer.imageWithLineSpacing(image, "s8");
                printer.flush()
            }
            else
                printer.pureText("Attachment " + attachment + ": " + item.type + " ")

            console.log("checking description for att " + attachment + " exists: " + item.description)
            if (item.description != null) {
                console.log("printing description for attachment " + attachment + ".")
                printer.initialise()
                printer
                    .pureText(styles.very_condensed)
                    .text(item.description)
                    .pureText(styles.condensed_cancel)
                    .flush()
            }
            printer.initialise()

            console.log("finished processing attachment " + attachment)
        })
    }

    if (toot.poll == true)
        printer.text("Toot contains a poll.")

    printer.text(toot.created_at).feed()
    await printer.flush();
}
