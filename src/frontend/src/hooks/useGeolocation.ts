import { useState } from 'react';

interface GeolocationError {
  type: 'permission' | 'not-supported' | 'timeout' | 'unknown';
  message: string;
}

export function useGeolocation() {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<GeolocationError | null>(null);

  const captureLocation = async () => {
    if (!navigator.geolocation) {
      setError({
        type: 'not-supported',
        message: 'Geolocation is not supported by your browser',
      });
      return;
    }

    setIsCapturing(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates([position.coords.latitude, position.coords.longitude]);
        setIsCapturing(false);
      },
      (err) => {
        let errorType: GeolocationError['type'] = 'unknown';
        let message = err.message;

        if (err.code === err.PERMISSION_DENIED) {
          errorType = 'permission';
          message = 'Location permission denied. You can still submit a report without GPS coordinates.';
        } else if (err.code === err.TIMEOUT) {
          errorType = 'timeout';
          message = 'Location request timed out';
        }

        setError({ type: errorType, message });
        setIsCapturing(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return {
    coordinates,
    isCapturing,
    error,
    captureLocation,
  };
}
