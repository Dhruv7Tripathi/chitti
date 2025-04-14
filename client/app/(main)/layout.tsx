// import ChatSidebar from "@/components/ChatSidebar";

// export default function Layout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className=" flex h-screen bg-black text-white">
//       <ChatSidebar />
//       <main className="items-center space-x-4 p-6">{children}</main>
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import ChatSidebar from "@/components/ChatSidebar";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomScrollArea } from "@/components/ui/custom-scroll-area";

export default function Layout({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Listen for the custom event from ChatRoom component
    const handleToggleSidebar = () => {
      setSidebarOpen(prev => !prev);
    };

    document.addEventListener('toggle-mobile-sidebar', handleToggleSidebar);

    return () => {
      document.removeEventListener('toggle-mobile-sidebar', handleToggleSidebar);
    };
  }, []);

  return (
    <div className="flex h-screen bg-black text-white">
      {!isMobile ? (
        // Desktop version - sidebar always visible
        <div className="w-64 border-r border-neutral-900">
          <ChatSidebar />
        </div>
      ) : (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-full sm:w-80 bg-neutral-950 text-white border-neutral-900">
            <div className="flex justify-end p-4">
              <SheetClose asChild>
                <Button variant="ghost" size="icon">
                  <X size={20} className="text-neutral-400" />
                </Button>
              </SheetClose>
            </div>
            <CustomScrollArea className="h-[calc(100vh-80px)]">
              <ChatSidebar onSelectChat={() => setSidebarOpen(false)} />
            </CustomScrollArea>
          </SheetContent>
        </Sheet>
      )}

      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}