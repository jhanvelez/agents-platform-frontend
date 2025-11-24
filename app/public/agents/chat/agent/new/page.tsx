import ChatNew from "./ChatNew";

export default async function Page({ params }: { params: { agentId: string } }) {

  console.log(params.agentId);

  return <ChatNew agentId={params.agentId} />;
}
