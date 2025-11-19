import TokensAgent from "./TokensAgent";

export default async function Page({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = await params;
  return <TokensAgent agentId={agentId} />;
}
