import fieldTypes from './fieldTypes';

export const encounterCategories = {
  general: {
    name: 'general',
    labelId: 'GENERAL',
  },
  encounterDetails: {
    name: 'encounterDetails',
    labelId: 'ENCOUNTER_DETAILS',
  },
  animal: {
    name: 'animal',
    labelId: 'ANIMAL_INFORMATION',
  },
};

/* Excludes species, region and custom fields. These will be computed in
selectors based on site settings. */
export default [
  {
    name: 'sightingDate',
    labelId: 'SIGHTING_DATE',
    category: encounterCategories.general.name,
    fieldType: fieldTypes.date,
    required: true,
    defaultValue: null,
  },
  {
    name: 'encounterContext',
    labelId: 'ENCOUNTER_CONTEXT',
    category: encounterCategories.general.name,
    fieldType: fieldTypes.select,
    required: true,
    choices: [
      'Research effort',
      'Wildlife tour',
      'Opportunistic sighting',
    ],
    defaultValue: '',
  },
  {
    name: 'location',
    labelId: 'LOCATION',
    descriptionId: 'LOCATION_DESCRIPTION',
    category: encounterCategories.general.name,
    fieldType: fieldTypes.latlong,
    defaultValue: null,
  },
  {
    name: 'location_freeform',
    labelId: 'LOCATION_FREEFORM',
    descriptionId: 'LOCATION_FREEFORM_DESCRIPTION',
    category: encounterCategories.general.name,
    fieldType: fieldTypes.string,
    defaultValue: '',
  },
  {
    name: 'sex',
    labelId: 'SEX',
    category: encounterCategories.animal.name,
    fieldType: fieldTypes.select,
    choices: ['male', 'female', 'non-binary', 'unknown'],
    defaultValue: '',
  },
  {
    name: 'status',
    labelId: 'STATUS',
    descriptionId: 'STATUS_ENCOUNTERS_DESCRIPTION',
    category: encounterCategories.animal.name,
    fieldType: fieldTypes.select,
    choices: ['Alive', 'Dead', 'Unknown'],
    defaultValue: '',
  },
  {
    name: 'photographer',
    labelId: 'PHOTOGRAPHER',
    descriptionId: 'PHOTOGRAPHER_DESCRIPTION',
    category: encounterCategories.encounterDetails.name,
    fieldType: fieldTypes.string,
    defaultValue: '',
  },
  {
    name: 'photographerEmail',
    labelId: 'PHOTOGRAPHER_EMAIL',
    category: encounterCategories.encounterDetails.name,
    fieldType: fieldTypes.string,
    defaultValue: '',
  },
];