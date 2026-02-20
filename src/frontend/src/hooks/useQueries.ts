import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Report, UserProfile, Authority, RegulatoryBody, BodyType } from '../backend';
import { ExternalBlob } from '../backend';
import { compressImage } from '../utils/imageCompression';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useCreateReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      pharmacyData: any;
      pharmacistData: any;
      observationData: any;
      issues: string[];
      otherIssue: string;
      userName: string;
      userPhone: string;
      userEmail: string;
    }) => {
      if (!actor) throw new Error('Actor not available');

      // Compress and upload pharmacist photo
      let pharmacistPhotoBlob: ExternalBlob | null = null;
      if (data.pharmacistData.photo) {
        const compressed = await compressImage(data.pharmacistData.photo);
        const bytes = new Uint8Array(await compressed.arrayBuffer());
        pharmacistPhotoBlob = ExternalBlob.fromBytes(bytes);
      }

      // Compress and upload observation photos
      const observationPhotoBlobs: ExternalBlob[] = [];
      for (const photo of data.observationData.photos) {
        const compressed = await compressImage(photo);
        const bytes = new Uint8Array(await compressed.arrayBuffer());
        observationPhotoBlobs.push(ExternalBlob.fromBytes(bytes));
      }

      // Map issues to backend format
      const mappedIssues = data.issues.map((issue) => {
        if (issue === 'pharmacistAbsent') {
          return { __kind__: 'pharmacistAbsent' as const, pharmacistAbsent: null };
        } else if (issue === 'detailsNotDisplayed') {
          return { __kind__: 'detailsNotDisplayed' as const, detailsNotDisplayed: null };
        } else if (issue === 'suspectedFake') {
          return { __kind__: 'suspectedFake' as const, suspectedFake: null };
        } else if (issue === 'other') {
          return { __kind__: 'other' as const, other: data.otherIssue };
        }
        return { __kind__: 'other' as const, other: issue };
      });

      const report: any = {
        id: '',
        owner: actor ? await actor.getCallerUserRole() : null,
        pharmacy: {
          id: '',
          name: data.pharmacyData.name,
          address: data.pharmacyData.address,
          state: data.pharmacyData.state,
          licenseNumber: data.pharmacyData.licenseNumber,
          gpsCoordinates: data.pharmacyData.gpsCoordinates,
        },
        pharmacist: {
          name: data.pharmacistData.name,
          registrationNumber: data.pharmacistData.registrationNumber,
          state: data.pharmacistData.state,
          photo: pharmacistPhotoBlob || ExternalBlob.fromBytes(new Uint8Array()),
        },
        observation: {
          timestamp: BigInt(data.observationData.timestamp * 1000000),
          presenceAnswers: data.observationData.presenceAnswers,
          photos: observationPhotoBlobs,
          gps: data.observationData.gps,
        },
        issues: mappedIssues,
        user: data.userName ? {
          id: '',
          name: data.userName,
          phone: data.userPhone,
          email: data.userEmail,
        } : undefined,
        status: 'draft',
        createdAt: BigInt(0),
        updatedAt: BigInt(0),
      };

      const reportId = await actor.createReport(report);
      return reportId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useGetReports() {
  const { actor, isFetching } = useActor();

  return useQuery<Report[]>({
    queryKey: ['reports'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReports();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetReport(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Report | null>({
    queryKey: ['report', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getReport(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useUpdateReportStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: any }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateReportStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useDeleteReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteReport(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useGetAuthorities(state: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Authority[]>({
    queryKey: ['authorities', state],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAuthoritiesByState(state);
    },
    enabled: !!actor && !isFetching && !!state,
  });
}

export function useEducationContent() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['education'],
    queryFn: async () => {
      if (!actor) return { educationContent: [], faqContent: [] };
      const [educationContent, faqContent] = await Promise.all([
        actor.getAllEducationContent(),
        actor.getAllFaq(),
      ]);
      return { educationContent, faqContent };
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRegulatoryBodies() {
  const { actor, isFetching } = useActor();

  return useQuery<RegulatoryBody[]>({
    queryKey: ['regulatoryBodies'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRegulatoryBodies();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRegulatoryBodiesByType(bodyType: BodyType) {
  const { actor, isFetching } = useActor();

  return useQuery<RegulatoryBody[]>({
    queryKey: ['regulatoryBodies', bodyType],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRegulatoryBodiesByType(bodyType);
    },
    enabled: !!actor && !isFetching,
  });
}
