"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface Tag {
  id: string;
  name: string;
  color: string;
}

interface TagManagerProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags: Tag[];
  onCreateTag: (name: string, color: string) => Promise<Tag>;
}

export function TagManager({
  selectedTags,
  onTagsChange,
  availableTags,
  onCreateTag
}: TagManagerProps) {
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#3b82f6");
  const [isCreating, setIsCreating] = useState(false);

  const handleTagToggle = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(id => id !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    
    try {
      const newTag = await onCreateTag(newTagName, newTagColor);
      onTagsChange([...selectedTags, newTag.id]);
      setNewTagName("");
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to create tag:", error);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {availableTags.map(tag => (
          <button
            key={tag.id}
            onClick={() => handleTagToggle(tag.id)}
            className={cn(
              "px-3 py-1 rounded-full text-sm font-medium transition-colors",
              selectedTags.includes(tag.id)
                ? "text-white"
                : "text-gray-700 bg-gray-100 hover:bg-gray-200"
            )}
            style={selectedTags.includes(tag.id) ? { backgroundColor: tag.color } : {}}
          >
            {tag.name}
          </button>
        ))}
        
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          {isCreating ? "Cancel" : "+ Add Tag"}
        </button>
      </div>

      {isCreating && (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Tag name"
            className="px-3 py-2 border rounded-md"
          />
          <input
            type="color"
            value={newTagColor}
            onChange={(e) => setNewTagColor(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer"
          />
          <button
            onClick={handleCreateTag}
            className="px-3 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Create
          </button>
        </div>
      )}
    </div>
  );
} 