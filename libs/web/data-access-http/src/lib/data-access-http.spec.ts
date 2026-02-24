import { HttpError } from './data-access-http.js';

describe('HttpError', () => {
  it('keeps status + body', () => {
    const err = new HttpError({
      status: 404,
      message: 'Not Found',
      body: { code: 'NOT_FOUND', message: 'Not Found' },
    });
    expect(err.status).toBe(404);
    expect(err.body?.code).toBe('NOT_FOUND');
  });
});
