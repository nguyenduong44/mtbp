import { useParams } from "react-router";
import { useClient } from "../hooks/useClients";
import ClientForm from "../components/admin/ClientForm";
import { Loader2 } from "lucide-react";

export default function EditClient() {
  const { id } = useParams();
  const { data: client, isLoading, error } = useClient(Number(id));
  if (isLoading)
    return (
      <div className="flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (error || !client)
    return <div className="text-center py-12">Không tìm thấy khách hàng</div>;
  return <ClientForm initialData={client} isEditing={true} />;
}
