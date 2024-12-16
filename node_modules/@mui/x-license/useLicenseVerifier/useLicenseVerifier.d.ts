import { LicenseStatus } from '../utils/licenseStatus';
import { MuiCommercialPackageName } from '../utils/commercialPackages';
export declare const sharedLicenseStatuses: {
    [packageName in MuiCommercialPackageName]?: {
        key: string | undefined;
        licenseVerifier: {
            status: LicenseStatus;
        };
    };
};
export declare function useLicenseVerifier(packageName: MuiCommercialPackageName, releaseInfo: string): {
    status: LicenseStatus;
};
