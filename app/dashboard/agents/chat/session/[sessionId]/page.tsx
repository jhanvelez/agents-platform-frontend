import ChatAgent from "./ChatAgent";

export default async function Page({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  return <ChatAgent sessionId={sessionId} />;
}
