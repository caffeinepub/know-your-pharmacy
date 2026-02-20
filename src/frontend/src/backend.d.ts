import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export type IssueType = {
    __kind__: "detailsNotDisplayed";
    detailsNotDisplayed: null;
} | {
    __kind__: "other";
    other: string;
} | {
    __kind__: "pharmacistAbsent";
    pharmacistAbsent: null;
} | {
    __kind__: "suspectedFake";
    suspectedFake: null;
};
export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
}
export interface Observation {
    gps: [number, number];
    presenceAnswers: Array<string>;
    timestamp: Time;
    photos: Array<ExternalBlob>;
}
export interface Report {
    id: string;
    status: ReportStatus;
    owner: Principal;
    createdAt: Time;
    user?: User;
    issues: Array<IssueType>;
    updatedAt: Time;
    pharmacy: Pharmacy;
    observation: Observation;
    pharmacist: Pharmacist;
}
export interface RegulatoryBody {
    displayOrder: bigint;
    name: string;
    description: string;
    email: string;
    website: string;
    state?: string;
    helpline?: string;
    address?: string;
    phone: string;
    bodyType: BodyType;
}
export interface Pharmacy {
    id: string;
    gpsCoordinates: [number, number];
    name: string;
    state: string;
    address: string;
    licenseNumber: string;
}
export interface Authority {
    name: string;
    email: string;
    website: string;
    jurisdiction: string;
    phone: string;
}
export interface Pharmacist {
    name: string;
    registrationNumber: string;
    state: string;
    photo: ExternalBlob;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export enum BodyType {
    national = "national",
    state = "state",
    consumer = "consumer"
}
export enum ReportStatus {
    resolved = "resolved",
    deleted = "deleted",
    emailSent = "emailSent",
    draft = "draft"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAuthority(state: string, authority: Authority): Promise<void>;
    addEducationContent(key: string, content: string): Promise<void>;
    addFaq(key: string, content: string): Promise<void>;
    addOrUpdateRegulatoryBody(id: string, body: RegulatoryBody): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createReport(report: Report): Promise<string>;
    deleteRegulatoryBody(id: string): Promise<void>;
    deleteReport(id: string): Promise<void>;
    getAllEducationContent(): Promise<Array<[string, string]>>;
    getAllFaq(): Promise<Array<[string, string]>>;
    getAllRegulatoryBodies(): Promise<Array<RegulatoryBody>>;
    getAuthoritiesByState(state: string): Promise<Array<Authority>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEducationContent(key: string): Promise<string | null>;
    getFaq(key: string): Promise<string | null>;
    getRegulatoryBodiesByState(state: string): Promise<Array<RegulatoryBody>>;
    getRegulatoryBodiesByType(bodyType: BodyType): Promise<Array<RegulatoryBody>>;
    getRegulatoryBody(id: string): Promise<RegulatoryBody | null>;
    getReport(id: string): Promise<Report | null>;
    getReports(): Promise<Array<Report>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateReport(id: string, updatedReport: Report): Promise<void>;
    updateReportStatus(id: string, status: ReportStatus): Promise<void>;
}
