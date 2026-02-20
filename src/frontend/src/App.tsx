import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InternetIdentityProvider } from './hooks/useInternetIdentity';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import Layout from './components/Layout';
import Home from './pages/Home';
import CheckPharmacy from './pages/CheckPharmacy';
import CheckPharmacist from './pages/CheckPharmacist';
import PresenceCheck from './pages/PresenceCheck';
import ReportDetails from './pages/ReportDetails';
import SubmitComplaint from './pages/SubmitComplaint';
import Education from './pages/Education';
import RegulatoryBodies from './pages/RegulatoryBodies';
import MyReports from './pages/MyReports';
import Settings from './pages/Settings';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Onboarding from './components/Onboarding';
import { useOnboarding } from './hooks/useOnboarding';
import { Toaster } from '@/components/ui/sonner';
import { LanguageProvider } from './i18n/i18n';

const queryClient = new QueryClient();

function RootComponent() {
  const { hasCompletedOnboarding } = useOnboarding();
  
  if (!hasCompletedOnboarding) {
    return <Onboarding />;
  }
  
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const checkPharmacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/check-pharmacy',
  component: CheckPharmacy,
});

const checkPharmacistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/check-pharmacist',
  component: CheckPharmacist,
});

const presenceCheckRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/presence-check',
  component: PresenceCheck,
});

const reportDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/report-details',
  component: ReportDetails,
});

const submitComplaintRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/submit-complaint/$reportId',
  component: SubmitComplaint,
});

const educationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/education',
  component: Education,
});

const regulatoryBodiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/regulatory-bodies',
  component: RegulatoryBodies,
});

const myReportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-reports',
  component: MyReports,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: Settings,
});

const privacyPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy-policy',
  component: PrivacyPolicy,
});

const termsOfServiceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: TermsOfService,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  checkPharmacyRoute,
  checkPharmacistRoute,
  presenceCheckRoute,
  reportDetailsRoute,
  submitComplaintRoute,
  educationRoute,
  regulatoryBodiesRoute,
  myReportsRoute,
  settingsRoute,
  privacyPolicyRoute,
  termsOfServiceRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <InternetIdentityProvider>
          <LanguageProvider>
            <RouterProvider router={router} />
            <Toaster />
          </LanguageProvider>
        </InternetIdentityProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
