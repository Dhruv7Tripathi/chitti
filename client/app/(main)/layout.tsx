import ChatSidebar from "@/components/ChatSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <ChatSidebar />
      <main className="flex-1 p-4 bg-gray-100">{children}</main>
    </div>
  );
}