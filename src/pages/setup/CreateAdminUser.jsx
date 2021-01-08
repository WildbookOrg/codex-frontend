import React, { useEffect, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '../../components/Button';
import SimpleFormPage from '../../components/SimpleFormPage';

import useCreateAdminUser from '../../models/setup/useCreateAdminUser';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const buttonId = 'createAdminUser';

export default function CreateAdminUser() {
  const {
    authenticate,
    error,
    setError,
    loading,
  } = useCreateAdminUser();

  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const intl = useIntl();
  useDocumentTitle(intl.formatMessage({ id: 'CODEX_INITIALIZED' }));

  function onKeyUp(e) {
    if (e.key === 'Enter') {
      document.querySelector(`#${buttonId}`).click();
      e.preventDefault();
    }
  }

  useEffect(() => {
    document.addEventListener('keyup', onKeyUp);
    return () => {
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return (
    <SimpleFormPage titleId="CODEX_INITIALIZED" instructionsId="FIRST_STEP_CREATE_ADMIN">
      <form>
        <Grid
          container
          spacing={2}
          direction="column"
          style={{ padding: 16, width: 280 }}
        >
          <Grid item>
            <FormControl
              required
              style={{ width: '100%', marginBottom: 4 }}
            >
              <TextField
                autoComplete="username"
                variant="outlined"
                id="email"
                onChange={e => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                label={<FormattedMessage id="EMAIL_ADDRESS" />}
              />
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl
              required
              style={{ width: '100%', marginBottom: 4 }}
            >
              <TextField
                autoComplete="off"
                variant="outlined"
                id="password"
                type="password"
                onChange={e => {
                  setPassword1(e.target.value);
                  setError(null);
                }}
                label={<FormattedMessage id="PASSWORD" />}
              />
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl
              required
              style={{ width: '100%', marginBottom: 4 }}
            >
              <TextField
                autoComplete="off"
                variant="outlined"
                id="password"
                type="password"
                onChange={e => {
                  setPassword2(e.target.value);
                  setError(null);
                }}
                label={<FormattedMessage id="CONFIRM_PASSWORD" />}
              />
            </FormControl>
          </Grid>
          {error && <Alert severity="error">{error}</Alert>}
          <Grid item style={{ position: 'relative' }}>
            <Button
              id={buttonId}
              loading={loading}
              onClick={() => {
                if (password1 === password2) {
                  authenticate(email, password1, '/');
                } else {
                  setError(intl.formatMessage({ id: 'PASSWORDS_DO_NOT_MATCH' }))
                }
              }}
              display="primary"
            >
              <FormattedMessage id="CREATE_USER" />
            </Button>
          </Grid>
        </Grid>
      </form>
    </SimpleFormPage>
  );
}
