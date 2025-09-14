import ChangePassword from "./ChangePassword";

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <ChangePassword token={token} />;
}
