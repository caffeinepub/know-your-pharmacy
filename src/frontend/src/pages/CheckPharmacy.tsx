import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Loader2 } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import { INDIAN_STATES } from '../constants/indianStates';
import { useTranslation } from '../i18n/i18n';
import { toast } from 'sonner';

export default function CheckPharmacy() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { coordinates, isCapturing, error: gpsError, captureLocation } = useGeolocation();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  const handleNext = () => {
    if (!name.trim() || !address.trim() || !state) {
      toast.error(t('validation.requiredFields'));
      return;
    }

    const pharmacyData = {
      name: name.trim(),
      address: address.trim(),
      state,
      licenseNumber: licenseNumber.trim(),
      gpsCoordinates: coordinates || [0, 0],
    };

    navigate({
      to: '/check-pharmacist',
      state: { pharmacyData } as any,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-emerald-700 dark:text-emerald-400">
            {t('checkPharmacy.title')}
          </CardTitle>
          <CardDescription>{t('checkPharmacy.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">{t('checkPharmacy.pharmacyName')} *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('checkPharmacy.pharmacyNamePlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{t('checkPharmacy.address')} *</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t('checkPharmacy.addressPlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">{t('checkPharmacy.state')} *</Label>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger id="state">
                <SelectValue placeholder={t('checkPharmacy.selectState')} />
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
            <Label htmlFor="license">
              {t('checkPharmacy.licenseNumber')} ({t('common.optional')})
            </Label>
            <Input
              id="license"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              placeholder={t('checkPharmacy.licenseNumberPlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('checkPharmacy.gpsLocation')} ({t('common.optional')})</Label>
            <Button
              type="button"
              variant="outline"
              onClick={captureLocation}
              disabled={isCapturing}
              className="w-full"
            >
              {isCapturing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('checkPharmacy.capturingLocation')}
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-4 w-4" />
                  {coordinates
                    ? t('checkPharmacy.locationCaptured')
                    : t('checkPharmacy.captureLocation')}
                </>
              )}
            </Button>
            {gpsError && (
              <p className="text-sm text-destructive">{gpsError.message}</p>
            )}
            {coordinates && (
              <p className="text-sm text-muted-foreground">
                {t('checkPharmacy.coordinates')}: {coordinates[0].toFixed(6)}, {coordinates[1].toFixed(6)}
              </p>
            )}
          </div>

          <Button onClick={handleNext} className="w-full bg-emerald-600 hover:bg-emerald-700">
            {t('checkPharmacy.nextCheckPharmacist')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
