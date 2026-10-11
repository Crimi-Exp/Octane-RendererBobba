import { BinaryReader, BinaryWriter } from '@octane/utils';
import { describe, expect, it } from 'vitest';
import { WiredHighlightParser } from './WiredHighlightParser';

class TestWrapper
{
    constructor(private reader: BinaryReader)
    {}
    readByte()
    {
        return this.reader.readByte();
    }
    readBoolean()
    {
        return this.reader.readByte() === 1;
    }
    readShort()
    {
        return this.reader.readShort();
    }
    readInt()
    {
        return this.reader.readInt();
    }
    readString()
    {
        const length = this.reader.readShort(); return this.reader.readBytes(length).toString();
    }
    header = 0;
    get bytesAvailable()
    {
        return this.reader.remaining() > 0;
    }
    get remainingBytes()
    {
        return this.reader.remaining();
    }
}

const wrapper = (writer: BinaryWriter) => new TestWrapper(new BinaryReader(writer.getBuffer())) as any;

describe('WiredHighlightParser', () =>
{
    it('parses floor, wall and avatar highlights (unit 0 included)', () =>
    {
        const writer = new BinaryWriter();
        writer.writeInt(1); writer.writeInt(77); writer.writeInt(3);
        writer.writeInt(0); writer.writeInt(1234); writer.writeInt(0xFFFF33);
        writer.writeInt(1); writer.writeInt(55); writer.writeInt(-1);
        writer.writeInt(2); writer.writeInt(0); writer.writeInt(0x3388FF);
        const parser = new WiredHighlightParser();

        expect(parser.parse(wrapper(writer))).toBe(true);
        expect(parser.roomId).toBe(77);
        expect(parser.updates).toEqual([
            { kind: 0, id: 1234, color: 0xFFFF33 },
            { kind: 1, id: 55, color: -1 },
            { kind: 2, id: 0, color: 0x3388FF }
        ]);
    });

    it('keeps only the 24 colour bits and maps any negative colour to off', () =>
    {
        const writer = new BinaryWriter();
        writer.writeInt(1); writer.writeInt(77); writer.writeInt(2);
        writer.writeInt(0); writer.writeInt(1); writer.writeInt(0x7F00FF00);
        writer.writeInt(0); writer.writeInt(2); writer.writeInt(-50);
        const parser = new WiredHighlightParser();

        expect(parser.parse(wrapper(writer))).toBe(true);
        expect(parser.updates).toEqual([ { kind: 0, id: 1, color: 0x00FF00 }, { kind: 0, id: 2, color: -1 } ]);
    });

    it('accepts an empty snapshot', () =>
    {
        const writer = new BinaryWriter();
        writer.writeInt(1); writer.writeInt(77); writer.writeInt(0);
        const parser = new WiredHighlightParser();

        expect(parser.parse(wrapper(writer))).toBe(true);
        expect(parser.updates).toEqual([]);
    });

    it('rejects unsupported protocol versions', () =>
    {
        const writer = new BinaryWriter();
        writer.writeInt(2); writer.writeInt(77); writer.writeInt(0);
        expect(new WiredHighlightParser().parse(wrapper(writer))).toBe(false);
    });

    it('rejects oversized counts, unknown kinds and invalid ids', () =>
    {
        const oversized = new BinaryWriter();
        oversized.writeInt(1); oversized.writeInt(77); oversized.writeInt(2001);
        expect(new WiredHighlightParser().parse(wrapper(oversized))).toBe(false);

        const kind = new BinaryWriter();
        kind.writeInt(1); kind.writeInt(77); kind.writeInt(1); kind.writeInt(3); kind.writeInt(5); kind.writeInt(0);
        expect(new WiredHighlightParser().parse(wrapper(kind))).toBe(false);

        const id = new BinaryWriter();
        id.writeInt(1); id.writeInt(77); id.writeInt(1); id.writeInt(2); id.writeInt(-1); id.writeInt(0);
        expect(new WiredHighlightParser().parse(wrapper(id))).toBe(false);
    });

    it('rejects a truncated row without exposing partial updates', () =>
    {
        const writer = new BinaryWriter();
        writer.writeInt(1); writer.writeInt(77); writer.writeInt(1); writer.writeInt(0); writer.writeInt(5);
        const parser = new WiredHighlightParser();

        expect(parser.parse(wrapper(writer))).toBe(false);
        expect(parser.updates).toEqual([]);
    });
});
