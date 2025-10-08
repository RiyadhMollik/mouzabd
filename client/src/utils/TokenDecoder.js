export const decodeToken = (token) => {
  try {
    // JWT tokens are split into three parts: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    // The payload is the second part, Base64 encoded
    const payload = parts[1];
    
    // Decode Base64
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    
    // Parse the JSON
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};