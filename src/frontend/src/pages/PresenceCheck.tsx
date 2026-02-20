import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import CameraCapture from '../components/CameraCapture';
import { useGeolocation } from '../hooks/useGeolocation';
import { useTranslation } from '../i18n/i18n';
import { toast } from 'sonner';

export default function PresenceCheck() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { coordinates, captureLocation } = useGeolocation();

  const { pharmacyData, pharmacistData } = (location.state as any) || {};

  const [pharmacistPresent, setPharmacistPresent] = useState('');
  const [whoDispensing, setWhoDispensing] = useState('');
  const [observationTime, setObservationTime] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);

  // Auto-capture GPS on mount
  useEffect(() => {
    captureLocation();
  }, []);

  if (!pharmacyData || !pharmacistData) {
    navigate({ to: '/check-pharmacy' });
    return null;
  }

  const handleAddPhoto = (file: File) => {
    setPhotos([...photos, file]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (!pharmacistPresent || !whoDispensing || !observationTime) {
      toast.error(t('validation.answerAllQuestions'));
      return;
    }

    const observationData = {
      timestamp: Date.now(),
      presenceAnswers: [pharmacistPresent, whoDispensing, observationTime],
      photos,
      gps: coordinates || [0, 0],
    };

    navigate({
      to: '/report-details',
      state: { pharmacyData, pharmacistData, observationData } as any,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-emerald-700 dark:text-emerald-400">
            {t('presenceCheck.title')}
          </CardTitle>
          <CardDescription>{t('presenceCheck.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>{t('presenceCheck.question1')} *</Label>
            <RadioGroup value={pharmacistPresent} onValueChange={setPharmacistPresent}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="present-yes" />
                <Label htmlFor="present-yes" className="font-normal cursor-pointer">
                  {t('presenceCheck.yes')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="present-no" />
                <Label htmlFor="present-no" className="font-normal cursor-pointer">
                  {t('presenceCheck.no')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not-sure" id="present-not-sure" />
                <Label htmlFor="present-not-sure" className="font-normal cursor-pointer">
                  {t('presenceCheck.notSure')}
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="who-dispensing">{t('presenceCheck.question2')} *</Label>
            <Select value={whoDispensing} onValueChange={setWhoDispensing}>
              <SelectTrigger id="who-dispensing">
                <SelectValue placeholder={t('presenceCheck.selectOption')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="registered-pharmacist">{t('presenceCheck.registeredPharmacist')}</SelectItem>
                <SelectItem value="other-staff">{t('presenceCheck.otherStaff')}</SelectItem>
                <SelectItem value="not-sure">{t('presenceCheck.notSure')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observation-time">{t('presenceCheck.question3')} *</Label>
            <Select value={observationTime} onValueChange={setObservationTime}>
              <SelectTrigger id="observation-time">
                <SelectValue placeholder={t('presenceCheck.selectDuration')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-5">0-5 {t('presenceCheck.minutes')}</SelectItem>
                <SelectItem value="5-15">5-15 {t('presenceCheck.minutes')}</SelectItem>
                <SelectItem value="15+">15+ {t('presenceCheck.minutes')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('presenceCheck.photos')} ({t('common.optional')})</Label>
            <p className="text-sm text-muted-foreground">{t('presenceCheck.photosDescription')}</p>
            <CameraCapture onCapture={handleAddPhoto} facingMode="environment" />
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => handleRemovePhoto(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button onClick={handleNext} className="w-full bg-emerald-600 hover:bg-emerald-700">
            {t('presenceCheck.nextCreateReport')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
