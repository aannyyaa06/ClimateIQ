import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, CheckCircle, Clock, Plus } from "lucide-react";
import { toast } from "sonner";

interface MarineProject {
  Project_ID: number;
  Station_ID: string;
  Location: string;
  Latitude: number;
  Longitude: number;
  Mangrove_Cover_ha: number;
  Carbon_Sequestration_tCO2_per_ha_per_year: number;
  pH: number;
  Salinity_ppt: number;
  Dissolved_Oxygen_mg_L: number;
  Turbidity_NTU: number;
  Biodiversity_Index: number;
  Fish_Count: number;
  Timestamp: string;

  Status: string;
  Verification_Status: string;
}

export const RestorationProjects = () => {
  const [projects, setProjects] = useState<MarineProject[]>([]);
  const [loading, setLoading] = useState(false);

  // New project fields state
  const [newProject, setNewProject] = useState<Partial<MarineProject>>({
    Station_ID: "",
    Location: "",
    Latitude: 0,
    Longitude: 0,
    Mangrove_Cover_ha: 0,
    Carbon_Sequestration_tCO2_per_ha_per_year: 0,
    pH: 7,
    Salinity_ppt: 0,
    Dissolved_Oxygen_mg_L: 0,
    Turbidity_NTU: 0,
    Biodiversity_Index: 0,
    Fish_Count: 0,
    Timestamp: new Date().toISOString().slice(0, 10),
  });
  const [adding, setAdding] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: "1", limit: "20" });
      const res = await fetch(`http://127.0.0.1:5000/api/data?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setProjects(json.data || []);
    } catch {
      toast.error("Failed to load marine projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleVerify = async (id: number) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/verify/${id}`, { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      toast.success(data.message || "Project verified");
      fetchProjects();
    } catch {
      toast.error("Failed to verify project");
    }
  };

  const handleAddProject = async () => {
    if (!newProject.Station_ID || !newProject.Location) {
      toast.error("Station ID and Location are required");
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add project");
      }
      const data = await res.json();
      toast.success(data.message || "Project added successfully");
      fetchProjects();
      setNewProject({
        Station_ID: "",
        Location: "",
        Latitude: 0,
        Longitude: 0,
        Mangrove_Cover_ha: 0,
        Carbon_Sequestration_tCO2_per_ha_per_year: 0,
        pH: 7,
        Salinity_ppt: 0,
        Dissolved_Oxygen_mg_L: 0,
        Turbidity_NTU: 0,
        Biodiversity_Index: 0,
        Fish_Count: 0,
        Timestamp: new Date().toISOString().slice(0, 10),
      });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setAdding(false);
    }
  };

  const getStatusBadge = (status = "", verified = "") => {
    if (verified === "Verified")
      return (
        <Badge className="bg-green-600 text-white gap-1">
          <CheckCircle className="h-3 w-3" /> Verified
        </Badge>
      );
    if (status === "Active")
      return <Badge className="bg-blue-500 text-white gap-1">Active</Badge>;
    return (
      <Badge variant="outline" className="gap-1">
        <Clock className="h-3 w-3" /> Pending
      </Badge>
    );
  };

  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
      {/* Add New Project Form */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Plus className="inline-block" /> Add New Marine Project
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {[
            { label: "Station ID", key: "Station_ID", type: "text" },
            { label: "Location", key: "Location", type: "text" },
            { label: "Latitude", key: "Latitude", type: "number" },
            { label: "Longitude", key: "Longitude", type: "number" },
            { label: "Mangrove Cover (ha)", key: "Mangrove_Cover_ha", type: "number" },
            { label: "Carbon Sequestration (tCO2/ha/yr)", key: "Carbon_Sequestration_tCO2_per_ha_per_year", type: "number" },
            { label: "pH", key: "pH", type: "number" },
            { label: "Salinity (ppt)", key: "Salinity_ppt", type: "number" },
            { label: "Dissolved Oxygen (mg/L)", key: "Dissolved_Oxygen_mg_L", type: "number" },
            { label: "Turbidity (NTU)", key: "Turbidity_NTU", type: "number" },
            { label: "Biodiversity Index", key: "Biodiversity_Index", type: "number" },
            { label: "Fish Count", key: "Fish_Count", type: "number" },
            { label: "Timestamp", key: "Timestamp", type: "date" },
          ].map(({ label, key, type }) => (
            <div key={key} className="flex flex-col">
              <label className="text-sm font-medium mb-1">{label}</label>
              <input
                type={type}
                value={(newProject as any)[key] || ""}
                onChange={(e) =>
                  setNewProject((prev) => ({
                    ...prev,
                    [key]: type === "number" ? Number(e.target.value) : e.target.value,
                  }))
                }
                className="rounded border p-2 text-sm"
              />
            </div>
          ))}
        </div>
        <Button onClick={handleAddProject} disabled={adding}>
          {adding ? "Adding..." : "Add Project"}
        </Button>
      </div>

      {/* Projects Listing */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Marine Blue Carbon Projects</h3>
        <p className="text-sm text-muted-foreground">
          Verified and pending marine ecosystem restoration projects
        </p>
        {loading && (
          <p className="text-sm text-muted-foreground mt-2">Loading projects...</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {projects.length === 0 && !loading && (
          <p className="text-center text-muted-foreground col-span-full">
            No projects found.
          </p>
        )}
        {projects.map((p) => (
          <div
            key={p.Project_ID}
            className="rounded-lg border border-border/50 bg-white shadow hover:shadow-lg transition-shadow duration-300 flex flex-col overflow-hidden"
          >
            {/* Header with Location and Station ID with line break */}
            <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white text-center font-semibold py-4 text-lg">
              {"Location : " + (p.Location || "Marine Project")}<br />
              {"Station ID : " + (p.Station_ID || "Station ID")}
            </div>

            {/* Main detailed info in white card body */}
            <div className="p-4 flex flex-col gap-2 flex-grow overflow-auto">
              <div><strong>Latitude:</strong> {p.Latitude}</div>
              <div><strong>Longitude:</strong> {p.Longitude}</div>
              <div><strong>Mangrove Cover (ha):</strong> {p.Mangrove_Cover_ha}</div>
              <div><strong>pH:</strong> {p.pH}</div>
              <div><strong>Salinity (ppt):</strong> {p.Salinity_ppt}</div>
              <div><strong>Dissolved Oxygen (mg/L):</strong> {p.Dissolved_Oxygen_mg_L}</div>
              <div><strong>Turbidity (NTU):</strong> {p.Turbidity_NTU}</div>
              <div><strong>Biodiversity Index:</strong> {p.Biodiversity_Index}</div>
              <div><strong>Fish Count:</strong> {p.Fish_Count}</div>
              <div className="border-t border-border pt-3 mt-3 flex flex-col gap-1 text-sm text-muted-foreground">
                <div><strong>Carbon Sequestration (tCO₂/ha/yr):</strong> {p.Carbon_Sequestration_tCO2_per_ha_per_year}</div>
                <div><strong>Timestamp:</strong> {new Date(p.Timestamp).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Footer with status badge and verify button */}
            <div className="p-4 bg-gray-50 flex items-center justify-between">
              {getStatusBadge(p.Status, p.Verification_Status)}
              {p.Verification_Status !== "Verified" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleVerify(p.Project_ID)}
                >
                  Verify Project
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

