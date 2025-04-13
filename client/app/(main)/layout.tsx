import ChatSidebar from "@/components/ChatSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" flex h-screen bg-black text-white">
      <ChatSidebar />
      <main className="items-center space-x-4 p-6">{children}</main>
    </div>
  );
}
