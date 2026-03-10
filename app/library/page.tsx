"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Folder,
  Search,
  Grid,
  List,
  Filter,
  SortAsc,
  Download,
  Trash2,
  MoreVertical,
  Plus,
  Clock,
  Tag,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/lib/store/useAppStore";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import Link from "next/link";

type ViewMode = "grid" | "list";

export default function LibraryPage() {
  const documents = useAppStore((state) => state.documents);
  const fetchDocuments = useAppStore((state) => state.fetchDocuments);
  const setActivePage = useAppStore((state) => state.setActivePage);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    if (setActivePage) setActivePage("library");
    if (fetchDocuments) fetchDocuments();
  }, [fetchDocuments, setActivePage]);

  const categories = [
    { id: "all", label: "All Files", count: documents.length },
    { id: "notes", label: "Notes", count: documents.filter((d) => d.type === "notes").length },
    { id: "syllabus", label: "Syllabus", count: documents.filter((d) => d.type === "syllabus").length },
    { id: "pyq", label: "PYQs", count: documents.filter((d) => d.type === "pyq").length },
    { id: "quiz", label: "Quizzes", count: documents.filter((d) => d.type === "quiz").length },
  ];

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const folders = [
    { name: "Physics", count: 12, color: "bg-blue-500" },
    { name: "Chemistry", count: 8, color: "bg-emerald-500" },
    { name: "Mathematics", count: 15, color: "bg-violet-500" },
    { name: "Biology", count: 6, color: "bg-amber-500" },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case "notes":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "syllabus":
        return <Folder className="h-5 w-5 text-emerald-500" />;
      case "pyq":
        return <FileText className="h-5 w-5 text-violet-500" />;
      case "quiz":
        return <FileText className="h-5 w-5 text-amber-500" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Library</h1>
                <p className="text-muted-foreground">
                  Manage and organize your study materials
                </p>
              </div>
              <Link href="/workspace">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" /> Upload New
                </Button>
              </Link>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" /> Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>By Date</DropdownMenuItem>
                    <DropdownMenuItem>By Subject</DropdownMenuItem>
                    <DropdownMenuItem>By Type</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <SortAsc className="h-4 w-4" /> Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
                    <DropdownMenuItem>Name (Z-A)</DropdownMenuItem>
                    <DropdownMenuItem>Date (Newest)</DropdownMenuItem>
                    <DropdownMenuItem>Date (Oldest)</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex border border-border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className="rounded-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className="rounded-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Folders Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Folders</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {folders.map((folder, index) => (
                  <motion.div
                    key={folder.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="border-border/50 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${folder.color}/10`}>
                            <Folder className={`h-5 w-5 ${folder.color.replace("bg-", "text-")}`} />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{folder.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {folder.count} files
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Files Section */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="mb-4">
                {categories.map((cat) => (
                  <TabsTrigger key={cat.id} value={cat.id} className="gap-2">
                    {cat.label}
                    <Badge variant="secondary" className="text-xs">
                      {cat.count}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={selectedCategory}>
                <AnimatePresence mode="wait">
                  {viewMode === "grid" ? (
                    <motion.div
                      key="grid"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    >
                      {filteredDocuments.map((doc, index) => (
                        <motion.div
                          key={doc.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <Card className="border-border/50 hover:border-primary/30 hover:shadow-md transition-all group">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="p-3 rounded-lg bg-muted/50">
                                  {getFileIcon(doc.type)}
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Eye className="h-4 w-4 mr-2" /> View
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Download className="h-4 w-4 mr-2" /> Download
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">
                                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              <h3 className="font-medium text-foreground mb-1 truncate">
                                {doc.name}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                <Clock className="h-3 w-3" />
                                {formatDate(doc.uploadedAt)}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  {doc.subject}
                                </Badge>
                                {doc.tags?.slice(0, 1).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    <Tag className="h-3 w-3 mr-1" />
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="list"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Card className="border-border/50">
                        <CardContent className="p-0">
                          <div className="divide-y divide-border">
                            {filteredDocuments.map((doc, index) => (
                              <motion.div
                                key={doc.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors group"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="p-2 rounded-lg bg-muted/50">
                                    {getFileIcon(doc.type)}
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-foreground">
                                      {doc.name}
                                    </h3>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                      <span>{doc.subject}</span>
                                      <span>-</span>
                                      <span>{formatDate(doc.uploadedAt)}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {doc.type}
                                  </Badge>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem>
                                        <Eye className="h-4 w-4 mr-2" /> View
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Download className="h-4 w-4 mr-2" /> Download
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="text-destructive">
                                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {filteredDocuments.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="p-4 rounded-full bg-muted/50 mb-4">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No files found
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {searchQuery
                        ? "Try adjusting your search query"
                        : "Upload your first document to get started"}
                    </p>
                    <Link href="/workspace">
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" /> Upload File
                      </Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
