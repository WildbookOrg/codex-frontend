import { useContext, useEffect, useState } from 'react';
import { merge } from 'lodash-es';
import axios from 'axios';
import getAxiosResponse from '../../utils/getAxiosResponse';
import { formatError } from '../../utils/formatters';
import {
  AppContext,
  setSiteSettingsNeedsFetch,
  setSiteSettingsSchema,
  setSiteSettings,
} from '../../context';

export default function useSiteSettings() {
  const { state, dispatch } = useContext(AppContext);
  const {
    siteSettings,
    siteSettingsSchema,
    siteSettingsNeedsFetch,
  } = state;

  const [error, setError] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(
    siteSettingsNeedsFetch,
  );
  const [schemaLoading, setSchemaLoading] = useState(
    siteSettingsNeedsFetch,
  );
  const loading = settingsLoading || schemaLoading;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const schemaPacket = await axios({
          url:
            'https://nextgen.dev-wildbook.org/api/v0/configurationDefinition/__bundle_setup',
          timeout: 2000,
        });
        dispatch(
          setSiteSettingsSchema(getAxiosResponse(schemaPacket)),
        );
        setSchemaLoading(false);
      } catch (fetchError) {
        setError(formatError(fetchError));
        setSchemaLoading(false);
        console.error('Error fetching site settings');
        console.error(fetchError);
      }
    };

    fetchData();
  }, []);

  useEffect(
    () => {
      const fetchData = async () => {
        try {
          const settingsPacket = await axios(
            'https://nextgen.dev-wildbook.org/api/v0/configuration/__bundle_setup',
          );
          dispatch(setSiteSettings(getAxiosResponse(settingsPacket)));
          dispatch(setSiteSettingsNeedsFetch(false));
          setSettingsLoading(false);
        } catch (fetchError) {
          setError(formatError(fetchError));
          setSettingsLoading(false);
          console.error('Error fetching site settings');
          console.error(fetchError);
        }
      };

      if (siteSettingsNeedsFetch) fetchData();
    },
    [siteSettingsNeedsFetch],
  );

  let data = null;
  if (siteSettings && siteSettingsSchema) {
    data = merge(siteSettingsSchema, siteSettings);
  }

  return { data, loading, error };
}
