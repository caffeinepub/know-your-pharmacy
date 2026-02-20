import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { useRegulatoryBodies } from '../hooks/useQueries';
import { useTranslation } from '../i18n/i18n';
import RegulatoryBodyCard from '../components/RegulatoryBodyCard';
import { BodyType } from '../backend';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function RegulatoryBodies() {
  const { t } = useTranslation();
  const { data: regulatoryBodies, isLoading, error } = useRegulatoryBodies();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('regulatoryBodies.error')}</AlertTitle>
          <AlertDescription>{t('regulatoryBodies.errorMessage')}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Group bodies by type
  const nationalBodies = regulatoryBodies?.filter(body => body.bodyType === BodyType.national) || [];
  const stateBodies = regulatoryBodies?.filter(body => body.bodyType === BodyType.state) || [];
  const consumerBodies = regulatoryBodies?.filter(body => body.bodyType === BodyType.consumer) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-emerald-700 dark:text-emerald-400 mb-4">
          {t('regulatoryBodies.title')}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t('regulatoryBodies.subtitle')}
        </p>
      </div>

      {/* National Regulatory Bodies */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t('regulatoryBodies.national.title')}</CardTitle>
            <CardDescription>{t('regulatoryBodies.national.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {nationalBodies.length > 0 ? (
              nationalBodies.map((body, index) => (
                <RegulatoryBodyCard key={index} body={body} />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                {t('regulatoryBodies.noBodies')}
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* State Pharmacy Councils */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t('regulatoryBodies.state.title')}</CardTitle>
            <CardDescription>{t('regulatoryBodies.state.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stateBodies.length > 0 ? (
              stateBodies.map((body, index) => (
                <RegulatoryBodyCard key={index} body={body} />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                {t('regulatoryBodies.noBodies')}
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Consumer Protection Forums */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t('regulatoryBodies.consumer.title')}</CardTitle>
            <CardDescription>{t('regulatoryBodies.consumer.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {consumerBodies.length > 0 ? (
              consumerBodies.map((body, index) => (
                <RegulatoryBodyCard key={index} body={body} />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                {t('regulatoryBodies.noBodies')}
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Help Section */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t('regulatoryBodies.help.title')}</AlertTitle>
        <AlertDescription>{t('regulatoryBodies.help.description')}</AlertDescription>
      </Alert>
    </div>
  );
}
