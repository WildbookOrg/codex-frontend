import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';

export default function usePatchUser(userId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const replaceUserProperty = async (path, value) => {
    try {
      setLoading(true);
      const patchResponse = await axios({
        url: `${__houston_url__}/api/v1/users/${userId}`,
        withCredentials: true,
        method: 'patch',
        data: [
          {
            op: 'replace',
            path,
            value,
          },
        ],
      });
      const responseStatus = get(patchResponse, 'status');
      const successful = responseStatus === 200;
      if (successful) {
        setLoading(false);
        setSuccess(true);
        setError(null);
        return true;
      }

      setError(formatError(patchResponse));
      setSuccess(false);
      return false;
    } catch (postError) {
      setLoading(false);
      setError(formatError(postError));
      setSuccess(false);
      return false;
    }
  };

  const replaceUserProperties = async properties => {
    try {
      setLoading(true);
      const patchResponse = await axios({
        url: `${__houston_url__}/api/v1/users/${userId}`,
        withCredentials: true,
        method: 'patch',
        data: properties.map(p => ({
          op: 'replace',
          path: get(p, 'path'),
          value: get(p, 'value'),
        })),
      });
      const responseStatus = get(patchResponse, 'status');
      const successful = responseStatus === 200;
      if (successful) {
        setLoading(false);
        setSuccess(true);
        setError(null);
        return true;
      }

      setError(formatError(patchResponse));
      setSuccess(false);
      return false;
    } catch (postError) {
      setLoading(false);
      setError(formatError(postError));
      setSuccess(false);
      return false;
    }
  };

  const removeUserProperty = async path => {
    try {
      setLoading(true);
      const patchResponse = await axios({
        url: `${__houston_url__}/api/v1/users/${userId}`,
        withCredentials: true,
        method: 'patch',
        data: [
          {
            op: 'remove',
            path,
          },
        ],
      });
      const responseStatus = get(patchResponse, 'status');
      const successful = responseStatus === 200;
      if (successful) {
        setLoading(false);
        setSuccess(true);
        setError(null);
        return true;
      }

      setError(formatError(patchResponse));
      setSuccess(false);
      return false;
    } catch (postError) {
      setLoading(false);
      setError(formatError(postError));
      setSuccess(false);
      return false;
    }
  };

  return {
    replaceUserProperty,
    replaceUserProperties,
    removeUserProperty,
    loading,
    error,
    setError,
    success,
    setSuccess,
  };
}
