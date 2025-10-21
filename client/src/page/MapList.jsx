import React, { useContext, useState, useEffect, useRef, useMemo } from 'react';
import { AuthContext } from '../provider/AuthProvider';
import MapModal from '../component/shared/MapModal';
import { getBaseUrl } from '../utils/baseurls';

// Function to decode JWT token
const decodeToken = (token) => {
  try {
    if (!token) return null;
    const cleanToken = token.replace('Bearer ', '');
    const parts = cleanToken.split('.');
    if (parts.length !== 3) throw new Error('Invalid token format');
    const payload = parts[1];
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    const decoded = atob(paddedPayload);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export default function MapList() {
  const { user, userdata, loading: authLoading } = useContext(AuthContext) || {};
  const [maps, setMaps] = useState([]);
  const [filteredMaps, setFilteredMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [decodedToken, setDecodedToken] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMap, setSelectedMap] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // prevent multiple fetch for same token
  const fetchedForToken = useRef(null);

  // memoized token (so dependency is stable)
  const token = useMemo(
    () => user?.token || userdata?.token || localStorage.getItem('token'),
    [user, userdata]
  );

  const fetchMaps = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!token) throw new Error('No authentication token found');

      const decoded = decodeToken(token);
      setDecodedToken(decoded);

      const response = await fetch(`${getBaseUrl()}/user-files-batch/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      const mapsData = data.files || data.maps || data || [];
      setMaps(mapsData);
      setFilteredMaps(mapsData);
    } catch (err) {
      console.error('Error fetching maps:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch maps once per token (fixes Google sign-in repeated calls)
  useEffect(() => {
    if (authLoading) return; // wait until auth is ready (if you expose loading)
    if (token && fetchedForToken.current !== token) {
      fetchedForToken.current = token;
      fetchMaps();
    }
  }, [token, authLoading]); // token changes only when real token changes

  // Listen for "maps:refresh" custom event (auto update after package purchase)
  useEffect(() => {
    const handler = () => {
      if (token) fetchMaps();
    };
    window.addEventListener('maps:refresh', handler);
    return () => window.removeEventListener('maps:refresh', handler);
  }, [token]);

  // Search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredMaps(maps);
      return;
    }
    const term = searchTerm.toLowerCase().trim();
    const filtered = maps.filter((map) => {
      const name = (map.name || map.title || map.filename || '').toString().toLowerCase();
      const description = (map.description || '').toString().toLowerCase();
      const id = (map.id || '').toString().toLowerCase();
      const type = (map.type || map.file_type || '').toString().toLowerCase();
      const status = (map.payment_status || '').toString().toLowerCase();
      let tags = '';
      if (map.tags) {
        tags = Array.isArray(map.tags)
          ? map.tags.join(' ').toLowerCase()
          : map.tags.toString().toLowerCase();
      }
      return `${name} ${description} ${id} ${type} ${status} ${tags}`.includes(term);
    });
    setFilteredMaps(filtered);
  }, [searchTerm, maps]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const clearSearch = () => setSearchTerm('');

  const handleViewMap = (map) => {
    setSelectedMap(map);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedMap(null);
  };

  // Loading state
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 p-4 md:p-8">
        <div className="container mx-auto">
          <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 md:p-6 border-b border-gray-200">
              <h1 className="text-lg md:text-xl font-semibold text-gray-900">My Maps</h1>
            </div>
            <div className="p-8 md:p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 text-sm md:text-base mt-4">Loading maps...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 p-4 md:p-8">
        <div className="container mx-auto">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <h1 className="text-lg md:text-xl font-semibold text-gray-900">My Maps</h1>
            </div>
            <div className="p-8 md:p-12 text-center">
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-600 text-sm md:text-base mb-4">Error: {error}</p>
              <button
                onClick={fetchMaps}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-lg md:text-xl font-semibold text-gray-900">My Maps</h1>
              <div className="relative flex-1 sm:max-w-[250px]">
                <input
                  type="text"
                  placeholder="Search maps..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="block w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            {searchTerm && (
              <div className="mt-3 text-sm text-gray-600">
                {filteredMaps.length > 0
                  ? `Found ${filteredMaps.length} map${filteredMaps.length !== 1 ? 's' : ''} matching "${searchTerm}"`
                  : `No maps found matching "${searchTerm}"`}
                <button onClick={clearSearch} className="ml-2 text-blue-600 hover:text-blue-800 underline">
                  Clear search
                </button>
              </div>
            )}
          </div>

          {/* Desktop table header */}
          <div className="hidden md:grid md:grid-cols-3 gap-4 p-4 md:p-6 pb-3 border-b border-gray-200">
            <div className="text-base font-medium text-gray-700">Map</div>
            <div className="text-base font-medium text-gray-700 text-center">Payment Status</div>
            <div className="text-base font-medium text-gray-700 text-right">Action</div>
          </div>

          {/* List */}
          {filteredMaps.length === 0 ? (
            <div className="p-8 md:p-12 text-center">
              <p className="text-gray-500 text-sm md:text-base mb-2">
                {searchTerm ? 'No maps found matching your search' : 'No maps available'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredMaps.map((map, index) => (
                <div key={map.id || index} className="p-4 md:p-6">
                  {/* Mobile */}
                  <div className="md:hidden space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {map.name || map.title || map.filename || `Map ${index + 1}`}
                        </p>
                        {map.description && (
                          <p className="text-xs text-gray-500 mt-1">
                            {map.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-orange-800">
                        {map.payment_status || 'paid'}
                      </span>
                      <button
                        onClick={() => handleViewMap(map)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </div>

                  {/* Desktop */}
                  <div className="hidden md:grid md:grid-cols-3 gap-4 items-center">
                    <div className="min-w-0">
                      <p className="text-base font-medium text-gray-900 truncate">
                        {map.name || map.title || map.filename || `Map ${index + 1}`}
                      </p>
                      {map.description && (
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {map.description}
                        </p>
                      )}
                    </div>
                    <div className="text-center">
                      <span className="inline-flex px-2 py-1 text-base font-medium rounded-full bg-green-100 text-orange-800">
                        {map.payment_status || 'paid'}
                      </span>
                    </div>
                    <div className="text-right">
                      <button
                        onClick={() => handleViewMap(map)}
                        className="text-blue-600 hover:text-blue-800 text-lg font-medium"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && selectedMap && (
        <MapModal selectedMap={selectedMap} closeModal={closeModal} />
      )}
    </div>
  );
}
