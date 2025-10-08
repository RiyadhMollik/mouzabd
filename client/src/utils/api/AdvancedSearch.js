import axios from 'axios';
import { getBaseUrl } from "../baseurls";

export const fetchDivisions = async () => {
  try {
    const response = await axios.get(`${getBaseUrl()}/api/drive/folders/বাংলাদেশ/`);
    return response.data.folders || [];
  } catch (error) {
    console.error("Error fetching divisions:", error);
    return [];
  }
};

export const fetchDistricts = async (division) => {
  try {
    const response = await axios.get(
      `${getBaseUrl()}/api/drive/folders/বাংলাদেশ/${division}/`
    );
    return response.data.folders || [];
  } catch (error) {
    console.error("Error fetching districts:", error);
    return [];
  }
};

export const fetchUpazilas = async (division, district) => {
  try {
    const response = await axios.get(
      `${getBaseUrl()}/api/drive/folders/বাংলাদেশ/${division}/${district}/`
    );
    return response.data.folders || [];
  } catch (error) {
    console.error("Error fetching upazilas:", error);
    return [];
  }
};

export const fetchKhatianTypes = async (division, district, upazila) => {
  try {
    const response = await axios.get(
      `${getBaseUrl()}/api/drive/folders/বাংলাদেশ/${division}/${district}/${upazila}/`
    );
    return response.data.folders || [];
  } catch (error) {
    console.error("Error fetching khatian types:", error);
    return [];
  }
};

export const fetchFiles = async (division, district, upazila, khatianType) => {
  try {
    const response = await axios.get(
      `${getBaseUrl()}/api/drive/folders/বাংলাদেশ/${encodeURIComponent(
        division
      )}/${encodeURIComponent(district)}/${encodeURIComponent(
        upazila
      )}/${encodeURIComponent(khatianType)}/`
    );

    const data = response.data;

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
    const response = await axios.get(`${getBaseUrl()}/counters/?depth=3`);
    return response.data.data.results.token;
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
};

export const AllSearchData = async (filename) => {
  try {
    const response = await axios.get(
      `${getBaseUrl()}/api/drive/search-file/?filename=${encodeURIComponent(
        filename
      )}`
    );

    // If you want pretty JSON formatting
    return JSON.stringify(response.data.files, null, 2) || [];
  } catch (error) {
    console.error("Error fetching search data:", error);
    return [];
  }
};