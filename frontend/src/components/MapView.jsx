import { useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
  LayersControl,
} from "react-leaflet";
import L from "leaflet";
import { Filter, X, MapPin, List, Navigation } from "lucide-react";

import { Header } from "./Header";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Button } from "./Button";

import { mockIssues, categories } from "../data/mockData";
import { useAppStore } from "../store/useAppStore";
import { useAuthStore } from "../store/useAuthStore";

import "leaflet/dist/leaflet.css";

// --- Sub-Component: Map Events Handler ---
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
}

// --- Sub-Component: Map Controller ---
function MapController({ center }) {
  const map = useMap();
  if (center) {
    map.flyTo(center, 15, { duration: 1.5 });
  }
  return null;
}

// Custom Marker styling
const createCustomIcon = (color) =>
  new L.DivIcon({
    className: "custom-marker",
    html: `<div style="
    background-color: ${color}; 
    width: 20px; 
    height: 20px; 
    border-radius: 50%; 
    border: 3px solid white; 
    box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

export function MapView() {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [newIssueLocation, setNewIssueLocation] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  const navigate = useAppStore((state) => state.navigate);
  const viewIssue = useAppStore((state) => state.viewIssue);
  const userRole = useAuthStore((state) => state.userRole);
  const logout = useAuthStore((state) => state.logout);

  const defaultCenter = [26.8467, 80.9462]; // Lucknow

  const filteredIssues = useMemo(() => {
    return mockIssues.filter((issue) => {
      if (filterCategory && issue.category !== filterCategory) return false;
      if (filterPriority && issue.priority !== filterPriority) return false;
      return true;
    });
  }, [filterCategory, filterPriority]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#22c55e";
      default:
        return "#3b82f6";
    }
  };

  const handleLocationSelect = (lat, lng) => {
    setNewIssueLocation({ lat, lng });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
      <Header userRole={userRole} onLogout={logout} onNavigate={navigate} />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative z-0">
          <MapContainer
            center={defaultCenter}
            zoom={13}
            zoomControl={false}
            style={{ height: "100%", width: "100%" }}
          >
            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="Street View">
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />
              </LayersControl.BaseLayer>

              <LayersControl.BaseLayer name="Satellite View">
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution="Tiles &copy; Esri"
                />
              </LayersControl.BaseLayer>
            </LayersControl>

            <MapController
              center={
                selectedIssue
                  ? [selectedIssue.location.lat, selectedIssue.location.lng]
                  : null
              }
            />

            <MapClickHandler onLocationSelect={handleLocationSelect} />

            {filteredIssues.map((issue) => (
              <Marker
                key={issue.id}
                position={[issue.location.lat, issue.location.lng]}
                icon={createCustomIcon(getPriorityColor(issue.priority))}
                eventHandlers={{ click: () => setSelectedIssue(issue) }}
              />
            ))}

            {newIssueLocation && (
              <Marker
                position={[newIssueLocation.lat, newIssueLocation.lng]}
                icon={createCustomIcon("#3b82f6")}
              />
            )}
          </MapContainer>

          <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white/90 dark:bg-slate-800/90 backdrop-blur shadow-lg border-none hover:bg-white dark:hover:bg-slate-700 transition-all"
              variant="secondary"
            >
              <Filter className="w-4 h-4 mr-2" /> Filters
            </Button>
          </div>

          {newIssueLocation && (
            <Card className="absolute bottom-6 left-6 p-5 z-[1001] bg-white/95 dark:bg-slate-900/95 backdrop-blur border-blue-500 border-2 w-72 shadow-2xl animate-in fade-in slide-in-from-bottom-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                    Location Captured
                  </p>
                </div>
                <button
                  onClick={() => setNewIssueLocation(null)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                >
                  <X size={14} className="text-slate-500" />
                </button>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4 font-mono bg-slate-50 dark:bg-slate-800 p-2 rounded-md">
                {newIssueLocation.lat.toFixed(6)},{" "}
                {newIssueLocation.lng.toFixed(6)}
              </p>
              <Button
                size="sm"
                className="w-full text-xs font-bold shadow-lg shadow-blue-500/20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-none"
                onClick={() => navigate("report-issue", newIssueLocation)}
              >
                Report at this spot
              </Button>
            </Card>
          )}

          {showFilters && (
            <Card className="absolute top-16 left-4 w-72 p-5 z-[1001] shadow-2xl border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur animate-in fade-in zoom-in duration-150">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm dark:text-white text-slate-900">
                  Refine View
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                >
                  <X size={16} className="text-slate-500" />
                </button>
              </div>
              <div className="space-y-4 text-slate-900 dark:text-slate-100">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Category
                  </label>
                  <select
                    className="w-full p-2 text-sm rounded-md border dark:bg-slate-900 dark:border-slate-700 bg-white dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Priority
                  </label>
                  <select
                    className="w-full p-2 text-sm rounded-md border dark:bg-slate-900 dark:border-slate-700 bg-white dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                  >
                    <option value="">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <Button
                  variant="outline"
                  className="w-full text-xs"
                  onClick={() => {
                    setFilterCategory("");
                    setFilterPriority("");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </Card>
          )}
        </div>

        <div className="w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.05)]">
          {selectedIssue ? (
            <div className="p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between mb-6">
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase tracking-widest px-2.5 py-0.5"
                >
                  Case Detail
                </Badge>
                <button
                  onClick={() => setSelectedIssue(null)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X size={18} className="text-slate-500" />
                </button>
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                {selectedIssue.title}
              </h2>
              <div className="flex items-center gap-1.5 text-slate-500 mb-6 font-medium">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className="text-xs truncate">
                  {selectedIssue.location.address}
                </span>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1.5 tracking-tight">
                      Priority
                    </p>
                    <Badge priority={selectedIssue.priority} />
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1.5 tracking-tight">
                      Status
                    </p>
                    <Badge status={selectedIssue.status} />
                  </div>
                </div>

                <div className="p-4 bg-blue-50/40 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-800/30">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    "{selectedIssue.description}"
                  </p>
                </div>

                <Button
                  className="w-full h-12 shadow-xl shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all active:scale-[0.98]"
                  onClick={() => viewIssue(selectedIssue)}
                >
                  View Full Case File
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full bg-slate-50/20 dark:bg-slate-950/20">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Active Reports
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {filteredIssues.length} issues in view
                  </p>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <List className="w-5 h-5 text-slate-400" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredIssues.map((issue) => (
                  <Card
                    key={issue.id}
                    onClick={() => setSelectedIssue(issue)}
                    className="p-4 rounded-2xl border-white dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-blue-300 dark:hover:border-blue-500/50 cursor-pointer transition-all active:scale-[0.97]"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-sm line-clamp-1 flex-1 dark:text-white tracking-tight">
                        {issue.title}
                      </span>
                      <Badge
                        priority={issue.priority}
                        className="ml-2 scale-90 origin-right"
                      />
                    </div>
                    <div className="flex items-center text-[10px] text-slate-400 font-medium">
                      <MapPin className="w-3 h-3 mr-1 text-slate-300" />
                      <span className="truncate">{issue.location.address}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
