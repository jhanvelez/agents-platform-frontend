import ChatAgent from "../session/[sessionId]/ChatAgent";
import ChatNew from "../agent/new/ChatNew";

export default async function Page({ params }: { params: { slug: string[] } }) {
  const { slug } = await params;
  const [first, second] = slug;

  if (first === "new") {
    const agentId = second;
    return <ChatNew agentId={agentId} />;
  } else {
    const sessionId = second;
    return <ChatAgent sessionId={sessionId} />;
  }
}
