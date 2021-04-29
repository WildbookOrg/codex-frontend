import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { v4 as uuid } from 'uuid';
import { get } from 'lodash-es';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import { createCustomFieldSchema } from '../../../../utils/fieldUtils';
import { fieldTypeInfo } from '../../../../constants/fieldTypesNew';
import useSiteSettings from '../../../../models/site/useSiteSettings';
import MainColumn from '../../../../components/MainColumn';
import Text from '../../../../components/Text';
import Button from '../../../../components/Button';
import MetadataCard from '../../../../components/cards/MetadataCardNew';
import InputRow from '../../../../components/fields/edit/InputRowNew';
import customFieldTypes from '../constants/customFieldTypes';

const inputWidth = 280;

export default function SaveField() {
  const [formData, setFormData] = useState(null);
  const [lookupFieldError, setLookupFieldError] = useState(false);
  const { id, type } = useParams();
  const {
    data,
    loading,
    error: fetchSiteSettingsError,
  } = useSiteSettings();
  const newField = !id;

  const error = lookupFieldError || fetchSiteSettingsError;
  const disableForm =
    loading || lookupFieldError || fetchSiteSettingsError;

  useEffect(
    () => {
      if (!data) return null;
      if (newField) {
        setFormData({
          schema: {
            displayType: fieldTypeInfo.string.value,
            label: 'Field label',
            description: 'Field description',
          },
          default: fieldTypeInfo.string.initialDefaultValue,
          name: 'field_name',
          multiple: fieldTypeInfo.string.backendMultiple,
          required: false,
          type: fieldTypeInfo.string.backendType,
          id: uuid(),
          timeCreated: Date.now(),
        });
      } else {
        const backendFieldType = get(customFieldTypes, [
          type,
          'backendPath',
        ]);
        const fieldsInType = get(
          data,
          [backendFieldType, 'value', 'definitions'],
          [],
        );
        const matchingField = fieldsInType.find(
          field => field.id === id,
        );

        if (matchingField) {
          setFormData(matchingField);
        } else {
          setLookupFieldError(true);
        }
      }
      return null;
    },
    [data],
  );

  const fieldSchema = formData
    ? createCustomFieldSchema(formData)
    : null;
  const fieldType = get(formData, ['schema', 'displayType']);
  const defaultEditable = get(
    fieldTypeInfo,
    [fieldType, 'canProvideDefaultValue'],
    false,
  );

  return (
    <MainColumn
      style={{
        display: 'flex',
        justifyContent: 'center',
        maxWidth: 1000,
        margin: '64px 0 0 0', // Do not switch to margin top, needs to override default margin
      }}
    >
      <Paper elevation={16} style={{ minHeight: '100vh' }}>
        <Text
          variant="h5"
          style={{ margin: '16px 0 0 16px' }}
          id="CONFIGURATION"
        />
        <Divider style={{ margin: '12px 0 24px 0' }} />
        <Grid
          container
          direction="column"
          spacing={2}
          style={{ padding: '0 16px' }}
        >
          <Grid item>
            <FormControl
              required
              style={{ width: inputWidth, marginBottom: 4 }}
            >
              <TextField
                id="name"
                disabled={disableForm}
                onChange={e =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                label={<FormattedMessage id="FIELD_VALUE" />}
                value={get(formData, 'name', '')}
              />
              <FormHelperText>
                <FormattedMessage id="FIELD_VALUE_DESCRIPTION" />
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl
              required
              style={{ width: inputWidth, marginBottom: 4 }}
            >
              <InputLabel>
                <FormattedMessage id="TYPE" />
              </InputLabel>
              <Select
                id="name"
                disabled={disableForm}
                onChange={e => {
                  const nextFieldType = e.target.value;
                  const nextBackendFieldType =
                    fieldTypeInfo[nextFieldType].backendType;
                  const nextMultiple =
                    fieldTypeInfo[nextFieldType].backendMultiple;

                  const nextFormData = {
                    ...formData,
                    multiple: nextMultiple,
                    type: nextBackendFieldType,
                    schema: {
                      ...formData.schema,
                      displayType: nextFieldType,
                    },
                  };

                  if (
                    fieldTypeInfo[nextFieldType]
                      .canProvideDefaultValue
                  ) {
                    const nextInitialDefault =
                      fieldTypeInfo[nextFieldType]
                        .initialDefaultValue;
                    nextFormData.default = nextInitialDefault;
                  }

                  setFormData(nextFormData);
                }}
                value={get(formData, ['schema', 'displayType'], '')}
              >
                {Object.values(fieldTypeInfo).map(typeInfo => (
                  <MenuItem
                    key={typeInfo.value}
                    value={typeInfo.value}
                  >
                    <FormattedMessage id={typeInfo.labelId} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl style={{ width: 220, marginBottom: 4 }}>
              <FormControlLabel
                control={
                  <Switch disabled={disableForm} name="required" />
                }
                label={<FormattedMessage id="REQUIRED" />}
                value={get(formData, 'required', false)}
                onChange={e =>
                  setFormData({
                    ...formData,
                    required: e.target.checked,
                  })
                }
              />
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl
              required
              style={{ width: inputWidth, marginBottom: 4 }}
            >
              <TextField
                id="label"
                disabled={disableForm}
                label={<FormattedMessage id="LABEL" />}
                value={get(formData, ['schema', 'label'], '')}
                onChange={e =>
                  setFormData({
                    ...formData,
                    schema: {
                      ...formData.schema,
                      label: e.target.value,
                    },
                  })
                }
              />
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl
              style={{ width: inputWidth, marginBottom: 4 }}
            >
              <TextField
                id="description"
                multiline
                disabled={disableForm}
                label={<FormattedMessage id="DESCRIPTION" />}
                value={get(formData, ['schema', 'description'], '')}
                onChange={e =>
                  setFormData({
                    ...formData,
                    schema: {
                      ...formData.schema,
                      description: e.target.value,
                    },
                  })
                }
              />
            </FormControl>
          </Grid>
          {defaultEditable ? (
            <Grid item>
              <fieldSchema.editComponent
                {...get(fieldSchema, 'editComponentProps', {})}
                schema={{
                  ...fieldSchema,
                  labelId: 'DEFAULT_VALUE',
                  name: 'custom-field-default-value',
                  descriptionId: 'FIELD_DEFAULT_VALUE_DESCRIPTION',
                }}
                value={get(formData, 'default')}
                onChange={nextDefaultValue =>
                  setFormData({
                    ...formData,
                    default: nextDefaultValue,
                  })
                }
                disabled={disableForm}
              />
            </Grid>
          ) : null}
        </Grid>
      </Paper>
      <Grid container direction="column" style={{ padding: 32 }}>
        <Grid item>
          <Text
            variant="h3"
            id={newField ? 'NEW_CUSTOM_FIELD' : 'EDIT_CUSTOM_FIELD'}
          />
        </Grid>
        {error ? (
          <Grid item>
            <Alert severity="error" style={{ marginTop: 20 }}>
              <AlertTitle>
                <FormattedMessage id="AN_ERROR_OCCURRED" />
              </AlertTitle>
              <FormattedMessage
                id={
                  fetchSiteSettingsError
                    ? 'FETCH_SITE_SETTINGS_ERROR'
                    : 'CUSTOM_FIELD_NOT_FOUND_ERROR'
                }
              />
            </Alert>
          </Grid>
        ) : (
          <>
            <Grid item style={{ margin: '32px 0' }}>
              <Text
                variant="body2"
                id="CUSTOM_FIELD_REPORT_PREVIEW"
              />
              <Paper
                elevation={2}
                style={{
                  marginTop: 12,
                  padding: '8px 12px 16px 12px',
                }}
              >
                {fieldSchema && (
                  <InputRow schema={fieldSchema}>
                    <fieldSchema.editComponent
                      {...get(fieldSchema, 'editComponentProps', {})}
                      schema={fieldSchema}
                      value={get(formData, 'default')}
                      onChange={Function.prototype}
                      minimalLabels
                    />
                  </InputRow>
                )}
              </Paper>
            </Grid>
            <Grid item style={{ marginBottom: 32 }}>
              <Text
                style={{ marginBottom: 12 }}
                variant="body2"
                id="CUSTOM_FIELD_METADATA_PREVIEW"
              />
              {fieldSchema ? (
                <MetadataCard
                  metadata={[
                    {
                      ...fieldSchema,
                      value: get(fieldTypeInfo, [
                        fieldType,
                        'exampleValue',
                      ]),
                    },
                  ]}
                  showDefaultValues
                />
              ) : null}
            </Grid>
            <Grid item>
              <Button
                id="SAVE_FIELD"
                display="primary"
                onClick={Function.prototype}
              />
            </Grid>
          </>
        )}
      </Grid>
    </MainColumn>
  );
}
