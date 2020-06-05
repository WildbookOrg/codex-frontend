import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';

export default function Header({
  title,
  showButton,
  buttonText,
  onButtonClick,
  showSettings,
  onSettingsClick,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <Typography
        variant="h3"
        component="h3"
        style={{ padding: '16px 0 16px 16px' }}
      >
        {title}
      </Typography>
      {showButton && (
        <Button
          onClick={onButtonClick}
          variant="outlined"
          style={{ margin: '16px 8px' }}
        >
          {buttonText}
        </Button>
      )}
      {showSettings && (
        <IconButton onClick={onSettingsClick}>
          <SettingsIcon />
        </IconButton>
      )}
    </div>
  );
}
