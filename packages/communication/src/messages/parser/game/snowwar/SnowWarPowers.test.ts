import { IMessageDataWrapper } from '@octane/api';
import { describe, expect, it } from 'vitest';
import { SnowWarGameObjectData } from './SnowWarGameObjectData';
import { SnowWarSubturnEventData } from './SnowWarSubturnEventData';
import { SnowWarUserChatParser } from './SnowWarUserChatParser';

type Value = number | string | boolean;

const wrapperOf = (values: Value[]): IMessageDataWrapper =>
{
    let index = 0;
    const next = () => values[index++];

    return {
        readByte: () => next() as number,
        readBytes: () => null,
        readBoolean: () => next() as boolean,
        readShort: () => next() as number,
        readInt: () => next() as number,
        readFloat: () => next() as number,
        readDouble: () => next() as number,
        readString: () => next() as string,
        header: 0,
        get bytesAvailable()
        {
            return index < values.length;
        }
    };
};

describe('SnowWar BobbaTok powers', () =>
{
    it('reads freeze, ball power and powers events, then the next event', () =>
    {
        const wrapper = wrapperOf([ 28, 4, 60, 9, 29, 33, 3, 4, 30, 9, 1, 2, 0, 3, 7 ]);

        const freeze = new SnowWarSubturnEventData(wrapper);
        const ballPower = new SnowWarSubturnEventData(wrapper);
        const powers = new SnowWarSubturnEventData(wrapper);
        const create = new SnowWarSubturnEventData(wrapper);

        expect(freeze.values).toEqual([ 4, 60, 9 ]);
        expect(ballPower.values).toEqual([ 33, 3, 4 ]);
        expect(powers.values).toEqual([ 9, 1, 2, 0 ]);
        expect(create.eventType).toBe(SnowWarSubturnEventData.EVENT_TYPE_CREATE_SNOWBALL);
        expect(create.objectId).toBe(7);
    });

    it('reads the powers and ball power objects of the full status', () =>
    {
        const wrapper = wrapperOf([ 9, 4, 1, 2, 30, 10, 33, 2, 9 ]);

        const powers = new SnowWarGameObjectData(wrapper);
        const ballPower = new SnowWarGameObjectData(wrapper);

        expect(powers.objectId).toBe(4);
        expect(powers.values).toEqual([ 1, 2, 30 ]);
        expect(ballPower.objectId).toBe(33);
        expect(ballPower.values).toEqual([ 2, 9 ]);
    });

    it('reads the nickname ornaments object, then the next object', () =>
    {
        const wrapper = wrapperOf([ 11, 4, 'star', 'VIP', '#ff0000', '', 'glow', 'bold', 'icon-prefix-name', 9, 4, 0, 1, 0 ]);

        const identity = new SnowWarGameObjectData(wrapper);
        const powers = new SnowWarGameObjectData(wrapper);

        expect(identity.objectId).toBe(4);
        expect(identity.strings).toEqual([ 'star', 'VIP', '#ff0000', '', 'glow', 'bold', 'icon-prefix-name' ]);
        expect(powers.values).toEqual([ 0, 1, 0 ]);
    });

    it('reads the chat bubble style when the server sends it', () =>
    {
        const parser = new SnowWarUserChatParser();

        parser.flush();
        expect(parser.parse(wrapperOf([ 4, 'salut', 23 ]))).toBe(true);
        expect(parser.styleId).toBe(23);

        parser.flush();
        expect(parser.parse(wrapperOf([ 4, 'salut' ]))).toBe(true);
        expect(parser.styleId).toBe(0);
    });
});
