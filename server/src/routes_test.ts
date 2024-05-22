import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { load, save, names, resetTranscriptsForTesting } from './routes';

describe('routes', function () {
  afterEach(() => resetTranscriptsForTesting());

  // dummy gone
  describe('save', function () {
    it('should return an error if the name is missing', function () {
      const req = httpMocks.createRequest({ method: 'POST', url: '/save', body: { value: "test string" } });
      const res = httpMocks.createResponse();
      save(req, res);
      assert.strictEqual(res._getStatusCode(), 400);
      assert.deepStrictEqual(res._getData(), 'required argument "name" was missing');
    });

    it('should return an error if the value is missing', function () {
      const req = httpMocks.createRequest({ method: 'POST', url: '/save', body: { name: "A" } });
      const res = httpMocks.createResponse();
      save(req, res);
      assert.strictEqual(res._getStatusCode(), 400);
      assert.deepStrictEqual(res._getData(), 'required argument "value" was missing');
    });

    it('should save a new transcript and indicate it was not replaced', function () {
      const req = httpMocks.createRequest({ method: 'POST', url: '/save', body: { name: "A", value: "test string" } });
      const res = httpMocks.createResponse();
      save(req, res);
      assert.strictEqual(res._getStatusCode(), 200);
      assert.deepStrictEqual(res._getData(), { replaced: false });
    });

    it('should update an existing transcript and indicate it was replaced', function () {
      const req1 = httpMocks.createRequest({ method: 'POST', url: '/save', body: { name: "A", value: "test string" } });
      const res1 = httpMocks.createResponse();
      save(req1, res1);
      assert.strictEqual(res1._getStatusCode(), 200);
      assert.deepStrictEqual(res1._getData(), { replaced: false });

      const req2 = httpMocks.createRequest({ method: 'POST', url: '/save', body: { name: "A", value: "another test string lol" } });
      const res2 = httpMocks.createResponse();
      save(req2, res2);
      assert.strictEqual(res2._getStatusCode(), 200);
      assert.deepStrictEqual(res2._getData(), { replaced: true });
    });
  });

  describe('load', function () {
    it('should load a saved transcript', function () {
      const saveReq = httpMocks.createRequest({ method: 'POST', url: '/save', body: { name: "hello", value: "world" } });
      const saveRes = httpMocks.createResponse();
      save(saveReq, saveRes);

      const loadReq = httpMocks.createRequest({ method: 'GET', url: '/load', query: { name: "hello" } });
      const loadRes = httpMocks.createResponse();
      load(loadReq, loadRes);
      assert.strictEqual(loadRes._getStatusCode(), 200);
      assert.deepStrictEqual(loadRes._getData(), { value: "world" });
    });

    it('should return an error if the name parameter is missing', function () {
      const req = httpMocks.createRequest({ method: 'GET', url: '/load', query: {} });
      const res = httpMocks.createResponse();
      load(req, res);
      assert.strictEqual(res._getStatusCode(), 400);
      assert.deepStrictEqual(res._getData(), 'missing the required argument "name".');
    });

    it('should return an error if the transcript does not exist', function () {
      const req = httpMocks.createRequest({ method: 'GET', url: '/load', query: { name: "chungus" } });
      const res = httpMocks.createResponse();
      load(req, res);
      assert.strictEqual(res._getStatusCode(), 400);
      assert.deepStrictEqual(res._getData(), 'missing the transcript "chungus".');
    });
  });

  describe('names', function () {
    it('should list all names in the transcript', function () {
      const req = httpMocks.createRequest({ method: 'GET', url: '/names' });
      const res = httpMocks.createResponse();
      names(req, res);
      assert.strictEqual(res._getStatusCode(), 200);
      assert.deepStrictEqual(res._getData(), { names: [] });
    });

    it('should list names after adding transcripts', function () {
      const saveReq = httpMocks.createRequest({ method: 'POST', url: '/save', body: { name: "hello", value: "world" } });
      const saveRes = httpMocks.createResponse();
      save(saveReq, saveRes);

      const namesReq = httpMocks.createRequest({ method: 'GET', url: '/names' });
      const namesRes = httpMocks.createResponse();
      names(namesReq, namesRes);
      assert.strictEqual(namesRes._getStatusCode(), 200);
      assert.deepStrictEqual(namesRes._getData(), { names: ["hello"] });
    });
  });
});
