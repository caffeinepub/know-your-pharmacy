import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff } from 'lucide-react';
import { useTranslation } from '../i18n/i18n';

export default function NetworkStatusIndicator() {
  const { isOnline } = useNetworkStatus();
  const { t } = useTranslation();

  if (isOnline) return null;

  return (
    <Alert variant="destructive" className="rounded-none border-x-0">
      <WifiOff className="h-4 w-4" />
      <AlertDescription>{t('network.offline')}</AlertDescription>
    </Alert>
  );
}
