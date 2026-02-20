import { Link } from '@tanstack/react-router';
import { Menu, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import LoginButton from './LoginButton';
import UserProfileSetup from './UserProfileSetup';
import NetworkStatusIndicator from './NetworkStatusIndicator';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '../i18n/i18n';
import { SiCaffeine } from 'react-icons/si';
import { Heart } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' ? window.location.hostname : 'know-your-pharmacy';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link to="/" className="text-lg font-medium hover:text-emerald-600 transition-colors">
                    {t('nav.home')}
                  </Link>
                  <Link to="/check-pharmacy" className="text-lg font-medium hover:text-emerald-600 transition-colors">
                    {t('nav.checkPharmacy')}
                  </Link>
                  <Link to="/education" className="text-lg font-medium hover:text-emerald-600 transition-colors">
                    {t('nav.education')}
                  </Link>
                  <Link to="/regulatory-bodies" className="text-lg font-medium hover:text-emerald-600 transition-colors">
                    {t('nav.regulatoryBodies')}
                  </Link>
                  <Link to="/my-reports" className="text-lg font-medium hover:text-emerald-600 transition-colors">
                    {t('nav.myReports')}
                  </Link>
                  <Link to="/settings" className="text-lg font-medium hover:text-emerald-600 transition-colors">
                    {t('nav.settings')}
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>

            <Link to="/" className="flex items-center gap-2">
              <img src="/assets/generated/logo.dim_512x512.png" alt="Logo" className="h-10 w-10" />
              <span className="font-bold text-xl text-emerald-700 dark:text-emerald-400 hidden sm:inline">
                {t('app.name')}
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-emerald-600 transition-colors">
              {t('nav.home')}
            </Link>
            <Link to="/check-pharmacy" className="text-sm font-medium hover:text-emerald-600 transition-colors">
              {t('nav.checkPharmacy')}
            </Link>
            <Link to="/education" className="text-sm font-medium hover:text-emerald-600 transition-colors">
              {t('nav.education')}
            </Link>
            <Link to="/regulatory-bodies" className="text-sm font-medium hover:text-emerald-600 transition-colors">
              {t('nav.regulatoryBodies')}
            </Link>
            <Link to="/my-reports" className="text-sm font-medium hover:text-emerald-600 transition-colors">
              {t('nav.myReports')}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Link to="/settings">
              <Button variant="ghost" size="icon">
                <SettingsIcon className="h-5 w-5" />
              </Button>
            </Link>
            <LoginButton />
          </div>
        </div>
      </header>

      <NetworkStatusIndicator />
      <UserProfileSetup />

      <main className="flex-1 container px-4 py-8">
        {children}
      </main>

      <footer className="border-t bg-muted/30 mt-auto">
        <div className="container px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-3 text-emerald-700 dark:text-emerald-400">{t('app.name')}</h3>
              <p className="text-sm text-muted-foreground">{t('app.tagline')}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">{t('footer.legal')}</h3>
              <div className="flex flex-col gap-2">
                <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.privacyPolicy')}
                </Link>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.terms')}
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">{t('footer.contact')}</h3>
              <p className="text-sm text-muted-foreground">{t('footer.publicInterest')}</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
            <p>© {currentYear} {t('app.name')}. {t('footer.allRights')}</p>
            <p className="mt-2 flex items-center justify-center gap-1">
              {t('footer.builtWith')} <Heart className="w-4 h-4 text-red-500 fill-red-500" /> {t('footer.using')}{' '}
              <a 
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(appIdentifier)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
