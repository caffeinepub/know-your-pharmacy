import { useParams } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Mail, Loader2 } from 'lucide-react';
import { useGetReport, useGetAuthorities } from '../hooks/useQueries';
import { formatComplaintEmail } from '../utils/formatComplaintEmail';
import { useTranslation } from '../i18n/i18n';

export default function SubmitComplaint() {
  const { reportId } = useParams({ from: '/submit-complaint/$reportId' });
  const { t } = useTranslation();
  const { data: report, isLoading: reportLoading } = useGetReport(reportId);
  const { data: authorities, isLoading: authoritiesLoading } = useGetAuthorities(
    report?.pharmacy.state || ''
  );

  if (reportLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!report) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{t('submitComplaint.reportNotFound')}</AlertDescription>
      </Alert>
    );
  }

  const handleEmailComplaint = (authority: any) => {
    const subject = `Complaint regarding pharmacist absence / pharmacy operations – ${report.pharmacy.state}, ${report.pharmacy.address}`;
    const body = formatComplaintEmail(report);
    const mailtoLink = `mailto:${authority.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const handleOpenWebsite = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-emerald-700 dark:text-emerald-400">
            {t('submitComplaint.title')}
          </CardTitle>
          <CardDescription>{t('submitComplaint.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertDescription>{t('submitComplaint.instructions')}</AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t('submitComplaint.recommendedAuthorities')}</h3>
            {authoritiesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              </div>
            ) : authorities && authorities.length > 0 ? (
              <div className="space-y-4">
                {authorities.map((authority, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{authority.name}</CardTitle>
                      <CardDescription>{authority.jurisdiction}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm space-y-1">
                        <p><strong>{t('submitComplaint.email')}:</strong> {authority.email}</p>
                        <p><strong>{t('submitComplaint.phone')}:</strong> {authority.phone}</p>
                        <p><strong>{t('submitComplaint.website')}:</strong> {authority.website}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEmailComplaint(authority)}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          {t('submitComplaint.sendEmail')}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleOpenWebsite(authority.website)}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          {t('submitComplaint.openWebsite')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Alert>
                <AlertDescription>{t('submitComplaint.noAuthorities')}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
