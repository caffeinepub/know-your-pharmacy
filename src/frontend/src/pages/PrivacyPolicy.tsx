import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '../i18n/i18n';

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-emerald-700 dark:text-emerald-400">
            {t('privacy.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p className="text-muted-foreground">{t('privacy.lastUpdated')}: {new Date().toLocaleDateString()}</p>
          
          <h2>{t('privacy.dataCollection.title')}</h2>
          <p>{t('privacy.dataCollection.content')}</p>

          <h2>{t('privacy.dataUsage.title')}</h2>
          <p>{t('privacy.dataUsage.content')}</p>

          <h2>{t('privacy.dataStorage.title')}</h2>
          <p>{t('privacy.dataStorage.content')}</p>

          <h2>{t('privacy.userRights.title')}</h2>
          <p>{t('privacy.userRights.content')}</p>

          <h2>{t('privacy.contact.title')}</h2>
          <p>{t('privacy.contact.content')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
