import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Info } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useEducationContent } from '../hooks/useQueries';
import { useTranslation } from '../i18n/i18n';

export default function Education() {
  const { t } = useTranslation();
  const { data, isLoading } = useEducationContent();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const educationContent = data?.educationContent || [];
  const faqContent = data?.faqContent || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <img
          src="/assets/generated/education-header.dim_1200x400.png"
          alt="Education"
          className="w-full rounded-xl shadow-lg mb-6"
        />
        <h1 className="text-4xl font-bold text-emerald-700 dark:text-emerald-400 mb-4">
          {t('education.title')}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t('education.subtitle')}
        </p>
      </div>

      <div className="space-y-6">
        {educationContent.length > 0 ? (
          educationContent.map(([key, content]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle>{t(`education.content.${key}.title`)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {content}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{t('education.content.pharmacistRole.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {t('education.content.pharmacistRole.content')}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t('education.faq.title')}</CardTitle>
          <CardDescription>{t('education.faq.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqContent.length > 0 ? (
              faqContent.map(([key, answer], index) => (
                <AccordionItem key={key} value={`item-${index}`}>
                  <AccordionTrigger>{t(`education.faq.${key}.question`)}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {answer}
                  </AccordionContent>
                </AccordionItem>
              ))
            ) : (
              <>
                <AccordionItem value="item-1">
                  <AccordionTrigger>{t('education.faq.displayed.question')}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {t('education.faq.displayed.answer')}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>{t('education.faq.runWithout.question')}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {t('education.faq.runWithout.answer')}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>{t('education.faq.evidence.question')}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {t('education.faq.evidence.answer')}
                  </AccordionContent>
                </AccordionItem>
              </>
            )}
          </Accordion>
        </CardContent>
      </Card>

      {/* Cross-reference to Regulatory Bodies page */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>{t('nav.regulatoryBodies')}</AlertTitle>
        <AlertDescription className="flex items-center justify-between gap-4">
          <span>{t('education.regulatoryBodiesReference')}</span>
          <Button asChild variant="outline" size="sm">
            <Link to="/regulatory-bodies">View Contacts</Link>
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
