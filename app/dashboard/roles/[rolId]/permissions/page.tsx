import PermissionRol from "./PermissionRol";

export default async function Page({ params }: { params: Promise<{ rolId: string }> }) {
  const { rolId } = await params;
  return <PermissionRol rolId={rolId} />;
}
