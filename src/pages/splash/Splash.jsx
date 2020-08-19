import React from 'react';
import ReactPlayer from 'react-player';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { selectSiteSettings } from '../../modules/site/selectors';
import Trifold from './Trifold';

export default function Splash() {
  const intl = useIntl();
  const theme = useTheme();
  const siteSettings = useSelector(selectSiteSettings);

  useDocumentTitle(
    intl.formatMessage(
      { id: 'WELCOME_TO_SITENAME' },
      { siteName: siteSettings.siteName },
    ),
    false,
  );

  return (
    <div style={{ marginTop: 64 }}>
      <div style={{ position: 'relative' }}>
        <ReactPlayer
          url={siteSettings.splashVideo}
          muted
          autoPlay
          playing
          width="100vw"
          height="auto"
        />
        <div
          style={{
            position: 'absolute',
            bottom: '15%',
            width: '100vw',
            textAlign: 'center',
            color: theme.palette.getContrastText('rgba(0, 0, 0, 0)'),
          }}
        >
          <Typography variant="h3">{siteSettings.tagline}</Typography>
        </div>
      </div>
      <Trifold />
      <div
        style={{
          width: '100vw',
          maxWidth: 900,
          textAlign: 'center',
          margin: '64px auto',
        }}
      >
        <Grid container>
          <Grid item>
            <div
              style={{
                backgroundImage: `url(${
                  siteSettings.testimonialAuthorImage
                })`,
                borderRadius: 1000,
                backgroundSize: 'cover',
                border: `6px solid ${theme.palette.secondary.main}`,
                margin: '16px 40px 0 40px',
                height: 140,
                width: 140,
              }}
            />
          </Grid>
          <Grid
            item
            style={{
              textAlign: 'left',
              margin: '16px 40px 0 40px',
              width: '60%',
              minWidth: 240,
            }}
          >
            <Typography>{`"${siteSettings.testimonial}"`}</Typography>
            <Typography variant="subtitle1" style={{ marginTop: 12 }}>
              {siteSettings.testimonialAuthor.toLocaleUpperCase()}
            </Typography>
            <Typography variant="subtitle2">
              {siteSettings.testimonialAuthorCredentials}
            </Typography>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}