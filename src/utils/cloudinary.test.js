import { test, describe, before, after, mock } from 'node:test';
import assert from 'node:assert';
import { uploadToCloudinary } from './cloudinary.js';

describe('uploadToCloudinary', () => {
    const originalFetch = globalThis.fetch;

    before(() => {
        globalThis.fetch = mock.fn();
    });

    after(() => {
        globalThis.fetch = originalFetch;
    });

    test('should throw an error if no file is provided', async () => {
        await assert.rejects(
            uploadToCloudinary(null),
            { message: 'No file provided' }
        );
    });

    test('should return secure_url on successful upload', async () => {
        const mockUrl = 'https://res.cloudinary.com/demo/image/upload/v12345678/sample.jpg';
        globalThis.fetch.mock.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ secure_url: mockUrl }),
            })
        );

        const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
        const url = await uploadToCloudinary(file);

        assert.strictEqual(url, mockUrl);

        // Verify fetch was called with correct arguments
        const call = globalThis.fetch.mock.calls[0];
        assert.strictEqual(call.arguments[0], 'https://api.cloudinary.com/v1_1/dbxktcwug/image/upload');
        assert.strictEqual(call.arguments[1].method, 'POST');
        assert.ok(call.arguments[1].body instanceof FormData);
    });

    test('should throw error if response is not ok', async () => {
        const errorMessage = 'Invalid API Key';
        globalThis.fetch.mock.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ error: { message: errorMessage } }),
            })
        );

        const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
        await assert.rejects(
            uploadToCloudinary(file),
            (err) => {
                assert.strictEqual(err.message, errorMessage);
                return true;
            }
        );
    });

    test('should throw default error if response is not ok and no message provided', async () => {
        globalThis.fetch.mock.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ error: {} }),
            })
        );

        const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
        await assert.rejects(
            uploadToCloudinary(file),
            (err) => {
                assert.strictEqual(err.message, 'Upload failed');
                return true;
            }
        );
    });

    test('should throw network error', async () => {
        globalThis.fetch.mock.mockImplementationOnce(() =>
            Promise.reject(new Error('Network error'))
        );

        const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
        await assert.rejects(
            uploadToCloudinary(file),
            (err) => {
                assert.strictEqual(err.message, 'Network error');
                return true;
            }
        );
    });
});
