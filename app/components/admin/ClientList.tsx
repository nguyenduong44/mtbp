// app/components/admin/ClientList.tsx
import { useState } from "react";
import { Link } from "react-router";
import { useClients, useDeleteClient } from "../../hooks/useClients";
import { Plus, Edit, Trash2, Search, Building2 } from "lucide-react";
import { Button } from "../../../components/ui/button";

export default function ClientList() {
  const { data: clients, isLoading, error } = useClients();
  const deleteClient = useDeleteClient();
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) return <div className="animate-pulse">Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const filtered = clients?.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.industry?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Khách hàng</h1>
          <p className="text-gray-500">Danh sách khách hàng và đối tác</p>
        </div>
        <Button asChild>
          <Link to="/admin/clients/new">
            <Plus size={18} /> Thêm mới
          </Link>
        </Button>
      </div>
      <div className="mb-6 relative max-w-sm">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border rounded-xl"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered?.map((client) => (
          <div
            key={client.id}
            className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-xl transition"
          >
            <div className="flex justify-between items-start">
              <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
                {client.logo ? (
                  <img
                    src={client.logo}
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <Building2 size={24} className="text-gray-300" />
                )}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/admin/clients/${client.id}/edit`}>
                    <Edit size={16} />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteClient.mutate(client.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
            <h3 className="font-bold mt-3">{client.name}</h3>
            <p className="text-sm text-gray-500">
              {client.industry || "Chưa cập nhật"}
            </p>
          </div>
        ))}
        {filtered?.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            Không tìm thấy khách hàng nào.
          </div>
        )}
      </div>
    </div>
  );
}
