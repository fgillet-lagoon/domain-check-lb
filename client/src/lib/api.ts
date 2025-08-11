const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
const API_KEY = import.meta.env.VITE_API_KEY || "default_api_key";

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `ApiKey ${API_KEY}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  getPackages: () => apiRequest("/packages"),
  checkDomain: (domain: string) => apiRequest(`/check?domain=${encodeURIComponent(domain)}`),
  bookDomain: (bookingData: any) => apiRequest("/book", {
    method: "POST",
    body: JSON.stringify(bookingData),
  }),
  getBookings: () => apiRequest("/bookings"),
};
