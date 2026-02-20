import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '../i18n/i18n';

export default function TermsOfService() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-emerald-700 dark:text-emerald-400">
            {t('terms.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p className="text-muted-foreground">{t('terms.lastUpdated')}: {new Date().toLocaleDateString()}</p>
          
          <h2>{t('terms.service.title')}</h2>
          <p>{t('terms.service.content')}</p>

          <h2>{t('terms.responsibilities.title')}</h2>
          <p>{t('terms.responsibilities.content')}</p>

          <h2>{t('terms.disclaimer.title')}</h2>
          <p>{t('terms.disclaimer.content')}</p>

          <h2>{t('terms.limitation.title')}</h2>
          <p>{t('terms.limitation.content')}</p>

          <h2>{t('terms.governing.title')}</h2>
          <p>{t('terms.governing.content')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
