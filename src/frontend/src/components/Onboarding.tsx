import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useOnboarding } from '../hooks/useOnboarding';
import { useTranslation } from '../i18n/i18n';
import { ShieldCheck, AlertTriangle, FileText } from 'lucide-react';

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { completeOnboarding } = useOnboarding();
  const { t } = useTranslation();

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else if (step === 2 && termsAccepted) {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
            <img src="/assets/generated/logo.dim_512x512.png" alt="Know Your Pharmacy" className="w-16 h-16 object-contain" />
          </div>
          <CardTitle className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">
            {t('onboarding.title')}
          </CardTitle>
          <CardDescription className="text-lg">
            {t('onboarding.tagline')}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 0 && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t('onboarding.purpose.title')}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('onboarding.purpose.description')}
                  </p>
                </div>
              </div>
              <img 
                src="/assets/generated/onboarding.dim_600x400.png" 
                alt="Citizen verification" 
                className="w-full rounded-lg shadow-md"
              />
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
                <p className="text-sm text-emerald-800 dark:text-emerald-200">
                  {t('onboarding.purpose.mission')}
                </p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400 shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t('onboarding.disclaimer.title')}</h3>
                  <div className="space-y-3 text-muted-foreground">
                    <p className="leading-relaxed">{t('onboarding.disclaimer.point1')}</p>
                    <p className="leading-relaxed">{t('onboarding.disclaimer.point2')}</p>
                    <p className="leading-relaxed">{t('onboarding.disclaimer.point3')}</p>
                  </div>
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                  {t('onboarding.disclaimer.responsibility')}
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400 shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t('onboarding.terms.title')}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {t('onboarding.terms.description')}
                  </p>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 max-h-64 overflow-y-auto bg-muted/30">
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>{t('onboarding.terms.content.intro')}</p>
                  <p>{t('onboarding.terms.content.dataCollection')}</p>
                  <p>{t('onboarding.terms.content.userResponsibility')}</p>
                  <p>{t('onboarding.terms.content.privacy')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <Checkbox 
                  id="terms" 
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                />
                <Label 
                  htmlFor="terms" 
                  className="text-sm font-medium leading-relaxed cursor-pointer"
                >
                  {t('onboarding.terms.acceptance')}
                </Label>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 0}
          >
            {t('common.back')}
          </Button>
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === step ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <Button
            onClick={handleNext}
            disabled={step === 2 && !termsAccepted}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {step === 2 ? t('onboarding.getStarted') : t('common.next')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
