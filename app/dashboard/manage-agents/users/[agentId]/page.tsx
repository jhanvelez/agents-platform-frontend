import DocumentsClient from "./DocumentsAgent";

export default async function Page({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = await params;
  return <DocumentsClient agentId={agentId} />;
}
