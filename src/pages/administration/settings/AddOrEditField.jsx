import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import BooleanInput from '../../../components/inputs/BooleanInput';
import Button from '../../../components/Button';
import InputRow from '../../../components/InputRow';
import StandardDialog from '../../../components/StandardDialog';
import { fieldTypeChoices } from '../../../constants/fieldTypes';

import OptionEditorButton from './OptionEditorButton';
import FileTypeEditor from './FileTypeEditor';
import FieldTypeSelector from './FieldTypeSelector';

function updateSchema(field, property, value) {
  return {
    ...field,
    schema: { ...field.schema, [property]: value },
  };
}

export default function EditField({
  newField,
  open,
  onClose,
  field,
  onSubmit,
  error,
  categories,
  children,
}) {
  const [editedField, setEditedField] = useState(field);
  useEffect(
    () => {
      const sameFieldId = get(editedField, 'id') === get(field, 'id');
      const bothNull = !field && !editedField;
      if (!sameFieldId && !bothNull) {
        setEditedField(field);
      }
    },
    [get(field, 'id')],
  );

  const displayTypeSchema = fieldTypeChoices.find(
    f => get(field, ['schema', 'displayType']) === f.value,
  );

  console.log(fieldTypeChoices);
  console.log(field);
  console.log(displayTypeSchema);

  const configuration = get(displayTypeSchema, 'configuration', []);

  return (
    <StandardDialog
      PaperProps={{ style: { width: 800 } }}
      maxWidth="lg"
      open={open}
      onClose={onClose}
      titleId={newField ? 'ADD_FIELD' : 'EDIT_FIELD'}
    >
      <DialogContent style={{ minWidth: 200 }}>
        <InputRow labelId="FIELD_TYPE">
          <FieldTypeSelector
            field={editedField}
            onChange={nextField => {
              setEditedField(nextField);
            }}
          />
        </InputRow>
        <InputRow
          labelId="FIELD_VALUE"
          descriptionId="FIELD_VALUE_DESCRIPTION"
          required
          onChange={name => {
            setEditedField({
              ...editedField,
              name,
            });
          }}
          schema={{
            labelId: 'FIELD_VALUE',
            descriptionId: 'FIELD_VALUE_DESCRIPTION',
            displayType: 'string',
          }}
          value={get(editedField, 'name', '')}
        />
        <InputRow
          labelId="LABEL"
          required
          onChange={label => {
            setEditedField(updateSchema(editedField, 'label', label));
          }}
          schema={{
            labelId: 'LABEL',
            displayType: 'string',
          }}
          value={get(editedField, 'label', '')}
        />
        <InputRow
          labelId="DESCRIPTION"
          onChange={description => {
            setEditedField(
              updateSchema(editedField, 'description', description),
            );
          }}
          schema={{
            labelId: 'DESCRIPTION',
            displayType: 'longstring',
          }}
          value={get(editedField, 'description', '')}
        />
        <InputRow
          labelId="REQUIRED"
          onChange={isRequired => {
            setEditedField({ ...editedField, required: isRequired });
          }}
          schema={{
            labelId: 'REQUIRED',
            displayType: 'boolean',
          }}
          value={get(editedField, 'required', false)}
        />
        <InputRow
          labelId="CATEGORY"
          onChange={newCategory => {
            setEditedField(
              updateSchema(editedField, 'categoryId', newCategory),
            );
          }}
          schema={{
            labelId: 'CATEGORY',
            displayType: 'select',
            choices: categories.map(c => ({
              label: c.label,
              value: c.id,
            })),
          }}
          value={get(editedField, 'categoryId', '')}
        />
        {configuration.map(configurableProperty => {
          let ConfigurationInput = OptionEditorButton;
          if (configurableProperty.type === 'boolean')
            ConfigurationInput = BooleanInput;
          if (configurableProperty.type === 'filetypeeditor')
            ConfigurationInput = FileTypeEditor;

          return (
            <InputRow
              key={configurableProperty.value}
              labelId={configurableProperty.labelId}
              descriptionId={configurableProperty.descriptionId}
            >
              <ConfigurationInput
                key={configurableProperty.value}
                value={get(editedField, [
                  'schema',
                  configurableProperty.value,
                ])}
                schema={{
                  labelId: configurableProperty.labelId,
                  descriptionId: configurableProperty.descriptionId,
                }}
                onChange={newOptions =>
                  setEditedField(
                    updateSchema(
                      field,
                      configurableProperty.value,
                      newOptions,
                    ),
                  )
                }
              />
            </InputRow>
          );
        })}
        {children}
        {error && (
          <Alert severity="error">
            <AlertTitle>
              <FormattedMessage id="SUBMISSION_ERROR" />
            </AlertTitle>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button display="basic" onClick={onClose}>
          <FormattedMessage id="CANCEL" />
        </Button>
        <Button
          display="primary"
          onClick={() => onSubmit(editedField)}
        >
          <FormattedMessage id="SAVE" />
        </Button>
      </DialogActions>
    </StandardDialog>
  );
}
