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
import { useAppStore } from "@/lib/store/useAppStore";
import { Navbar } from "@/components/layout/Navbar";
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
    { id: "all", label: "All" },
    { id: "notes", label: "Notes" },
    { id: "syllabus", label: "Syllabus" },
    { id: "pyq", label: "PYQs" },
    { id: "quiz", label: "Quizzes" },
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
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="px-4 pb-8 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Library</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Manage your study materials
                </p>
              </div>
              <Link href="/workspace">
                <Button className="w-full gap-2 sm:w-auto">
                  <Plus className="h-4 w-4" /> Upload New
                </Button>
              </Link>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="h-4 w-4" />
                      <span className="hidden sm:inline">Filter</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>By Date</DropdownMenuItem>
                    <DropdownMenuItem>By Subject</DropdownMenuItem>
                    <DropdownMenuItem>By Type</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex overflow-hidden rounded-lg border border-border">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className="h-9 w-9 rounded-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className="h-9 w-9 rounded-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Folders Section */}
            <div className="mb-6">
              <h2 className="mb-3 text-sm font-semibold text-foreground sm:mb-4 sm:text-base">
                Folders
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {folders.map((folder, index) => (
                  <motion.div
                    key={folder.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="cursor-pointer border-border/50 transition-all hover:border-foreground/20 hover:shadow-md">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center gap-3">
                          <div className={`rounded-lg p-2 ${folder.color}/10`}>
                            <Folder className={`h-4 w-4 sm:h-5 sm:w-5 ${folder.color.replace("bg-", "text-")}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">
                              {folder.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
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

            {/* Category Tabs */}
            <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className="shrink-0"
                >
                  {cat.label}
                </Button>
              ))}
            </div>

            {/* Files Section */}
            <AnimatePresence mode="wait">
              {viewMode === "grid" ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4"
                >
                  {filteredDocuments.map((doc, index) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="group border-border/50 transition-all hover:border-foreground/20 hover:shadow-md">
                        <CardContent className="p-4">
                          <div className="mb-3 flex items-start justify-between">
                            <div className="rounded-lg bg-muted/50 p-3">
                              {getFileIcon(doc.type)}
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" /> View
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" /> Download
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <h3 className="mb-1 truncate text-sm font-medium text-foreground">
                            {doc.name}
                          </h3>
                          <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDate(doc.uploadedAt)}
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Badge variant="secondary" className="text-xs">
                              {doc.subject}
                            </Badge>
                            {doc.tags?.slice(0, 1).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                <Tag className="mr-1 h-3 w-3" />
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
                            className="group flex items-center justify-between p-3 transition-colors hover:bg-muted/30 sm:p-4"
                          >
                            <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                              <div className="shrink-0 rounded-lg bg-muted/50 p-2">
                                {getFileIcon(doc.type)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="truncate text-sm font-medium text-foreground">
                                  {doc.name}
                                </h3>
                                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>{doc.subject}</span>
                                  <span className="hidden sm:inline">-</span>
                                  <span className="hidden sm:inline">{formatDate(doc.uploadedAt)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                              <Badge variant="secondary" className="hidden text-xs sm:inline-flex">
                                {doc.type}
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" /> View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Download className="mr-2 h-4 w-4" /> Download
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
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
                <div className="mb-4 rounded-full bg-muted/50 p-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-foreground">
                  No files found
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
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
          </motion.div>
        </div>
      </main>
    </div>
  );
}
