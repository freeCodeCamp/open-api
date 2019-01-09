/* global expect beforeAll afterAll */
import {
  createCommunityEvent,
  getCommunityEvent,
  getCommunityEvents,
  deleteCommunityEvent
} from './communityEvent';
import { createUser } from './user';
import CommunityEvent from '../model/communityEvent.js';
import { isObject, isEmpty } from 'lodash';
import mongoose from 'mongoose';
import uuid from 'uuid/v4';
import { isDate, isArray } from 'util';

const validContextForBrian = global.mockedContextWithValidTokenForBrian;
const validContextForDennis = global.mockedContextWithValidTokenForDennis;
const validContextForKen = global.mockedContextWithValidTokenForKen;

const event = {
  title: 'epoch',
  description: 'The start of POSIX time',
  date: 'Thu 1 Jan 1970 00:00:00'
};

const eventValidAttendees = {
  ...event,
  attendees: [
    { email: 'dennisritchie@example.com' },
    { email: 'kenthompson@example.com' }
  ]
};

const eventInValidAttendees = {
  ...event,
  attendees: [{ email: 'yeahnah@example.com' }]
};

beforeAll(async function beforeAllTests() {
  await mongoose.connect(global.__MONGO_URI__);
  // Create some users for our tests
  await createUser({}, {}, validContextForBrian);
  await createUser({}, {}, validContextForDennis);
  await createUser({}, {}, validContextForKen);

  // Create an event
  await createCommunityEvent({}, eventValidAttendees, validContextForBrian);
});

