import { get, omit } from 'lodash-es';
import { v4 as uuid } from 'uuid';

function updateTimes(encounter) {
  const year = get(encounter, 'timeYear', 0);
  const month = get(encounter, 'timeMonth', 0);
  const day = get(encounter, 'timeDay', 1);
  const hours = get(encounter, 'timeHour', 1);
  const minutes = get(encounter, 'timeMinutes', 0);
  const seconds = get(encounter, 'timeSeconds', 0);
  const time = new Date(year, month, day, hours, minutes, seconds);
  return {
    ...encounter,
    time,
  };
}

function assignIfPresent(
  sourceObject,
  destinationObject,
  sourcePath,
  destinationPath,
) {
  if (!destinationPath) destinationPath = sourcePath;
  if (get(sourceObject, sourcePath, undefined) !== undefined) {
    destinationObject[destinationPath] = sourceObject[sourcePath];
  }
}

export default function prepareAssetGroup(
  encounters,
  assetReferences,
) {
  const sightings = {};
  const simpleAssetReferences = assetReferences.map(a => a.path);
  encounters.forEach(encounter => {
    const newEncounter = updateTimes(encounter);

    const sightingId = get(newEncounter, 'sightingId', uuid());
    const sightingAssetInput = get(
      newEncounter,
      'assetReferences',
      '',
    );
    const sightingAssets = sightingAssetInput
      .split(',')
      .map(a => a.trim());
    const matchingAssets = simpleAssetReferences.filter(path =>
      sightingAssets.includes(path),
    );

    if (!sightings[sightingId]) sightings[sightingId] = {};
    sightings[sightingId].assetReferences = matchingAssets;
    assignIfPresent(
      newEncounter,
      sightings[sightingId],
      'locationId',
    );
    assignIfPresent(
      newEncounter,
      sightings[sightingId],
      'decimalLongitude',
    );
    assignIfPresent(
      newEncounter,
      sightings[sightingId],
      'decimalLatitude',
    );
    assignIfPresent(
      newEncounter,
      sightings[sightingId],
      'verbatimLocality',
    );

    const startTime = get(sightings, [sightingId, 'startTime']);
    const startTimeAfter = newEncounter.time < startTime;
    if (!startTime || startTimeAfter) {
      assignIfPresent(
        newEncounter,
        sightings[sightingId],
        'time',
        'startTime',
      );
    }

    const endTime = get(sightings, [sightingId, 'startTime']);
    const endTimeBefore = newEncounter.time > startTime;
    if (!endTime || endTimeBefore) {
      assignIfPresent(
        newEncounter,
        sightings[sightingId],
        'time',
        'endTime',
      );
    }

    if (!get(sightings, [sightingId, 'encounters']))
      sightings[sightingId].encounters = [];

    const finalEncounter = omit(newEncounter, [
      'sightingId',
      'assetReferences',
      'timeYear',
      'timeMonth',
      'timeDay',
      'timeHour',
      'timeMinutes',
      'timeSeconds',
    ]);
    sightings[sightingId].encounters.push(finalEncounter);
  });

  return Object.values(sightings);
}
