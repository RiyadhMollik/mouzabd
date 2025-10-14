/**
 * Survey Type Pricing API Service
 */
import { getBaseUrl } from '../baseurls';

/**
 * Get all survey type pricing
 * @returns {Promise<Object>} Survey pricing data
 */
export const getSurveyPricing = async () => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/survey-pricing/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching survey pricing:', error);
    throw error;
  }
};

/**
 * Calculate price based on survey type and file count
 * @param {string} surveyType - Survey type code (SA_RS, CS, BS, etc.)
 * @param {number} fileCount - Number of files
 * @returns {Promise<Object>} Calculated pricing
 */
export const calculateSurveyPrice = async (surveyType, fileCount) => {
  try {
    console.log('📡 Calling survey pricing API:', { surveyType, fileCount });
    
    const url = `${getBaseUrl()}/api/survey-pricing/calculate/`;
    console.log('API URL:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        survey_type: surveyType,
        file_count: fileCount,
      }),
    });

    console.log('API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Survey Pricing Response:', data);
    return data;
  } catch (error) {
    console.error('❌ Error calculating survey price:', error);
    throw error;
  }
};

/**
 * Extract survey type from file path or khatian type
 * @param {string} khatianType - Khatian type string (e.g., "SA_RS", "CS", "BS")
 * @returns {string} Survey type code
 */
export const extractSurveyType = (khatianType) => {
  if (!khatianType) return 'SA_RS'; // Default

  const normalized = khatianType.toUpperCase().trim();
  
  // Check for exact matches (order matters - check longer strings first)
  if (normalized === 'SA_RS' || normalized === 'SA/RS') return 'SA_RS';
  if (normalized === 'RS_BS' || normalized === 'RS/BS') return 'RS_BS';
  if (normalized === 'BS_RS' || normalized === 'BS/RS') return 'BS_RS';
  if (normalized === 'CS_SA' || normalized === 'CS/SA') return 'CS_SA';
  if (normalized === 'SA_CS' || normalized === 'SA/CS') return 'SA_CS';
  if (normalized === 'DIYARA' || normalized === 'দিয়ারা') return 'DIYARA';
  if (normalized === 'CS') return 'CS';
  if (normalized === 'BS') return 'BS';
  if (normalized === 'SA') return 'SA';
  if (normalized === 'RS') return 'RS';

  // Check if contains (check combinations first)
  if (normalized.includes('RS') && normalized.includes('BS')) return 'RS_BS';
  if (normalized.includes('BS') && normalized.includes('RS')) return 'BS_RS';
  if (normalized.includes('CS') && normalized.includes('SA')) return 'CS_SA';
  if (normalized.includes('SA') && normalized.includes('CS')) return 'SA_CS';
  if (normalized.includes('SA') && normalized.includes('RS')) return 'SA_RS';
  if (normalized.includes('DIYARA') || normalized.includes('দিয়ারা')) return 'DIYARA';
  if (normalized.includes('CS')) return 'CS';
  if (normalized.includes('BS')) return 'BS';
  if (normalized.includes('SA')) return 'SA';
  if (normalized.includes('RS')) return 'RS';

  return 'SA_RS'; // Default fallback
};

/**
 * Get survey type from file full path
 * @param {string} fullPath - Full path of the file
 * @returns {string} Survey type code
 */
export const getSurveyTypeFromPath = (fullPath) => {
  if (!fullPath) return 'SA_RS';

  const pathParts = fullPath.split('/');
  
  // Usually survey type is the last folder before the file
  // Example: "মৌজা ম্যাপ ফাইল/ঢাকা বিভাগ/মুন্সিগঞ্জ/শ্রীনগর/RS/file.jpg"
  if (pathParts.length >= 2) {
    const potentialSurveyType = pathParts[pathParts.length - 2];
    return extractSurveyType(potentialSurveyType);
  }

  return 'SA_RS'; // Default
};

export default {
  getSurveyPricing,
  calculateSurveyPrice,
  extractSurveyType,
  getSurveyTypeFromPath,
};
