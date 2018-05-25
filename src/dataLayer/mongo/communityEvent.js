import validator from 'validator';
import CommunityEventModel from '../model/communityEvent.js';
import UserModel from '../model/user.js';
import debug from 'debug';
import uuid from 'uuid/v4';
import { isEmpty, isString } from 'lodash';

import { asyncErrorHandler } from '../../utils';
import { verifyWebToken } from '../../auth';
import { isArray } from 'util';

const log = debug('fcc:dataLayer:mongo:event');

function resolveAttendees(attendees) {
  return new Promise(async function resolveAttendeesPromise(resolve, reject) {
    if (!isArray(attendees)) {
      reject(new TypeError('Expected list of attendees'));
      return null;
    }

    const resolvedAttendeesResult = [];
    for (const attendeeUuid of attendees) {
      const attendee = await UserModel.findOne(attendeeUuid, '_id');

      if (attendee && !attendee.isEmpty) {
        resolvedAttendeesResult.push(attendee._id);
      } else {
        reject(`Unable to find attendee: ${JSON.stringify(attendeeUuid)}`);
        return null;
      }
    }

    resolve(resolvedAttendeesResult);
  });
}

async function resolveAndPopulateEvent(query) {
  return CommunityEventModel.findOne(query)
    .populate('owner', 'name email')
    .populate('attendees', 'name email')
    .exec();
}

function validateQuery(input) {
  return (
    ('externalId' in input &&
      (isString(input.externalId) && validator.isUUID(input.externalId))) ||
    ('title' in input && isString(input.title))
  );
}

export async function getCommunityEvent(root, vars) {
  return new Promise(async function getCommunityEventPromise(resolve, reject) {
    if (!('externalId' in vars) && !('title' in vars)) {
      reject(new TypeError('Expected an event ID or title'));
      return null;
    }

    const query =
      'externalId' in vars
        ? { externalId: vars.externalId }
        : {
            title: vars.title
          };

    if (!validateQuery(query)) {
      reject(new TypeError('Expected a valid externalId or title'));
      return null;
    }

    log(`Query: ${JSON.stringify(query)}`);
    const event = await resolveAndPopulateEvent(query);
    if (isEmpty(event)) {
      return resolve(null);
    }

    return resolve(event);
  });
}

function resolveAndPopulateEvents(query) {
  return CommunityEventModel.find(query)
    .populate('owner', 'name email')
    .populate('attendees', 'name email')
    .exec();
}

export async function getCommunityEvents(root, vars) {
  return new Promise(async function getCommunityEventsPromise(resolve, reject) {
    if (!('externalId' in vars) && !('title' in vars)) {
      reject(new TypeError('Expected an event ID or title'));
      return null;
    }

    const query =
      'externalId' in vars
        ? { externalId: vars.externalId }
        : {
            title: vars.title
          };

    if (!validateQuery(query)) {
      reject(new TypeError('Expected a valid externalId or title'));
      return null;
    }

    log(`Query: ${JSON.stringify(query)}`);
    const events = await asyncErrorHandler(resolveAndPopulateEvents(query));

    if (isEmpty(events)) {
      return resolve(null);
    }

    return resolve(events);
  });
}

export async function validatedRequestor(context) {
  return new Promise(async function validatedRequestorPromise(resolve, reject) {
    const { decoded } = verifyWebToken(context);
    const { email } = decoded;

    if (!isString(email) || !validator.isEmail(email)) {
      reject(new Error('You must provide a valid email'));
      return null;
    }

    const user = await UserModel.findOne({ email: email }, '_id')
      .exec()
      .catch(err => {
        if (err) {
          log(`Error finding user: ${JSON.stringify(err)}`);
          reject(new Error('Something went wrong querying database'));
          return null;
        }
      });

    if (user.isEmpty) {
      log(
        `Unable to resolve user making request for email: ${JSON.stringify(
          email
        )}`
      );
      reject(new Error('Cannot resolve user of requestor'));
      return null;
    }

    return resolve(user);
  });
}

