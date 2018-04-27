/* global expect beforeEach */
import sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import { createDirectives } from './directives';

sinonStubPromise(sinon);
let authTrueSpy;
let authFalseSpy;
let errorSpy;
let nextStub;

beforeEach(() => {
  authTrueSpy = sinon.stub().returns(true);
  authFalseSpy = sinon.stub().returns(false);
  errorSpy = sinon.stub();
  nextStub = sinon.stub().returnsPromise();
});

describe('isAuthenticatedOnField', () => {
  it('should return null if authenication fails', () => {
    const { isAuthenticatedOnField } = createDirectives(authFalseSpy);
    const secretValue = 'secret squirrel';
    nextStub.resolves(secretValue);
    const result = isAuthenticatedOnField(nextStub);

    expect(result.resolved).toBe(true);
    expect(result.resolveValue).toBe(null);
  });
});
