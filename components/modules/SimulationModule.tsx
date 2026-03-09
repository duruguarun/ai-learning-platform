"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PlayCircle, Pause, RotateCcw, ChevronRight, Atom, Binary, Cpu, Network, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store/useAppStore";

const simulations = [
  {
    id: "sorting",
    title: "Sorting Algorithm Visualization",
    description: "Watch how different sorting algorithms work step by step",
    icon: Binary,
    color: "bg-blue-500",
    difficulty: "Beginner",
  },
  {
    id: "tree-traversal",
    title: "Tree Traversal",
    description: "Visualize inorder, preorder, and postorder traversals",
    icon: Network,
    color: "bg-green-500",
    difficulty: "Intermediate",
  },
  {
    id: "neural-network",
    title: "Neural Network Forward Pass",
    description: "See how data flows through a neural network",
    icon: Cpu,
    color: "bg-purple-500",
    difficulty: "Advanced",
  },
  {
    id: "atomic-structure",
    title: "Atomic Structure",
    description: "Explore electron orbitals and atomic models",
    icon: Atom,
    color: "bg-orange-500",
    difficulty: "Intermediate",
  },
  {
    id: "stack-operations",
    title: "Stack Operations",
    description: "Push, pop, and peek operations visualized",
    icon: Layers,
    color: "bg-red-500",
    difficulty: "Beginner",
  },
];

// Simple sorting visualization component
function SortingVisualization({ speed }: { speed: number }) {
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90, 45, 78, 33]);
  const [sorting, setSorting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);

  const maxValue = Math.max(...array);

  const resetArray = () => {
    setArray([64, 34, 25, 12, 22, 11, 90, 45, 78, 33]);
    setSorting(false);
    setCurrentIndex(-1);
    setSortedIndices([]);
  };

  const startSort = async () => {
    setSorting(true);
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setCurrentIndex(j);
        await new Promise(resolve => setTimeout(resolve, 1000 / speed));
        
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
        }
      }
      setSortedIndices(prev => [...prev, n - i - 1]);
    }
    setSortedIndices(prev => [...prev, 0]);
    setSorting(false);
    setCurrentIndex(-1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-center gap-1 h-48">
        {array.map((value, index) => (
          <motion.div
            key={index}
            className={cn(
              "w-8 rounded-t transition-colors",
              currentIndex === index || currentIndex === index + 1
                ? "bg-yellow-500"
                : sortedIndices.includes(index)
                ? "bg-green-500"
                : "bg-primary"
            )}
            style={{ height: `${(value / maxValue) * 100}%` }}
            initial={false}
            animate={{ height: `${(value / maxValue) * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        ))}
      </div>
      
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={resetArray}
          disabled={sorting}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          onClick={sorting ? () => {} : startSort}
          disabled={sorting}
          className="gap-2"
        >
          {sorting ? (
            <>
              <Pause className="h-4 w-4" />
              Sorting...
            </>
          ) : (
            <>
              <PlayCircle className="h-4 w-4" />
              Start Bubble Sort
            </>
          )}
        </Button>
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>Bubble Sort compares adjacent elements and swaps them if they are in wrong order.</p>
      </div>
    </div>
  );
}

export function SimulationModule() {
  const [selectedSimulation, setSelectedSimulation] = useState<string | null>(null);
  const [speed, setSpeed] = useState([5]);

  const { addWorkflowStep } = useAppStore();

  const handleSelectSimulation = (simId: string) => {
    setSelectedSimulation(simId);
    
    addWorkflowStep({
      id: `simulation-${Date.now()}`,
      title: `Simulation: ${simulations.find(s => s.id === simId)?.title}`,
      type: "simulation",
      status: "active",
    });
  };

  const selectedSim = simulations.find(s => s.id === selectedSimulation);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500">
            <PlayCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Interactive Simulations</h2>
            <p className="text-sm text-muted-foreground">
              Learn through interactive visualizations
            </p>
          </div>
        </div>
      </div>

      {/* Simulation Selection */}
      {!selectedSimulation && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {simulations.map((sim) => (
            <motion.div
              key={sim.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card
                className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
                onClick={() => handleSelectSimulation(sim.id)}
              >
                <CardHeader className="pb-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${sim.color}`}>
                    <sim.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="mt-4 text-base">{sim.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-xs">
                    {sim.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {sim.difficulty}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Active Simulation */}
      {selectedSimulation && selectedSim && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${selectedSim.color}`}>
                    <selectedSim.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>{selectedSim.title}</CardTitle>
                    <CardDescription>{selectedSim.description}</CardDescription>
                  </div>
                </div>
                <Badge variant="outline">{selectedSim.difficulty}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Speed Control */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Speed:</span>
                <Slider
                  value={speed}
                  onValueChange={setSpeed}
                  min={1}
                  max={10}
                  step={1}
                  className="w-32"
                />
                <span className="text-sm font-medium">{speed[0]}x</span>
              </div>

              {/* Simulation Content */}
              <div className="rounded-lg border border-border bg-muted/30 p-6">
                {selectedSimulation === "sorting" && (
                  <SortingVisualization speed={speed[0]} />
                )}
                
                {selectedSimulation !== "sorting" && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className={`flex h-20 w-20 items-center justify-center rounded-full ${selectedSim.color}/20`}>
                      <selectedSim.icon className={`h-10 w-10 ${selectedSim.color.replace('bg-', 'text-')}`} />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">{selectedSim.title}</h3>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                      This simulation is a placeholder. In the full version, you would see an
                      interactive visualization of {selectedSim.title.toLowerCase()}.
                    </p>
                    <Button className="mt-4 gap-2">
                      <PlayCircle className="h-4 w-4" />
                      Start Simulation
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => setSelectedSimulation(null)}
          >
            Back to Simulations
          </Button>
        </motion.div>
      )}
    </div>
  );
}

export default SimulationModule;