function validateAttendees(attendees) {
  return new Promise(async function validateAttendeesPromise(resolve, reject) {
    for (const attendee of attendees) {
      if ('externalId' in attendee && !validator.isUUID(attendee.externalId)) {
        reject(
          new Error(
            `Expected a valid externalId, got ${JSON.stringify(
              attendee.externalId
            )}`
          )
        );
        return null;
      } else if ('email' in attendee && !validator.isEmail(attendee.email)) {
        reject(
          new Error(
            `Expected a valid email address, got ${JSON.stringify(
              attendee.email
            )}`
          )
        );
        return null;
      }
    }
    resolve();
  });
}

export async function createCommunityEvent(root, vars, ctx) {
  return new Promise(async function createCommunityEventPromise(
    resolve,
    reject
  ) {
    const user = await validatedRequestor(ctx).catch(err => {
      if (err) {
        reject(err);
        return null;
      }
    });

    if (user === null) {
      return null;
    }

    const newEvent = {
      title: vars.title,
      description: vars.description,
      owner: user.id,
      date: vars.date,
      externalId: uuid()
    };

    if ('imageUrl' in vars) {
      if (!isString(vars.imageUrl) || !validator.isURL(vars.imageUrl)) {
        reject(
          `Expected valid URL string, got ${JSON.stringify(vars.imageUrl)}`
        );
        return null;
      }

      newEvent.imageUrl = vars.imageUrl;
    }

    if ('isLocked' in vars) {
      if (!isString(vars.isLocked) || !validator.isBoolean(vars.isLocked)) {
        reject(
          `Expected a Boolean value, got ${JSON.stringify(vars.isLocked)}`
        );
        return null;
      }

      newEvent.isLocked = vars.isLocked;
    }

    if ('attendees' in vars) {
      await validateAttendees(vars.attendees).catch(err => reject(err));
      newEvent.attendees = await resolveAttendees(vars.attendees).catch(err => {
        reject(err);
        return null;
      });
    }

    // TODO: populate object with what is there, and validate against a schema
    const event = new CommunityEventModel(newEvent);

    return await event.save(err => {
      if (err) {
        reject(err);
        return null;
      }
      /* Will have attendees populated at this point
      Note that it interestingly this will *not* have an ID:    
      {
        "title":"another new event",
        "description":"cool event IV",
        "owner":"5ad1c7ace769e064e3a3487b",
        "date":"Mon 28 May 2018 13:28:28",
        "externalId":"2c959437-34a6-43f8-9718-b800b5a0dcea",
        "attendees":["5ad1c7ace769e064e3a3487b"]
      }

      Hence well use our external ID:
      */

      return resolve(
        resolveAndPopulateEvent({ externalId: newEvent.externalId })
      );
    });
  });
}

// TODO: Implement an update function
// export async function updateEvent(root, vars, ctx) {
// }

// Delete event, should only be allowed by creator and / or admin
export async function deleteCommunityEvent(root, vars, ctx) {
  const user = await validatedRequestor(ctx).catch(err => {
    if (err) {
      throw new Error(err);
    }
  });

  if ('externalId' in vars) {
    if (!isString(vars.externalId) || !validator.isUUID(vars.externalId)) {
      throw new TypeError('Not a valid UUID');
    }
  }

  await CommunityEventModel.findOne({
    externalId: vars.externalId
  })
    .exec()
    .then((event, err) => {
      if (err) {
        throw err;
      }

      if (isEmpty(event)) {
        throw new Error('Event not found');
      }

      if (event.owner.externalId !== user.externalId) {
        throw new Error('Only allowed to delete events you own');
      }
    });

  return await CommunityEventModel.findOneAndRemove({
    externalId: vars.externalId
  }).then((event, err) => {
    if (err) {
      log(`Error find and removing document: ${JSON.stringify(err)}`);
      throw new Error('Something went wrong querying database');
    }

    if (!event) {
      throw new Error(`No event with externalId ${vars.externalId}`);
    }
    return event;
  });
}
