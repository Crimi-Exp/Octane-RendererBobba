import { IConnectionStateSnapshot } from '@octane/api';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SocketConnection } from './SocketConnection';

type Internals = {
    _socket: { readyState: number, close: ReturnType<typeof vi.fn> };
    _reconnectTimer: ReturnType<typeof setTimeout>;
    _isAuthenticated: boolean;
    setConnectionState(patch: Partial<IConnectionStateSnapshot>): void;
    onSocketClosed(event: Partial<CloseEvent>): void;
};

afterEach(() => vi.useRealTimers());

describe('SocketConnection.serverDisconnected', () =>
{
    it('closes an open socket for good instead of reconnecting', () =>
    {
        const connection = new SocketConnection();
        const internals = connection as unknown as Internals;
        const close = vi.fn();

        internals._socket = { readyState: WebSocket.OPEN, close };
        internals._isAuthenticated = true;
        internals.setConnectionState({ phase: 'connected', authenticated: true });

        connection.serverDisconnected(1);

        expect(close).toHaveBeenCalledOnce();

        // The server drops the connection without a close frame.
        internals.onSocketClosed({ code: 1006, reason: '' });

        expect(connection.connectionState.phase).toBe('disconnected');
        expect(connection.connectionState.disconnectReason).toBe(1);
        expect(internals._reconnectTimer).toBeNull();
    });

    it('stops a reconnect that started before the reason was read', () =>
    {
        vi.useFakeTimers();

        const connection = new SocketConnection();
        const internals = connection as unknown as Internals;

        internals._socket = { readyState: WebSocket.CLOSED, close: vi.fn() };
        internals._isAuthenticated = true;
        internals.onSocketClosed({ code: 1006, reason: '' });

        expect(connection.connectionState.phase).toBe('reconnecting');

        connection.serverDisconnected(2);

        expect(connection.connectionState.phase).toBe('disconnected');
        expect(connection.connectionState.disconnectReason).toBe(2);
        expect(internals._reconnectTimer).toBeNull();
    });

    it('forgets the reason on a new connection', () =>
    {
        const connection = new SocketConnection();
        const internals = connection as unknown as Internals;

        internals.setConnectionState({ disconnectReason: 1 });
        connection.dispose();

        expect(connection.connectionState.disconnectReason).toBeUndefined();
    });
});
