# Today Beach Firebase data pipeline

## Collections

- `beaches`: fixed beach metadata, access scores, facilities and activity scores.
- `weather_history`: one document per beach per hour (`YYYY-MM-DD-HH-beachId`).
- `activity_weights`: one document per activity, holding versioned weights.
- `recommendation_history`: append-only recommendation audit history.

## One-time Firebase setup

1. Enable **Cloud Firestore** in the `today1-72a13` project.
2. Upgrade the Firebase project to a billing plan that supports Cloud Functions and Cloud Scheduler.
3. Install Firebase CLI, sign in, then run `firebase use today1-72a13`.
4. Set the KMA service key without adding it to source control:
   `firebase functions:secrets:set KMA_SERVICE_KEY`
5. Install and deploy the function package:
   `cd functions && npm install && npm run deploy`
6. Deploy the Firestore security rules from the repository root:
   `firebase deploy --only firestore:rules`

The browser reads Firestore only. KMA keys and API calls are reserved for the scheduled backend function.

## Required indexes

Create a composite index for `weather_history`: `beachId` ascending, `observedAt` descending.

## Marine repository

`demoMarineRepository` deliberately owns the demo marine values. Replacing only that repository with a KHOA adapter leaves the collection shape and recommendation engine unchanged.
