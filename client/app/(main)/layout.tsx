import "../globals.css";
// import ChatSidebar from "@/components/chatsidebar";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div>
        {/* <ChatSidebar /> */}
        <main className="">{children}</main>
      </div>
    </div>
  );
}