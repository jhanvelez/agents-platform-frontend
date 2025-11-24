import IframeConfig from "./IframeConfig";

export default async function Page({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = await params;
  return <IframeConfig agentId={agentId} />;
}