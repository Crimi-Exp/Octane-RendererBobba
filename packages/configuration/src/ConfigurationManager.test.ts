import { afterEach, describe, expect, it, vi } from 'vitest';
import { ConfigurationManager } from './ConfigurationManager';

const jsonResponse = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

const deferred = <T>() =>
{
    let resolve: (value: T) => void = null;
    const promise = new Promise<T>(r => (resolve = r));

    return { promise, resolve };
};

describe('ConfigurationManager.reloadConfiguration', () =>
{
    afterEach(() =>
    {
        vi.unstubAllGlobals();
        delete (window as any).OctaneConfig;
    });

    it('keeps the previous values until the new files are fetched and parsed', async () =>
    {
        (window as any).OctaneConfig = { 'config.urls': [ '/renderer-config.json' ] };

        const first = jsonResponse({ 'api.url': 'http://127.0.0.1:2096', 'login.endpoint': '${api.url}/api/auth/login' });
        const second = deferred<Response>();
        const fetchMock = vi.fn().mockReturnValueOnce(Promise.resolve(first)).mockReturnValueOnce(second.promise);

        vi.stubGlobal('fetch', fetchMock);

        const manager = new ConfigurationManager();

        await manager.init();

        expect(manager.getValue('login.endpoint', 'MISSING')).toBe('http://127.0.0.1:2096/api/auth/login');

        const reload = manager.reloadConfiguration();

        // Mid-reload: the old value must still be readable.
        expect(manager.getValue('login.endpoint', 'MISSING')).toBe('http://127.0.0.1:2096/api/auth/login');

        second.resolve(jsonResponse({ 'api.url': 'http://10.0.0.1:2096', 'login.endpoint': '${api.url}/api/auth/login' }));

        await reload;

        expect(manager.getValue('login.endpoint', 'MISSING')).toBe('http://10.0.0.1:2096/api/auth/login');
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('keeps the previous values when a reload fails', async () =>
    {
        (window as any).OctaneConfig = { 'config.urls': [ '/renderer-config.json' ] };

        const fetchMock = vi.fn()
            .mockReturnValueOnce(Promise.resolve(jsonResponse({ 'login.endpoint': 'http://127.0.0.1:2096/api/auth/login' })))
            .mockReturnValueOnce(Promise.resolve(jsonResponse({}, 500)));

        vi.stubGlobal('fetch', fetchMock);

        const manager = new ConfigurationManager();

        await manager.init();
        await expect(manager.reloadConfiguration()).rejects.toThrow(/HTTP 500/);

        expect(manager.getValue('login.endpoint', 'MISSING')).toBe('http://127.0.0.1:2096/api/auth/login');
    });
});
