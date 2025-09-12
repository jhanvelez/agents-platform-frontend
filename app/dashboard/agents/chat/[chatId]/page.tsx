import ChatAgent from "./ChatAgent";

export default async function Page({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await params;
  return <ChatAgent chatId={chatId} />;
}
