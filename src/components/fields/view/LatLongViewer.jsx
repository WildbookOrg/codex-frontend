import React from 'react';
import { round } from 'lodash-es';
import Text from '../../Text';

export default function LatLongViewer({ value }) {
  return (
    <span style={{ display: 'flex', flexDirection: 'column' }}>
      <Text component="span" variant="body2">
        {`Decimal latitude: ${round(value[0], 3)}...`}
      </Text>
      <Text component="span" variant="body2">
        {`Decimal longitude: ${round(value[1], 3)}...`}
      </Text>
    </span>
  );
}