import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardCheck, FileText, BookOpen, FolderOpen } from 'lucide-react';
import { useHasReports } from '../hooks/useHasReports';
import { useTranslation } from '../i18n/i18n';

export default function Home() {
  const { hasReports } = useHasReports();
  const { t } = useTranslation();

  const cards = [
    {
      to: '/check-pharmacy',
      icon: ClipboardCheck,
      title: t('home.checkPharmacy.title'),
      description: t('home.checkPharmacy.description'),
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      to: '/check-pharmacy',
      icon: FileText,
      title: t('home.reportIssue.title'),
      description: t('home.reportIssue.description'),
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      to: '/education',
      icon: BookOpen,
      title: t('home.education.title'),
      description: t('home.education.description'),
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  if (hasReports) {
    cards.push({
      to: '/my-reports',
      icon: FolderOpen,
      title: t('home.myReports.title'),
      description: t('home.myReports.description'),
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    });
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <img
          src="/assets/generated/home-hero.dim_800x600.png"
          alt="Know Your Pharmacy"
          className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
        />
        <h1 className="text-4xl md:text-5xl font-bold text-emerald-700 dark:text-emerald-400">
          {t('app.name')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('app.tagline')}
        </p>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('app.mission')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.to} to={card.to}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                  <CardTitle className="text-xl">{card.title}</CardTitle>
                  <CardDescription className="text-base">{card.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
