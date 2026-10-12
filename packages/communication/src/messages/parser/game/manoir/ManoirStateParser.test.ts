import { BinaryReader, BinaryWriter } from '@octane/utils';
import { describe, expect, it } from 'vitest';
import { ManoirFinishParser } from './ManoirFinishParser';
import { ManoirStateParser } from './ManoirStateParser';

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

describe('ManoirStateParser', () =>
{
    it('parses players and ghosts of an active manor', () =>
    {
        const writer = new BinaryWriter();
        writer.writeByte(1);
        writer.writeInt(2);
        writer.writeInt(4); writer.writeByte(1); writer.writeByte(1); writer.writeInt(73); writer.writeInt(12345); writer.writeInt(2);
        writer.writeInt(9); writer.writeByte(0); writer.writeByte(0); writer.writeInt(100); writer.writeInt(0); writer.writeInt(0);
        writer.writeInt(1);
        writer.writeInt(31); writer.writeInt(7); writer.writeInt(12); writer.writeByte(1);
        const parser = new ManoirStateParser();
        parser.flush();

        expect(parser.parse(wrapper(writer))).toBe(true);
        expect(parser.active).toBe(true);
        expect(parser.players).toEqual([
            { unitId: 4, inRun: true, torchOn: true, battery: 73, elapsedMs: 12345, deaths: 2 },
            { unitId: 9, inRun: false, torchOn: false, battery: 100, elapsedMs: 0, deaths: 0 }
        ]);
        expect(parser.ghosts).toEqual([ { unitId: 31, x: 7, y: 12, chasing: true } ]);
    });

    it('stops after active = false', () =>
    {
        const writer = new BinaryWriter();
        writer.writeByte(0);
        const parser = new ManoirStateParser();
        parser.flush();

        expect(parser.parse(wrapper(writer))).toBe(true);
        expect(parser.active).toBe(false);
        expect(parser.players).toEqual([]);
        expect(parser.ghosts).toEqual([]);
    });

    it('clamps the battery to 0..100', () =>
    {
        const writer = new BinaryWriter();
        writer.writeByte(1);
        writer.writeInt(1);
        writer.writeInt(1); writer.writeByte(1); writer.writeByte(0); writer.writeInt(140); writer.writeInt(0); writer.writeInt(0);
        writer.writeInt(0);
        const parser = new ManoirStateParser();
        parser.flush();

        expect(parser.parse(wrapper(writer))).toBe(true);
        expect(parser.players[0].battery).toBe(100);
    });
});

describe('ManoirFinishParser', () =>
{
    it('parses the time, best, rank, badge and top list', () =>
    {
        const writer = new BinaryWriter();
        writer.writeInt(61234); writer.writeInt(59000); writer.writeInt(3); writer.writeByte(1);
        writer.writeInt(2);
        writer.writeString('Alice'); writer.writeInt(50000);
        writer.writeString('Bob'); writer.writeInt(55000);
        const parser = new ManoirFinishParser();
        parser.flush();

        expect(parser.parse(wrapper(writer))).toBe(true);
        expect(parser.timeMs).toBe(61234);
        expect(parser.bestMs).toBe(59000);
        expect(parser.rank).toBe(3);
        expect(parser.newBadge).toBe(true);
        expect(parser.top).toEqual([ { name: 'Alice', ms: 50000 }, { name: 'Bob', ms: 55000 } ]);
    });
});
