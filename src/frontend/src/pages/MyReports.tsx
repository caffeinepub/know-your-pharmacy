import { Link, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { FileText, Trash2, Send, Loader2, FolderOpen } from 'lucide-react';
import { useGetReports, useDeleteReport } from '../hooks/useQueries';
import { formatComplaintEmail } from '../utils/formatComplaintEmail';
import { useTranslation } from '../i18n/i18n';
import { toast } from 'sonner';
import type { Report } from '../backend';

export default function MyReports() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: reports, isLoading } = useGetReports();
  const { mutate: deleteReport } = useDeleteReport();

  const handleExport = (report: Report) => {
    const text = formatComplaintEmail(report);
    
    if (navigator.share) {
      navigator.share({
        title: t('myReports.complaintTitle'),
        text,
      }).catch(() => {
        navigator.clipboard.writeText(text);
        toast.success(t('myReports.copiedToClipboard'));
      });
    } else {
      navigator.clipboard.writeText(text);
      toast.success(t('myReports.copiedToClipboard'));
    }
  };

  const handleDelete = (reportId: string) => {
    deleteReport(reportId, {
      onSuccess: () => {
        toast.success(t('myReports.deleted'));
      },
      onError: () => {
        toast.error(t('myReports.deleteFailed'));
      },
    });
  };

  const handleSubmitComplaint = (reportId: string) => {
    navigate({ to: '/submit-complaint/$reportId', params: { reportId } });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      draft: 'secondary',
      emailSent: 'default',
      resolved: 'outline',
      deleted: 'destructive',
    };
    return (
      <Badge variant={variants[status] || 'default'}>
        {t(`myReports.status.${status}`)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('myReports.noReports')}</h3>
            <p className="text-muted-foreground text-center mb-6">
              {t('myReports.noReportsDescription')}
            </p>
            <Link to="/check-pharmacy">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                {t('myReports.createFirstReport')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">
          {t('myReports.title')}
        </h1>
        <p className="text-muted-foreground">{t('myReports.subtitle')}</p>
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{report.pharmacy.name}</CardTitle>
                  <CardDescription>
                    {new Date(Number(report.createdAt) / 1000000).toLocaleDateString()} •{' '}
                    {report.pharmacy.address}
                  </CardDescription>
                </div>
                {getStatusBadge(report.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p><strong>{t('myReports.pharmacist')}:</strong> {report.pharmacist.name}</p>
                  <p><strong>{t('myReports.issues')}:</strong>{' '}
                    {report.issues.map((issue) => {
                      if (typeof issue === 'object' && '__kind__' in issue) {
                        if (issue.__kind__ === 'other') {
                          return issue.other;
                        }
                        return t(`reportDetails.${issue.__kind__}`);
                      }
                      return '';
                    }).join(', ')}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport(report)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {t('myReports.export')}
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => handleSubmitComplaint(report.id)}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {t('myReports.submitComplaint')}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('myReports.delete')}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('myReports.deleteConfirmTitle')}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('myReports.deleteConfirmDescription')}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(report.id)}>
                          {t('myReports.delete')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
