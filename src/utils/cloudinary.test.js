import { test, mock } from 'node:test';
import assert from 'node:assert';
import { uploadToCloudinary } from './cloudinary.js';

test('uploadToCloudinary success', async (t) => {
    // Mock fetch
    const mockFetch = mock.fn(async () => {
        return {
            ok: true,
            json: async () => ({ secure_url: 'http://example.com/image.jpg' })
        };
    });
    global.fetch = mockFetch;

    // Mock FormData
    global.FormData = class FormData {
        append() {}
    };

    const url = await uploadToCloudinary('somefile');
    assert.strictEqual(url, 'http://example.com/image.jpg');
});

test('uploadToCloudinary failure', async (t) => {
     // Mock fetch
    const mockFetch = mock.fn(async () => {
        return {
            ok: false,
            json: async () => ({ error: { message: 'Failed' } })
        };
    });
    global.fetch = mockFetch;

    // Mock FormData
    global.FormData = class FormData {
        append() {}
    };

    await assert.rejects(uploadToCloudinary('somefile'), /Failed/);
});
