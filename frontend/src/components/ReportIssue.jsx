import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Camera,
  MapPin,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  LocateFixed,
  X,
} from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { categories } from "../data/mockData";
import { useAppStore } from "../store/useAppStore";

export function ReportIssue() {
  const navigate = useAppStore((state) => state.navigate);
  const selectedLocation = useAppStore((state) => state.selectedLocation);

  // 1. Core State Initialization
  const [image, setImage] = useState(null);
  // Dynamically start at Step 2 if location is already captured from the map
  const [step, setStep] = useState(selectedLocation ? 2 : 1);

  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [urgency, setUrgency] = useState("medium");
  const [submitted, setSubmitted] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // 2. Memory Cleanup for Image Preview
  useEffect(() => {
    return () => {
      if (image && image.startsWith("blob:")) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  // 3. Handlers
  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      // FIX: Use createObjectURL for instant, synchronous preview
      const previewUrl = URL.createObjectURL(file);
      setImage(previewUrl);
      setStep(2);
    }
  };

  const handleDetectLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          navigate("report-issue", { lat: latitude, lng: longitude });
          setIsLocating(false);
        },
        () => {
          alert("Could not detect location. Please use the map.");
          setIsLocating(false);
        }
      );
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      navigate("citizen-dashboard");
    }, 3000);
  };

  // SUCCESS VIEW
  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 transition-all duration-500">
        <Card className="max-w-md w-full p-8 text-center dark:border-slate-800 shadow-2xl">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 dark:border dark:border-green-500/30">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Report Submitted!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
            Our AI is cross-referencing your coordinates with Ward boundaries to
            assign a response team.
          </p>
          <div className="p-4 bg-blue-50/50 dark:bg-cyan-900/10 rounded-2xl text-left border border-blue-100 dark:border-cyan-500/20">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Latitude:</span>
                <span className="font-mono text-blue-600 dark:text-cyan-400 font-bold">
                  {selectedLocation?.lat.toFixed(6)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Longitude:</span>
                <span className="font-mono text-blue-600 dark:text-cyan-400 font-bold">
                  {selectedLocation?.lng.toFixed(6)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate("map-view")}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all text-slate-600 dark:text-slate-400"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Report New Issue
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 w-full flex-1">
        {/* Stepper */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold transition-all ${
                  step >= i
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                }`}
              >
                {i}
              </div>
              {i < 3 && (
                <div
                  className={`w-12 h-1 mx-2 rounded-full ${
                    step > i ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* STEP 1: INITIAL UPLOAD (Visible if no image exists) */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {selectedLocation && (
              <div className="flex items-center justify-center gap-2 py-2 px-4 bg-blue-600/10 border border-blue-500/20 rounded-full w-fit mx-auto shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                  Location Locked: {selectedLocation.lat.toFixed(4)},{" "}
                  {selectedLocation.lng.toFixed(4)}
                </span>
              </div>
            )}
            <Card className="p-16 text-center border-dashed border-2 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Camera className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                Evidence Upload
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
                Upload a clear photo. AI will scan the image to verify
                authenticity and classify the issue.
              </p>
              <label htmlFor="file-upload" className="cursor-pointer">
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  size="lg"
                  as="span"
                  className="px-10 py-6 rounded-2xl shadow-xl pointer-events-none"
                >
                  <Camera className="w-5 h-5 mr-3" /> Capture / Choose Photo
                </Button>
              </label>
            </Card>
          </div>
        )}

        {/* STEP 2: VERIFICATION & DETAILS */}
        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
            <Card className="p-6 dark:border-slate-800 border-2 border-blue-500/20 shadow-xl">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" /> Spatial
                Verification
              </h3>
              {selectedLocation ? (
                <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                  <div className="flex items-center gap-3 text-sm font-mono font-bold dark:text-white">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {selectedLocation.lat.toFixed(6)},{" "}
                    {selectedLocation.lng.toFixed(6)}
                  </div>
                  <button
                    onClick={() => navigate("map-view")}
                    className="text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1 hover:underline"
                  >
                    <RefreshCw className="w-3 h-3" /> Change Pin
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-16 flex flex-col gap-1 border-2"
                    onClick={handleDetectLocation}
                    disabled={isLocating}
                  >
                    <LocateFixed
                      className={`w-4 h-4 ${isLocating ? "animate-spin" : ""}`}
                    />
                    <span className="text-[10px] font-bold uppercase">
                      {isLocating ? "Detecting..." : "GPS Detect"}
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-16 flex flex-col gap-1 border-2"
                    onClick={() => navigate("map-view")}
                  >
                    <MapPin className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase">
                      Map Selector
                    </span>
                  </Button>
                </div>
              )}
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <Card className="p-2 relative group dark:border-slate-800 overflow-hidden rounded-3xl shadow-xl bg-slate-100 dark:bg-slate-900 min-h-[300px] flex items-center justify-center">
                {image ? (
                  <img
                    src={image}
                    className="w-full h-full object-cover rounded-2xl aspect-square transition-transform duration-700 group-hover:scale-110"
                    alt="Preview"
                  />
                ) : (
                  <div className="text-center text-slate-400">
                    <Camera className="w-10 h-10 mb-2 opacity-20 mx-auto" />
                    <label
                      htmlFor="file-upload-2"
                      className="cursor-pointer text-xs font-bold text-blue-600 hover:underline"
                    >
                      <input
                        id="file-upload-2"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      Add Photo
                    </label>
                  </div>
                )}
                {image && (
                  <button
                    onClick={() => {
                      setImage(null);
                      setStep(1);
                    }}
                    className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                  >
                    <X size={16} />
                  </button>
                )}
              </Card>

              <Card className="p-7 dark:border-slate-800 shadow-xl rounded-3xl space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Issue Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell the Ward Officer exactly what is happening..."
                  className="w-full bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-sm border border-slate-100 dark:border-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[160px]"
                />
                <Button
                  className="w-full h-14 mt-4 shadow-2xl shadow-blue-500/20 font-bold text-lg rounded-2xl"
                  disabled={!description.trim() || !selectedLocation || !image}
                  onClick={() => setStep(3)}
                >
                  Review & Submit
                </Button>
                {(!selectedLocation || !image) && description.trim() && (
                  <p className="text-[10px] text-red-500 mt-2 text-center font-bold italic animate-pulse">
                    * Photo and Location are required to proceed
                  </p>
                )}
              </Card>
            </div>
          </div>
        )}

        {/* STEP 3: FINAL REVIEW */}
        {step === 3 && (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <Card className="p-8 dark:border-slate-800 rounded-[2.5rem] shadow-2xl border-none overflow-hidden">
              <h2 className="font-black text-2xl dark:text-white mb-6 tracking-tighter italic">
                Submission Audit
              </h2>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <img
                  src={image}
                  className="w-40 h-40 object-cover rounded-[2rem] shadow-2xl border-4 border-white dark:border-slate-800"
                  alt="Final Review"
                />
                <div className="flex-1 space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      Description
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                      "{description}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-cyan-400 rounded-xl font-mono text-xs font-bold w-fit border border-blue-100 dark:border-blue-900/30">
                    <MapPin size={14} />
                    {selectedLocation.lat.toFixed(5)},{" "}
                    {selectedLocation.lng.toFixed(5)}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-blue-600 text-white shadow-2xl shadow-blue-600/30 rounded-3xl border-none">
              <div className="flex gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm self-start">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-lg">Spatial Cross-Reference</p>
                  <p className="text-xs text-blue-100 mt-1 leading-relaxed opacity-90">
                    Our GIS system will cross-reference these coordinates with
                    the Lucknow Ward database. Upon confirmation, the report
                    will be pushed to the relevant Officer's dashboard.
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex gap-4 pt-6 pb-10">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="flex-1 h-14 rounded-2xl font-bold border-2"
              >
                Edit Details
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-[2] h-14 text-xl font-black rounded-2xl shadow-2xl shadow-blue-600/40 tracking-tight"
              >
                Confirm & Send Report
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
