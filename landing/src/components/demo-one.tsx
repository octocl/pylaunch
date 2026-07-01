"use client";

import { InteractiveFolderGallery } from "@/components/ui/interactive-folder-gallery";

const DemoOne = () => {
  return (
    <div className="w-full min-h-[800px] bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
      <InteractiveFolderGallery />
    </div>
  );
};

export { DemoOne };
