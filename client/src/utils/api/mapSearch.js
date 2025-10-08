import { getBaseUrl } from "../baseurls";
import { decodeToken } from "../TokenDecoder";

export const fetchDivisions = async () => {
  try {
    const response = await fetch(`${getBaseUrl()}/divisions/`);
    const data = await response.json();
    const decodedData = decodeToken(data?.data?.results?.token);
    return decodedData?.data || [];
  } catch (error) {
    console.error("Error fetching divisions:", error);
    return [];
  }
};

export const fetchDistricts = async (division) => {
  try {
    const response = await fetch(
      `${getBaseUrl()}/districts/?division_name__name=${encodeURIComponent(
        division
      )}`
    );
    const data = await response.json();
    const decodedData = decodeToken(data?.data?.results?.token);
    return decodedData?.data || [];
  } catch (error) {
    console.error("Error fetching districts:", error);
    return [];
  }
};

export const fetchUpazilas = async (division, district) => {
  try {
    const response = await fetch(
      `${getBaseUrl()}/sub-districts/?district_name__name=${encodeURIComponent(
        district
      )}`
    );
    const data = await response.json();
    const decodedData = decodeToken(data?.data?.results?.token);
    return decodedData?.data || [];
  } catch (error) {
    console.error("Error fetching upazilas:", error);
    return [];
  }
};

export const fetchSurveyType = async (divison, district, upazila) => {
  try {
    const response = await fetch(
      `${getBaseUrl()}/mouza-map-data/get-survey-names/?subdistrict_fk__name=${encodeURIComponent(
        upazila
      )}`
    );
    const data = await response.json();
    const decodedData = decodeToken(data?.data?.results?.token);
    return decodedData?.survey_name_en_list || [];
  } catch (error) {
    console.error("Error fetching survey type:", error);
    return [];
  }
};

export const fetchMouza = async (
  division,
  district,
  subdistrict,
  surveyType
) => {
  try {
    const response = await fetch(
      `${getBaseUrl()}/mouza-map-data/?division_fk__name=${encodeURIComponent(
        division
      )}&district_fk__name=${encodeURIComponent(
        district
      )}&subdistrict_fk__name=${encodeURIComponent(
        subdistrict
      )}&survey_name_en=${encodeURIComponent(surveyType)}`
    );
    const data = await response.json();
    const decodedData = decodeToken(data?.data?.results?.token);
    return decodedData?.data || [];
  } catch (error) {
    console.error("Error fetching mouza:", error);
    return [];
  }
};

export const fetchFiles = async (division, district, upazila, khatianType) => {
  try {
    // Replace with your actual API base URL

    const response = await fetch(
      `${getBaseUrl()}/api/drive/folders/বাংলাদেশ/${encodeURIComponent(
        division
      )}/${encodeURIComponent(district)}/${encodeURIComponent(
        upazila
      )}/${encodeURIComponent(khatianType)}/`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Transform file data to the required format for ResultPage
    if (data.files && Array.isArray(data.files)) {
      return data.files.map((file) => ({
        id: file.id || Math.random().toString(36).substr(2, 9), // Generate ID if not provided
        name: file.name,
        type: getFileType(file.name),
        size: file.size || calculateFileSize(), // Use actual size or calculate
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching files:", error);
    throw new Error(`Failed to fetch files: ${error.message}`);
  }
};

// Helper function to determine file type based on extension
const getFileType = (filename) => {
  const extension = filename.split(".").pop().toLowerCase();

  switch (extension) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "bmp":
      return "JPEG";
    case "pdf":
      return "PDF";
    case "xlsx":
    case "xls":
      return "Excel";
    case "pptx":
    case "ppt":
      return "PowerPoint";
    case "docx":
    case "doc":
      return "Word";
    case "txt":
      return "Text";
    default:
      return "Unknown";
  }
};

// Helper function to calculate file size (mock implementation)
const calculateFileSize = () => {
  // Generate random size between 10KB and 500KB for demo
  const sizeInKB = Math.floor(Math.random() * 490) + 10;
  return `${sizeInKB}KB`;
};

export const getToken = async () => {
  try {
    const response = await fetch(`${getBaseUrl()}/counters/?depth=3`);
    const data = await response.json();
    return data.data.results.token;
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
};
