/**
 * Detects the current platform.
 * Note: UserAgent detection is not 100% reliable but sufficient for UI adaptation.
 */
export const getPlatform = () => {
  const userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera;

  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'ios';
  }

  if (/android/i.test(userAgent)) {
    return 'android';
  }

  return 'web';
};

export const isIOS = () => getPlatform() === 'ios';
export const isAndroid = () => getPlatform() === 'android';
