import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { get, zipObject } from 'lodash-es';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Button from '../../components/Button';
import useSiteSettings from '../../models/site/useSiteSettings';
import usePutSiteSettings from '../../models/site/usePutSiteSettings';

import LabeledInput from '../../components/LabeledInput';
import FieldSetInput from '../../components/inputs/FieldSetInput';
import fieldTypes from '../../constants/fieldTypes';

const customFields = {
  sighting: 'site.custom.customFields.Occurrence',
  encounter: 'site.custom.customFields.Encounter',
  individual: 'site.custom.customFields.MarkedIndividual',
};

const newSettingFields = [
  'site.name',
  'site.private',
  'site.look.themeColor',
  'site.general.tagline',
  'site.general.taglineSubtitle',
  'site.general.description',
  'site.general.testimonial',
  'site.general.testimonialCitation',
  'site.links.facebookLink',
  'site.links.instagramLink',
  'site.links.twitterLink',
  'site.custom.regions',
  'site.custom.customFieldCategories',
  customFields.sighting,
  customFields.encounter,
  customFields.individual,
];

/* FieldSetInput cannot be rendered by LabeledInput, this avoids a circular dependency. */
function SettingInput({ customFieldCategories, schema, ...rest }) {
  if (get(schema, 'fieldType') === fieldTypes.fieldset) {
    return (
      <FieldSetInput
        schema={schema}
        customFieldCategories={customFieldCategories}
        {...rest}
      />
    );
  }
  return <LabeledInput schema={schema} {...rest} />;
}

export default function SiteSettings({ primaryButtonId }) {
  const newSiteSettings = useSiteSettings();
  const {
    putSiteSettings,
    error,
    setError,
    success,
    setSuccess,
  } = usePutSiteSettings();

  const [currentValues, setCurrentValues] = useState(null);

  const edmValues = newSettingFields.map(fieldKey =>
    get(newSiteSettings, ['data', fieldKey, 'value']),
  );
  useEffect(() => {
    setCurrentValues(zipObject(newSettingFields, edmValues));
  }, edmValues);

  const customFieldCategories = get(
    newSiteSettings,
    ['data', 'site.custom.customFieldCategories', 'value'],
    [],
  );

  return (
    <Grid container direction="column" style={{ marginTop: 40 }}>
      {newSettingFields.map(settingKey => {
        const matchingSetting = get(newSiteSettings, [
          'data',
          settingKey,
        ]);
        const valueIsDefined =
          get(currentValues, settingKey, undefined) !== undefined;

        return (
          <Grid
            key={settingKey}
            item
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                minWidth: '35%',
              }}
            >
              {matchingSetting && valueIsDefined ? (
                <>
                  <Typography
                    style={{
                      marginTop: 20,
                    }}
                    variant="subtitle1"
                  >
                    <FormattedMessage id={matchingSetting.labelId} />
                    {matchingSetting.required && ' *'}
                  </Typography>
                  <Typography
                    style={{
                      marginTop: 4,
                    }}
                  >
                    <FormattedMessage
                      id={matchingSetting.descriptionId}
                    />
                  </Typography>
                </>
              ) : (
                <>
                  <Skeleton
                    variant="rect"
                    width="40%"
                    height={30}
                    style={{ marginTop: 20 }}
                  />
                  <Skeleton
                    variant="rect"
                    width="100%"
                    height={48}
                    style={{ marginTop: 4 }}
                  />
                </>
              )}
            </div>
            <div
              style={{
                marginTop: 24,
                marginLeft: 80,
                width: 400,
                minWidth: 400,
              }}
            >
              {matchingSetting && valueIsDefined ? (
                <SettingInput
                  customFieldCategories={customFieldCategories}
                  schema={{
                    labelId: matchingSetting.labelId,
                    descriptionId: matchingSetting.descriptionId,
                    fieldType: matchingSetting.displayType,
                  }}
                  minimalLabels
                  value={currentValues[settingKey]}
                  onChange={value => {
                    setCurrentValues({
                      ...currentValues,
                      [settingKey]: value,
                    });
                  }}
                />
              ) : (
                <Skeleton variant="rect" width={280} height={30} />
              )}
            </div>
          </Grid>
        );
      })}
      <Grid
        item
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 28,
        }}
      >
        {Boolean(error) && (
          <Alert onClose={() => setError(null)} severity="error">
            <AlertTitle>
              <FormattedMessage id="SUBMISSION_ERROR" />
            </AlertTitle>
            {error}
          </Alert>
        )}
        {success && (
          <Alert onClose={() => setSuccess(false)} severity="success">
            <AlertTitle>
              <FormattedMessage id="SUCCESS" />
            </AlertTitle>
            <FormattedMessage id="CHANGES_SAVED" />
          </Alert>
        )}
        <Button
          onClick={() => {
            /* Prepare custom fields objects to send to backend */
            Object.values(customFields).forEach(customFieldKey => {
              const fields = currentValues[customFieldKey];
              if (!fields) {
                currentValues[customFieldKey] = { definitions: [] };
              } else {
                const newFields = get(fields, 'definitions', []).map(
                  field => {
                    const choices = get(field, ['schema', 'choices']);
                    if (!choices) return field;
                    return {
                      ...field,
                      options: choices.map(choice => choice.label),
                    };
                  },
                );

                currentValues[customFieldKey] = {
                  definitions: newFields,
                };
              }
            });
            putSiteSettings(currentValues);
          }}
          style={{ marginTop: 12 }}
          display="primary"
        >
          <FormattedMessage id={primaryButtonId} />
        </Button>
      </Grid>
    </Grid>
  );
}
