/* global expect beforeEach */
import sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import { createDirectives } from './directives';

sinonStubPromise(sinon);
const testErrorMsg = 'Test error message';
let nextSpy = sinon.spy();
let nextPromiseStub = sinon.stub().returnsPromise();
let authTrueStub = sinon.stub().returns({ isAuth: true });
let authFalseStub = sinon
  .stub()
  .returns({ isAuth: false, error: { message: testErrorMsg } });

beforeEach(() => {
  authFalseStub.resetHistory();
  authTrueStub.resetHistory();
  nextSpy.resetHistory();
  nextPromiseStub.resetHistory();
});

describe('isAuthenticatedOnField', () => {
  it('should return null if authenication fails', () => {
    const { isAuthenticatedOnField } = createDirectives(authFalseStub);
    const secretValue = 'secret squirrel';
    nextPromiseStub.resolves(secretValue);
    const result = isAuthenticatedOnField(nextPromiseStub);

    expect(authFalseStub.calledOnce).toBe(true);
    expect(result.resolved).toBe(true);
    expect(result.resolveValue).toBe(null);
  });

  it('should return the secretValue if authentication succeeds', () => {
    const { isAuthenticatedOnField } = createDirectives(authTrueStub);
    const secretValue = 'secret squirrel';
    nextPromiseStub.resolves(secretValue);
    const result = isAuthenticatedOnField(nextPromiseStub);

    expect(authTrueStub.calledOnce).toBe(true);
    expect(result.resolved).toBe(true);
    expect(result.resolveValue).toBe(secretValue);
  });
});

describe('isAuthenticatedOnQuery', () => {
  it('should throw an error is auth fails', () => {
    const { isAuthenticatedOnQuery } = createDirectives(authFalseStub);

    expect(() => {
      isAuthenticatedOnQuery(nextSpy);
    }).toThrowError(testErrorMsg);
    expect(nextSpy.called).toBe(false);
  });

  it('should call next if auth succeeds', () => {
    const { isAuthenticatedOnQuery } = createDirectives(authTrueStub);
    isAuthenticatedOnQuery(nextPromiseStub);

    expect(nextPromiseStub.calledOnce).toBe(true);
  });
});
