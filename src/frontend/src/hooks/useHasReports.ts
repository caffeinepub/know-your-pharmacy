import { useInternetIdentity } from './useInternetIdentity';
import { useGetReports } from './useQueries';

export function useHasReports() {
  const { identity } = useInternetIdentity();
  const { data: reports } = useGetReports();

  const isAuthenticated = !!identity;
  const hasBackendReports = reports && reports.length > 0;
  
  // Check localStorage for guest reports
  const localReportIds = JSON.parse(localStorage.getItem('guest-report-ids') || '[]');
  const hasLocalReports = localReportIds.length > 0;

  const hasReports = isAuthenticated ? hasBackendReports : hasLocalReports;

  return { hasReports };
}
