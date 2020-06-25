import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import Drawer from '@material-ui/core/Drawer';

import { selectIsAuthenticated } from '../../modules/app/selectors';
import MainColumn from '../../components/MainColumn';
import ButtonLink from '../../components/ButtonLink';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import Link from '../../components/Link';
import StandardReport from './StandardReport';
import BulkReport from './BulkReport';
import UploadManager from './UploadManager';

export default function ReportSightings() {
  useDocumentTitle('Report Encounters');
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [mode, setMode] = useState('');
  const [files, setFiles] = useState([]);
  const [reporting, setReporting] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(!isAuthenticated);

  const noImages = mode !== '' && files.length === 0;

  const onBack = () => setReporting(false);

  return (
    <MainColumn style={{ display: 'flex', justifyContent: 'center' }}>
      <Drawer
        open={drawerOpen}
        anchor="bottom"
        PaperProps={{ style: { padding: '20px 20px 32px 20px' } }}
      >
        <Typography>
          <FormattedMessage id="REPORT_LOGIN_PROMPT" />
        </Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="secondary"
            style={{ marginTop: 12, marginRight: 20 }}
            onClick={() => setDrawerOpen(false)}
          >
            <FormattedMessage id="CONTINUE" />
          </Button>
          <ButtonLink
            variant="contained"
            style={{
              color: 'white',
              marginTop: 12,
              marginRight: 20,
              backgroundColor: 'rgba(79, 84, 255)',
            }}
            href="/login"
          >
            <FormattedMessage id="LOG_IN" />
          </ButtonLink>
          <ButtonLink
            variant="contained"
            style={{
              color: 'white',
              marginTop: 12,
              backgroundColor: 'rgba(232, 85, 0)',
            }}
            href="/request"
          >
            <FormattedMessage id="REQUEST_INVITE" />
          </ButtonLink>
        </div>
      </Drawer>
      <Grid
        container
        direction="column"
        spacing={2}
        style={{ padding: '20px 16px' }}
      >
        <Grid item>
          <Typography variant="h3" component="h3">
            <FormattedMessage id="REPORT_SIGHTINGS" />
          </Typography>
        </Grid>
        {!reporting && (
          <>
            <Grid item>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="sharing"
                  name="sharing"
                  value={mode}
                >
                  <FormControlLabel
                    value="one"
                    control={<Radio />}
                    onClick={e => {
                      if (e.target.value) setMode(e.target.value);
                    }}
                    label={
                      <FormattedMessage id="ONE_SIGHTING_ONE_INDIVIDUAL" />
                    }
                  />
                  <Typography variant="caption">
                    <FormattedMessage id="ONE_SIGHTING_ONE_INDIVIDUAL_DESCRIPTION" />
                  </Typography>
                  <FormControlLabel
                    value="multiple"
                    control={<Radio />}
                    onClick={e => {
                      if (e.target.value) setMode(e.target.value);
                    }}
                    label={
                      <FormattedMessage id="ONE_SIGHTING_MULTIPLE_INDIVIDUALS" />
                    }
                  />
                  <Typography variant="caption">
                    <FormattedMessage id="ONE_SIGHTING_MULTIPLE_INDIVIDUALS_DESCRIPTION" />
                  </Typography>
                  <FormControlLabel
                    value="bulk"
                    control={<Radio />}
                    onClick={e => {
                      if (e.target.value) setMode(e.target.value);
                    }}
                    label={
                      <FormattedMessage id="MULTIPLE_SIGHTINGS" />
                    }
                  />
                  <Typography variant="caption">
                    <FormattedMessage id="MULTIPLE_SIGHTINGS_DESCRIPTION" />
                  </Typography>
                </RadioGroup>
              </FormControl>
            </Grid>

            {mode !== '' && (
              <Grid item>
                <UploadManager files={files} setFiles={setFiles} />
                <div
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <InfoIcon
                    fontSize="small"
                    style={{ marginRight: 4 }}
                  />
                  <Typography variant="caption">
                    <FormattedMessage id="PHOTO_OPTIMIZE_1" />
                    <Link
                      external
                      href="http://wiki.wildbook.org/en/researchers/photography"
                    >
                      <FormattedMessage id="PHOTO_OPTIMIZE_2" />
                    </Link>
                    <FormattedMessage id="PHOTO_OPTIMIZE_3" />
                  </Typography>
                </div>
              </Grid>
            )}

            <Grid item>
              <Button
                variant="contained"
                color={noImages ? 'default' : 'secondary'}
                disabled={!mode}
                onClick={() => setReporting(true)}
                style={{ marginTop: 16 }}
              >
                <FormattedMessage
                  id={
                    noImages
                      ? 'CONTINUE_WITHOUT_PHOTOGRAPHS'
                      : 'CONTINUE'
                  }
                />
              </Button>
            </Grid>
          </>
        )}
        {reporting && ['one', 'multiple'].includes(mode) && (
          <StandardReport onBack={onBack} variant={mode} />
        )}
        {reporting && mode === 'bulk' && (
          <BulkReport onBack={onBack} files={files} />
        )}
      </Grid>
    </MainColumn>
  );
}
