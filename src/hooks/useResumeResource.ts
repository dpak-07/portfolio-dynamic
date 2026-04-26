import { useMemo } from "react";
import { useFirestoreData } from "@/hooks/useFirestoreData";
import { getResumeLinks } from "@/utils/urlHelpers";

interface ResumeData {
  resumeDriveLink?: string;
  description?: string;
  skills?: string[];
  achievements?: string;
  [key: string]: any;
}

export function useResumeResource(fallbackLink?: string) {
  const { data, loading, error, refetch } = useFirestoreData<ResumeData>("resume", "data");

  const sourceResumeLink = useMemo(() => {
    const primaryLink = typeof data?.resumeDriveLink === "string" ? data.resumeDriveLink.trim() : "";
    const secondaryLink = typeof fallbackLink === "string" ? fallbackLink.trim() : "";
    return primaryLink || secondaryLink || "";
  }, [data?.resumeDriveLink, fallbackLink]);

  const links = useMemo(() => getResumeLinks(sourceResumeLink), [sourceResumeLink]);

  return {
    resumeData: data,
    sourceResumeLink,
    preview: links.preview,
    download: links.download,
    loading,
    error,
    refetch,
  };
}
