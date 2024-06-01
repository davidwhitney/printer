import Printer, { Image, BitmapDensity, PrinterOptions, PrinterModel, CustomTableOptions, CustomTableItem, FeedControlSequence, Alignment, FontFamily, StyleString, BarcodeOptions, BarcodeType, HardwareCommand, QrImageOptions, QRLevel, RasterMode } from "@node-escpos/core";
import { MutableBuffer } from "mutable-buffer";
import { EpsonLX350CompatiblePrinter, IEpsonLX350CompatiblePrinter } from "./EpsonLX350CompatiblePrinter";

export default class DebuggingPrinter extends EpsonLX350CompatiblePrinter implements IEpsonLX350CompatiblePrinter {
    constructor() {
        super({} as any);
    }

    public outputLines: string[] = [];

    adapter;
    buffer: MutableBuffer = new MutableBuffer();
    options: PrinterOptions | undefined;
    encoding: string;
    width: number;
    _model: PrinterModel;

    model(model: PrinterModel): this {
        return this;
    }
    setCharacterCodeTable(codeTable: number): this {
        return this;
    }
    setCharset(charset?: number): this {
        return this;
    }
    marginBottom(size: number): this {
        return this;
    }
    marginLeft(size: number): this {
        return this;
    }
    setMarginLeft(size: number): Printer<[]> {
        return this;
    }
    marginRight(size: number): this {
        return this;
    }
    print(content: string | Buffer): this {
        return this;
    }
    println(content: string): this {
        console.log("🖨️   DebuggingPrinter: ", content);
        this.outputLines.push(content);
        return this;
    }
    newLine(count?: number): this {
        return this;
    }
    text(content: string, encoding?: string): this {
        console.log("🖨️   DebuggingPrinter: ", content);
        this.outputLines.push(content);
        return this;
    }
    drawLine(character?: Buffer | string): this {
        console.log("🖨️   DebuggingPrinter: --------------------");
        this.outputLines.push("--------------------");
        return this;
    }
    table(data: (string | number)[], encoding?: string): this {
        return this;
    }
    tableCustom(data: CustomTableItem[], options?: CustomTableOptions): this {
        return this;
    }
    pureText(content: string, encoding?: string): this {
        console.log("🖨️   DebuggingPrinter: ", content);
        this.outputLines.push(content);
        return this;
    }
    encode(encoding: string): this {
        return this;
    }
    feed(n?: number): this {
        return this;
    }
    control(ctrl: FeedControlSequence): this {
        return this;
    }
    align(align: Alignment): this {
        return this;
    }
    font(family: FontFamily): this {
        return this;
    }
    _getStyle(string: StyleString): string;
    _getStyle(bold: boolean, italic: boolean, underline: boolean | 0 | 1 | 2): string;
    _getStyle(bold: unknown, italic?: unknown, underline?: unknown): string {
        return "";
    }
    style(string: StyleString): this;
    style(bold: boolean, italic: boolean, underline: boolean | 0 | 1 | 2): this;
    style(bold: unknown, italic?: unknown, underline?: unknown): this {
        return this;
    }
    size(width: number, height: number): this {
        return this;
    }
    spacing(n?: number | null): this {
        return this;
    }
    lineSpace(n?: number | null): this {
        return this;
    }
    hardware(hw: HardwareCommand): this {
        return this;
    }
    barcode(code: number | string, type: BarcodeType, options: BarcodeOptions): this {
        return this;
    }
    qrcode(content: string, version?: number | undefined, level?: QRLevel | undefined, size?: number | undefined): this {
        return this;
    }
    qrimage(text: string, options?: QrImageOptions): Promise<this> {
        return Promise.resolve(this);
    }
    image(image: Image, density?: BitmapDensity): Promise<this> {
        this.outputLines.push(`[image]${image.size.width}x${image.size.height}`);
        return Promise.resolve(this);
    }
    raster(image: Image, mode?: RasterMode): this {
        return this;
    }
    cashdraw(pin?: 2 | 5): this {
        return this;
    }
    beep(n: number, t: number): this {
        return this;
    }
    flush(): Promise<this> {
        this.buffer.flush();
        return Promise.resolve(this);
    }
    cut(partial?: boolean, feed?: number): this {
        return this;
    }
    close(): Promise<this> {
        return Promise.resolve(this);
    }
    color(color: 0 | 1): this {
        return this;
    }
    setReverseColors(reverse: boolean): this {
        return this;
    }
    raw(data: Buffer | string): this {
        return this;
    }
    getStatus(StatusClass: any): Promise<any> {
        return Promise.resolve({});
    }
    getStatuses(): Promise<any[]> {
        return Promise.resolve([]);
    }
    setTopLogoPrinting(kc1: number, kc2: number, align?: Alignment, space?: number): Printer<[]> {
        return this;
    }
    setBottomLogoPrinting(kc1: number, kc2: number, align?: Alignment): Printer<[]> {
        return this;
    }
    enableTopLogoPrinting(enable?: boolean): Printer<[]> {
        return this;
    }
    enableBottomLogoPrinting(enable?: boolean): Printer<[]> {
        return this;
    }
    starFullCut(): this {
        return this;
    }
    emphasize(): this {
        return this;
    }
    cancelEmphasize(): this {
        return this;
    }
    eventNames(): (string | symbol)[] {
        return [];
    }
    listeners<T extends string | symbol>(event: T): ((...args: any[]) => void)[] {
        return [];
    }
    listenerCount(event: string | symbol): number {
        return 0;
    }
    emit<T extends string | symbol>(event: T, ...args: any[]): boolean {
        return false;
    }
    on<T extends string | symbol>(event: T, fn: (...args: any[]) => void, context?: any): this {
        return this;
    }
    addListener<T extends string | symbol>(event: T, fn: (...args: any[]) => void, context?: any): this {
        return this;
    }
    once<T extends string | symbol>(event: T, fn: (...args: any[]) => void, context?: any): this {
        return this;
    }
    removeListener<T extends string | symbol>(event: T, fn?: ((...args: any[]) => void) | undefined, context?: any, once?: boolean): this {
        return this;
    }
    off<T extends string | symbol>(event: T, fn?: ((...args: any[]) => void) | undefined, context?: any, once?: boolean): this {
        return this;
    }
    removeAllListeners(event?: string | symbol | undefined): this {
        return this;
    }
}