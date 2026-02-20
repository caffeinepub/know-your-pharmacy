import { useState } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Info, X } from 'lucide-react';
import CameraCapture from '../components/CameraCapture';
import { INDIAN_STATES } from '../constants/indianStates';
import { useTranslation } from '../i18n/i18n';
import { toast } from 'sonner';

export default function CheckPharmacist() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const pharmacyData = (location.state as any)?.pharmacyData;

  const [name, setName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [state, setState] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [unknownDetails, setUnknownDetails] = useState(false);

  if (!pharmacyData) {
    navigate({ to: '/check-pharmacy' });
    return null;
  }

  const validateRegistrationNumber = (num: string): boolean => {
    return num.trim().length >= 3 && /^[a-zA-Z0-9]+$/.test(num.trim());
  };

  const handleNext = () => {
    // If unknown details is checked, skip validation for name and registration number
    if (!unknownDetails) {
      if (!name.trim() || !registrationNumber.trim() || !state) {
        toast.error(t('validation.requiredFields'));
        return;
      }

      if (!validateRegistrationNumber(registrationNumber)) {
        toast.error(t('validation.invalidRegistrationNumber'));
        return;
      }
    } else {
      // When unknown details is checked, only state is required
      if (!state) {
        toast.error(t('validation.requiredFields'));
        return;
      }
    }

    const pharmacistData = {
      name: unknownDetails ? '' : name.trim(),
      registrationNumber: unknownDetails ? '' : registrationNumber.trim(),
      state,
      photo,
      unknownDetails,
    };

    navigate({
      to: '/presence-check',
      state: { pharmacyData, pharmacistData } as any,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-emerald-700 dark:text-emerald-400">
            {t('checkPharmacist.title')}
          </CardTitle>
          <CardDescription>{t('checkPharmacist.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>{t('checkPharmacist.disclaimer')}</AlertDescription>
          </Alert>

          <div className="flex items-center space-x-2 p-4 bg-muted rounded-lg">
            <Checkbox
              id="unknown-details"
              checked={unknownDetails}
              onCheckedChange={(checked) => setUnknownDetails(checked === true)}
            />
            <Label htmlFor="unknown-details" className="font-normal cursor-pointer text-sm">
              {t('checkPharmacist.unknownCheckbox')}
            </Label>
          </div>

          {unknownDetails && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {t('checkPharmacist.unknownHelp')}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="pharmacist-name">
              {t('checkPharmacist.pharmacistName')} {!unknownDetails && '*'}
            </Label>
            <Input
              id="pharmacist-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('checkPharmacist.pharmacistNamePlaceholder')}
              disabled={unknownDetails}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="registration">
              {t('checkPharmacist.registrationNumber')} {!unknownDetails && '*'}
            </Label>
            <Input
              id="registration"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              placeholder={t('checkPharmacist.registrationNumberPlaceholder')}
              disabled={unknownDetails}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pharmacist-state">{t('checkPharmacist.stateOfRegistration')} *</Label>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger id="pharmacist-state">
                <SelectValue placeholder={t('checkPharmacist.selectState')} />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_STATES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('checkPharmacist.photo')} ({t('common.optional')})</Label>
            <div className="flex flex-col gap-2">
              <CameraCapture onCapture={setPhoto} facingMode="environment" />
              {photo && (
                <div className="relative inline-block">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="Pharmacist display"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={() => setPhoto(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>{t('checkPharmacist.qrScanning')}</strong> {t('checkPharmacist.comingSoon')}
            </p>
          </div>

          <Button onClick={handleNext} className="w-full bg-emerald-600 hover:bg-emerald-700">
            {t('checkPharmacist.nextPresenceCheck')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
