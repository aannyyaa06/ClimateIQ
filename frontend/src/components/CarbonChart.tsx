import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export const CarbonChart = () => {
  const [data, setData] = useState<
    { month: string; digital: number; offset: number }[]
  >([
    // Initial empty or placeholder data
    { month: "Jan", digital: 0, offset: 0 },
    { month: "Feb", digital: 0, offset: 0 },
    { month: "Mar", digital: 0, offset: 0 },
    { month: "Apr", digital: 0, offset: 0 },
    { month: "May", digital: 0, offset: 0 },
    { month: "Jun", digital: 0, offset: 0 },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCarbonData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/carbonchart");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchCarbonData();
  }, []);

  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Carbon Footprint Trend</h3>
        <p className="text-sm text-muted-foreground">
          Your digital emissions vs. offset over the past 6 months
        </p>
        {loading && (
          <p className="text-sm text-muted-foreground mt-1">Loading data...</p>
        )}
        {error && (
          <p className="text-sm text-destructive mt-1">Error: {error}</p>
        )}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorDigital" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(0, 80%, 60%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(0, 80%, 60%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorOffset" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(120, 70%, 40%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(120, 70%, 40%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 10%, 70%)" opacity={0.3} />
          <XAxis
            dataKey="month"
            stroke="hsl(210, 10%, 50%)"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            stroke="hsl(210, 10%, 50%)"
            style={{ fontSize: "12px" }}
            label={{
              value: "CO₂ (tons)",
              angle: -90,
              position: "insideLeft",
              style: { fill: "hsl(210, 10%, 50%)" },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(0, 0%, 100%)",
              border: "1px solid hsl(210, 10%, 70%)",
              borderRadius: "8px",
              boxShadow: "var(--shadow-medium)",
            }}
          />
          <Area
            type="monotone"
            dataKey="digital"
            stroke="hsl(0, 80%, 60%)"
            strokeWidth={2}
            fill="url(#colorDigital)"
            name="Digital Emissions"
          />
          <Area
            type="monotone"
            dataKey="offset"
            stroke="hsl(120, 70%, 40%)"
            strokeWidth={2}
            fill="url(#colorOffset)"
            name="Carbon Offset"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-sm text-muted-foreground">Digital Emissions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-600" />
          <span className="text-sm text-muted-foreground">Carbon Offset</span>
        </div>
      </div>
    </Card>
  );
};




// import { Card } from "@/components/ui/card";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

// const data = [
//   { month: "Jan", digital: 3.2, offset: 1.8 },
//   { month: "Feb", digital: 3.1, offset: 2.0 },
//   { month: "Mar", digital: 2.9, offset: 2.2 },
//   { month: "Apr", digital: 2.7, offset: 2.5 },
//   { month: "May", digital: 2.5, offset: 2.8 },
//   { month: "Jun", digital: 2.4, offset: 3.0 },
// ];

// export const CarbonChart = () => {
//   return (
//     <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
//       <div className="mb-6">
//         <h3 className="text-xl font-semibold mb-2">Carbon Footprint Trend</h3>
//         <p className="text-sm text-muted-foreground">
//           Your digital emissions vs. offset over the past 6 months
//         </p>
//       </div>
      
//       <ResponsiveContainer width="100%" height={300}>
//         <AreaChart data={data}>
//           <defs>
//             <linearGradient id="colorDigital" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
//               <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
//             </linearGradient>
//             <linearGradient id="colorOffset" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
//               <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
//             </linearGradient>
//           </defs>
//           <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
//           <XAxis 
//             dataKey="month" 
//             stroke="hsl(var(--muted-foreground))"
//             style={{ fontSize: '12px' }}
//           />
//           <YAxis 
//             stroke="hsl(var(--muted-foreground))"
//             style={{ fontSize: '12px' }}
//             label={{ value: 'CO₂ (tons)', angle: -90, position: 'insideLeft', style: { fill: 'hsl(var(--muted-foreground))' } }}
//           />
//           <Tooltip 
//             contentStyle={{ 
//               backgroundColor: 'hsl(var(--card))',
//               border: '1px solid hsl(var(--border))',
//               borderRadius: '8px',
//               boxShadow: 'var(--shadow-medium)'
//             }}
//           />
//           <Area 
//             type="monotone" 
//             dataKey="digital" 
//             stroke="hsl(var(--destructive))" 
//             strokeWidth={2}
//             fill="url(#colorDigital)"
//             name="Digital Emissions"
//           />
//           <Area 
//             type="monotone" 
//             dataKey="offset" 
//             stroke="hsl(var(--success))" 
//             strokeWidth={2}
//             fill="url(#colorOffset)"
//             name="Carbon Offset"
//           />
//         </AreaChart>
//       </ResponsiveContainer>
      
//       <div className="flex items-center justify-center gap-6 mt-4">
//         <div className="flex items-center gap-2">
//           <div className="w-3 h-3 rounded-full bg-destructive" />
//           <span className="text-sm text-muted-foreground">Digital Emissions</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="w-3 h-3 rounded-full bg-success" />
//           <span className="text-sm text-muted-foreground">Carbon Offset</span>
//         </div>
//       </div>
//     </Card>
//   );
// };