afterAll(async function afterAllTests() {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe('createCommunityEvent', () => {
  it('should return an Event object', done => {
    expect.assertions(7);
    createCommunityEvent({}, eventValidAttendees, validContextForBrian)
      .then(result => {
        const {
          externalId,
          title,
          description,
          owner,
          date,
          attendees
        } = result;
        // there is some weird Promise thing going on with `result`
        // which screws with lodash.has()

        // TODO: DRY this please
        const hasKeys =
          !isEmpty(externalId) &&
          !isEmpty(title) &&
          !isEmpty(description) &&
          !isEmpty(owner) &&
          isDate(date) &&
          isArray(attendees);

        const hasOwnerKeys = !isEmpty(owner.name) && !isEmpty(owner.email);
        const hasAttendeeKeys =
          !isEmpty(attendees[0].name) && !isEmpty(attendees[0].email);

        expect(isObject(result)).toBe(true);
        expect(isObject(result.owner)).toBe(true);
        expect(isObject(result.attendees[0])).toBe(true);
        expect(result.attendees).toHaveLength(2);
        expect(hasKeys).toBe(true);
        expect(hasOwnerKeys).toBe(true);
        expect(hasAttendeeKeys).toBe(true);
        return;
      })
      .then(done)
      .catch(done);
  });

  it('should throw if an attendee does yet exist', done => {
    expect.assertions(2);
    createCommunityEvent({}, eventInValidAttendees, validContextForBrian).catch(
      err => {
        expect(err).toMatchSnapshot();
        expect(err).toContain('Unable to find attendee');
        done();
        return;
      }
    );
  });

  it('should throw if an imageUrl is not a valid URL', done => {
    expect.assertions();
    createCommunityEvent(
      {},
      {
        ...event,
        imageUrl: 'notaUrl'
      },
      validContextForBrian
    ).catch(err => {
      expect(err).toMatchSnapshot();
      expect(err).toContain('Expected valid URL string');
      done();
      return;
    });
  });

  it('should throw if an isLocked is not a Boolean', done => {
    expect.assertions(2);
    createCommunityEvent(
      {},
      {
        ...event,
        isLocked: 'notaBoolean'
      },
      validContextForBrian
    ).catch(err => {
      expect(err).toMatchSnapshot();
      expect(err).toContain('Expected a Boolean value');
      done();
      return;
    });
  });
});

describe('getCommunityEvent', () => {
  it('should return an Event object for a valid request', done => {
    expect.assertions(7);
    getCommunityEvent({}, { title: 'epoch' }, validContextForBrian)
      .then(result => {
        const {
          externalId,
          title,
          description,
          owner,
          date,
          attendees
        } = result;
        // there is some weird Promise thing going on with `result`
        // which screws with lodash.has()
        const hasKeys =
          !isEmpty(externalId) &&
          !isEmpty(title) &&
          !isEmpty(description) &&
          !isEmpty(owner) &&
          isDate(date) &&
          isArray(attendees);

        const hasOwnerKeys = !isEmpty(owner.name) && !isEmpty(owner.email);
        const hasAttendeeKeys =
          !isEmpty(attendees[0].name) && !isEmpty(attendees[0].email);

        expect(isObject(result)).toBe(true);
        expect(isObject(owner)).toBe(true);
        expect(isObject(attendees[0])).toBe(true);
        expect(attendees).toHaveLength(2);
        expect(hasKeys).toBe(true);
        expect(hasOwnerKeys).toBe(true);
        expect(hasAttendeeKeys).toBe(true);
        return;
      })
      .then(done)
      .catch(done);
  });

  it('title search non existing event should return null', done => {
    expect.assertions(1);
    getCommunityEvent({}, { title: 'Yeah nah' }, validContextForBrian).then(
      data => {
        expect(data).toBe(null);
        done();
      }
    );
  });

  it('externalId search for non existing event should return null', done => {
    expect.assertions(1);
    getCommunityEvent({}, { externalId: uuid() }, validContextForBrian).then(
      data => {
        expect(data).toBe(null);
        done();
      }
    );
  });

  // function validateError(err) {
  //   expect(err).toBeInstanceOf(TypeError);
  //   expect(err.message).toContain('Expected a valid externalId or title');
  // }

  function getCommunityEventPromiseForTestCase(testCase) {
    return getCommunityEvent(
      {},
      { externalId: testCase },
      validContextForBrian
    ).catch(err => {
      expect(err).toBeInstanceOf(TypeError);
      expect(err.message).toContain('Expected a valid externalId or title');
    });
  }

  // TODO: DRY please
  it('should throw if the externalId is not valid', done => {
    expect.assertions(8);
    Promise.all([
      getCommunityEventPromiseForTestCase(1),
      getCommunityEventPromiseForTestCase('abc'),
      getCommunityEventPromiseForTestCase(['yeah nah']),
      getCommunityEventPromiseForTestCase(false)
    ]).then(() => {
      done();
    });
  });

  it('should throw if the title is not valid', done => {
    expect.assertions(6);
    Promise.all([
      getCommunityEvent({}, { title: 1 }, validContextForBrian).catch(err => {
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toContain('Expected a valid externalId or title');
      }),
      getCommunityEvent(
        {},
        { title: ['yeah nah'] },
        validContextForBrian
      ).catch(err => {
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toContain('Expected a valid externalId or title');
      }),
      getCommunityEvent({}, { title: false }, validContextForBrian).catch(
        err => {
          expect(err).toBeInstanceOf(TypeError);
          expect(err.message).toContain('Expected a valid externalId or title');
        }
      )
    ]).then(() => {
      done();
    });
  });
});

describe('getCommunityEvents', () => {
  it('should return multiple Event objects for a valid request', done => {
    expect.assertions(8);
    getCommunityEvents({}, { title: 'epoch' }, validContextForBrian)
      .then(result => {
        const {
          externalId,
          title,
          description,
          owner,
          date,
          attendees
        } = result[0];

        // there is some weird Promise thing going on with `result`
        // which screws with lodash.has()
        const hasKeys =
          !isEmpty(externalId) &&
          !isEmpty(title) &&
          !isEmpty(description) &&
          !isEmpty(owner) &&
          isDate(date) &&
          isArray(attendees);

        const hasOwnerKeys = !isEmpty(owner.name) && !isEmpty(owner.email);
        const hasAttendeeKeys =
          !isEmpty(attendees[0].name) && !isEmpty(attendees[0].email);

        // TODO: 2 depend on other tests to create events for us,
        // this is a bit brittle..
        expect(result).toHaveLength(3);
        expect(isObject(result)).toBe(true);
        expect(isObject(owner)).toBe(true);
        expect(isObject(attendees[0])).toBe(true);
        expect(attendees).toHaveLength(2);
        expect(hasKeys).toBe(true);
        expect(hasOwnerKeys).toBe(true);
        expect(hasAttendeeKeys).toBe(true);
        return;
      })
      .then(done)
      .catch(done);
  });

  it('title search non existing event should return null', done => {
    expect.assertions(1);
    getCommunityEvents({}, { title: 'Yeah nah' }, validContextForBrian).then(
      data => {
        expect(data).toBe(null);
        done();
      }
    );
  });

  it('externalId search for non existing event should return null', done => {
    expect.assertions(1);
    getCommunityEvents({}, { externalId: uuid() }, validContextForBrian).then(
      data => {
        expect(data).toBe(null);
        done();
      }
    );
  });

  // TODO: DRY please
  it('should throw if the externalId is not valid', done => {
    expect.assertions(8);
    Promise.all([
      getCommunityEvents({}, { externalId: 1 }, validContextForBrian).catch(
        err => {
          expect(err).toBeInstanceOf(TypeError);
          expect(err.message).toContain('Expected a valid externalId or title');
        }
      ),
      getCommunityEvents({}, { externalId: 'abc' }, validContextForBrian).catch(
        err => {
          expect(err).toBeInstanceOf(TypeError);
          expect(err.message).toContain('Expected a valid externalId or title');
        }
      ),
      getCommunityEvents(
        {},
        { externalId: ['yeah nah'] },
        validContextForBrian
      ).catch(err => {
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toContain('Expected a valid externalId or title');
      }),
      getCommunityEvents({}, { externalId: false }, validContextForBrian).catch(
        err => {
          expect(err).toBeInstanceOf(TypeError);
          expect(err.message).toContain('Expected a valid externalId or title');
        }
      )
    ]).then(() => {
      done();
    });
  });

  it('should throw if the title is not valid', done => {
    expect.assertions(6);
    Promise.all([
      getCommunityEvents({}, { title: 1 }, validContextForBrian).catch(err => {
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toContain('Expected a valid externalId or title');
      }),
      getCommunityEvents(
        {},
        { title: ['yeah nah'] },
        validContextForBrian
      ).catch(err => {
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toContain('Expected a valid externalId or title');
      }),
      getCommunityEvents({}, { title: false }, validContextForBrian).catch(
        err => {
          expect(err).toBeInstanceOf(TypeError);
          expect(err.message).toContain('Expected a valid externalId or title');
        }
      )
    ]).then(() => {
      done();
    });
  });
});

describe('deleteCommunityEvent', () => {
  it('should delete an existing event', async done => {
    const event = {
      title: 'deleteCommunityEvent event',
      description: 'A boring test event',
      date: 'Thu 1 Jan 1970 00:00:00'
    };

    const createdEvent = await createCommunityEvent(
      {},
      event,
      validContextForBrian
    );
    const deletedEvent = await deleteCommunityEvent(
      {},
      { externalId: createdEvent.externalId },
      validContextForBrian
    );

    expect(createdEvent.externalId).toMatch(deletedEvent.externalId);

    const foundEvent = await CommunityEvent.findOne({
      externalId: deletedEvent.externalId
    }).exec();
    expect(foundEvent).toBe(null);
    done();
  });

  it('should return with an error for a non existing event', async done => {
    try {
      await deleteCommunityEvent(
        {},
        { externalId: uuid() },
        validContextForBrian
      );
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toContain('Event not found');
      expect(err).toMatchSnapshot();
    }
    done();
  });

  it('should refuse deletion of events owned by other users', async done => {
    const e = await CommunityEvent.findOne({ title: 'epoch' }).exec();
    try {
      await deleteCommunityEvent(
        {},
        { externalId: e.externalId },
        validContextForKen
      );
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toContain('Only allowed to delete events you own');
      expect(err).toMatchSnapshot();
    }
    done();
  });
});
