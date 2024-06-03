const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const dbHelper = require('../../util/dbHelper');
const Authenticator = require('../../handler/authenticator');

jest.mock('jsonwebtoken');
jest.mock('axios');
jest.mock('../../util/dbHelper');

describe('Authenticator', () => {
  const mockRequest = (options = {}) => ({
    header: jest.fn().mockReturnValue(`Bearer ${options.token || 'sometoken'}`)
  });

  const mockResponse = () => {
    const res = {};
    res.send = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = jest.fn();

  describe('basicAuth', () => {
    it('should verify the token and call next on success', () => {
      const req = mockRequest();
      const res = mockResponse();
      jwt.verify.mockImplementation(() => ({ id: '123' }));

      Authenticator.basicAuth(req, res, mockNext);

      expect(jwt.verify).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle exceptions and return 400 if token verification fails', () => {
      const req = mockRequest();
      const res = mockResponse();
      jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });

      Authenticator.basicAuth(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Invalid Token');
    });
  });

  describe('getUserInfo', () => {
    it('should decode token and set email in request object', () => {
      const req = mockRequest();
      const res = mockResponse();
      jwt.decode.mockReturnValue({ email: 'test@example.com' });

      Authenticator.getUserInfo(req, res, mockNext);

      expect(jwt.decode).toHaveBeenCalled();
      expect(req.email).toEqual('test@example.com');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 400 if email in token is invalid', () => {
      const req = mockRequest();
      const res = mockResponse();
      jwt.decode.mockReturnValue({ email: 'not-an-email' });

      Authenticator.getUserInfo(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Invalid Email');
    });
  });

  describe('getInfoFromAuthService', () => {
    it('should handle axios success and database success', async () => {
      const req = mockRequest();
      const res = mockResponse();
      axios.get.mockResolvedValue({ data: { account: 'testAccount' } });
      dbHelper.findUserByAccount.mockResolvedValue({ email: 'test@example.com' });

      await Authenticator.getInfoFromAuthService(req, res, mockNext);

      expect(axios.get).toHaveBeenCalled();
      expect(dbHelper.findUserByAccount).toHaveBeenCalledWith('testAccount');
      expect(req.email).toEqual('test@example.com');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle axios or database errors', async () => {
      const req = mockRequest();
      const res = mockResponse();
      axios.get.mockRejectedValue(new Error('Axios error'));

      await Authenticator.getInfoFromAuthService(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Invalid Token');
    });
  });
});
