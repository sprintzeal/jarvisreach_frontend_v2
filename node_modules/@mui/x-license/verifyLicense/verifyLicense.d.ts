import { LicenseStatus } from '../utils/licenseStatus';
import { MuiCommercialPackageName } from '../utils/commercialPackages';
export declare function generateReleaseInfo(releaseDate?: Date): string;
export declare function verifyLicense({ releaseInfo, licenseKey, packageName, }: {
    releaseInfo: string;
    licenseKey?: string;
    packageName: MuiCommercialPackageName;
}): {
    status: LicenseStatus;
    meta?: any;
};
