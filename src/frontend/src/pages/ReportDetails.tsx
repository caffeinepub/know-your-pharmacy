import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { useCreateReport } from '../hooks/useQueries';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useTranslation } from '../i18n/i18n';
import { toast } from 'sonner';

export default function ReportDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { mutate: createReport, isPending } = useCreateReport();
  const { data: userProfile } = useGetCallerUserProfile();

  const { pharmacyData, pharmacistData, observationData } = (location.state as any) || {};

  const [issues, setIssues] = useState<string[]>([]);
  const [otherIssue, setOtherIssue] = useState('');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (userProfile) {
      setUserName(userProfile.name);
      setUserPhone(userProfile.phone);
      setUserEmail(userProfile.email);
    }
  }, [userProfile]);

  if (!pharmacyData || !pharmacistData || !observationData) {
    navigate({ to: '/check-pharmacy' });
    return null;
  }

  const toggleIssue = (issue: string) => {
    setIssues((prev) =>
      prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue]
    );
  };

  const handleSave = () => {
    if (issues.length === 0) {
      toast.error(t('validation.selectAtLeastOneIssue'));
      return;
    }

    createReport(
      {
        pharmacyData,
        pharmacistData,
        observationData,
        issues,
        otherIssue,
        userName: userName.trim(),
        userPhone: userPhone.trim(),
        userEmail: userEmail.trim(),
      },
      {
        onSuccess: (reportId) => {
          toast.success(t('report.saved'));
          navigate({ to: '/my-reports' });
        },
        onError: (error) => {
          toast.error(t('report.saveFailed'));
          console.error('Report creation error:', error);
        },
      }
    );
  };

  const displayPharmacistName = pharmacistData.name || t('reportDetails.notAvailable');
  const displayRegistrationNumber = pharmacistData.registrationNumber || t('reportDetails.notAvailable');

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-emerald-700 dark:text-emerald-400">
            {t('reportDetails.title')}
          </CardTitle>
          <CardDescription>{t('reportDetails.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">{t('reportDetails.pharmacyDetails')}</h3>
            <div className="bg-muted p-4 rounded-lg space-y-1 text-sm">
              <p><strong>{t('checkPharmacy.pharmacyName')}:</strong> {pharmacyData.name}</p>
              <p><strong>{t('checkPharmacy.address')}:</strong> {pharmacyData.address}</p>
              <p><strong>{t('checkPharmacy.state')}:</strong> {pharmacyData.state}</p>
              {pharmacyData.licenseNumber && (
                <p><strong>{t('checkPharmacy.licenseNumber')}:</strong> {pharmacyData.licenseNumber}</p>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">{t('reportDetails.pharmacistDetails')}</h3>
            <div className="bg-muted p-4 rounded-lg space-y-1 text-sm">
              <p><strong>{t('checkPharmacist.pharmacistName')}:</strong> {displayPharmacistName}</p>
              <p><strong>{t('checkPharmacist.registrationNumber')}:</strong> {displayRegistrationNumber}</p>
              <p><strong>{t('checkPharmacist.stateOfRegistration')}:</strong> {pharmacistData.state}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">{t('reportDetails.observationDetails')}</h3>
            <div className="bg-muted p-4 rounded-lg space-y-1 text-sm">
              <p><strong>{t('reportDetails.timestamp')}:</strong> {new Date(observationData.timestamp).toLocaleString()}</p>
              <p><strong>{t('reportDetails.photos')}:</strong> {observationData.photos.length} {t('reportDetails.photosAttached')}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label>{t('reportDetails.issueTypes')} *</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="issue-absent"
                  checked={issues.includes('pharmacistAbsent')}
                  onCheckedChange={() => toggleIssue('pharmacistAbsent')}
                />
                <Label htmlFor="issue-absent" className="font-normal cursor-pointer">
                  {t('reportDetails.pharmacistAbsent')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="issue-not-displayed"
                  checked={issues.includes('detailsNotDisplayed')}
                  onCheckedChange={() => toggleIssue('detailsNotDisplayed')}
                />
                <Label htmlFor="issue-not-displayed" className="font-normal cursor-pointer">
                  {t('reportDetails.detailsNotDisplayed')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="issue-fake"
                  checked={issues.includes('suspectedFake')}
                  onCheckedChange={() => toggleIssue('suspectedFake')}
                />
                <Label htmlFor="issue-fake" className="font-normal cursor-pointer">
                  {t('reportDetails.suspectedFake')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="issue-other"
                  checked={issues.includes('other')}
                  onCheckedChange={() => toggleIssue('other')}
                />
                <Label htmlFor="issue-other" className="font-normal cursor-pointer">
                  {t('reportDetails.other')}
                </Label>
              </div>
              {issues.includes('other') && (
                <Textarea
                  value={otherIssue}
                  onChange={(e) => setOtherIssue(e.target.value)}
                  placeholder={t('reportDetails.describeOtherIssue')}
                  className="mt-2"
                />
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">{t('reportDetails.contactDetails')} ({t('common.optional')})</h3>
            <div className="space-y-2">
              <Label htmlFor="user-name">{t('profile.name')}</Label>
              <Input
                id="user-name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder={t('profile.namePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-phone">{t('profile.phone')}</Label>
              <Input
                id="user-phone"
                type="tel"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                placeholder={t('profile.phonePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-email">{t('profile.email')}</Label>
              <Input
                id="user-email"
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder={t('profile.emailPlaceholder')}
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={isPending}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('reportDetails.saveReport')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
