import { BinaryReader, BinaryWriter } from '@octane/utils';
import { describe, expect, it } from 'vitest';
import { WiredUnitOpacityParser } from './WiredUnitOpacityParser';

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

describe('WiredUnitOpacityParser', () =>
{
    it('parses avatar opacities and clamps them to 0-100', () =>
    {
        const writer = new BinaryWriter();
        writer.writeInt(1); writer.writeInt(77); writer.writeInt(2);
        writer.writeInt(5); writer.writeInt(40);
        writer.writeInt(9); writer.writeInt(250);
        const parser = new WiredUnitOpacityParser();

        expect(parser.parse(wrapper(writer))).toBe(true);
        expect(parser.roomId).toBe(77);
        expect(parser.updates).toEqual([ { unitId: 5, opacity: 40 }, { unitId: 9, opacity: 100 } ]);
    });

    it('accepts an empty snapshot', () =>
    {
        const writer = new BinaryWriter();
        writer.writeInt(1); writer.writeInt(77); writer.writeInt(0);
        const parser = new WiredUnitOpacityParser();

        expect(parser.parse(wrapper(writer))).toBe(true);
        expect(parser.updates).toEqual([]);
    });

    it('rejects unsupported protocol versions', () =>
    {
        const writer = new BinaryWriter();
        writer.writeInt(2); writer.writeInt(77); writer.writeInt(0);
        expect(new WiredUnitOpacityParser().parse(wrapper(writer))).toBe(false);
    });

    it('rejects oversized counts and invalid unit ids', () =>
    {
        const oversized = new BinaryWriter();
        oversized.writeInt(1); oversized.writeInt(77); oversized.writeInt(2001);
        expect(new WiredUnitOpacityParser().parse(wrapper(oversized))).toBe(false);

        const invalid = new BinaryWriter();
        invalid.writeInt(1); invalid.writeInt(77); invalid.writeInt(1); invalid.writeInt(0); invalid.writeInt(50);
        expect(new WiredUnitOpacityParser().parse(wrapper(invalid))).toBe(false);
    });

    it('rejects a truncated row without exposing partial updates', () =>
    {
        const writer = new BinaryWriter();
        writer.writeInt(1); writer.writeInt(77); writer.writeInt(1); writer.writeInt(5);
        const parser = new WiredUnitOpacityParser();

        expect(parser.parse(wrapper(writer))).toBe(false);
        expect(parser.updates).toEqual([]);
    });
});
