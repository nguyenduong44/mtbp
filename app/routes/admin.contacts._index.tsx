import { useState } from "react";
import {
  useContacts,
  useUpdateContactStatus,
  useDeleteContact,
} from "../hooks/useContact";
import {
  Trash2,
  Mail,
  Phone,
  Calendar,
  Search,
  MessageSquare,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

export default function ContactsPage() {
  const { data: contacts, isLoading, error } = useContacts();
  const updateStatus = useUpdateContactStatus();
  const deleteContact = useDeleteContact();
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) return <div className="animate-pulse">Đang tải...</div>;
  if (error) return <div>Lỗi: {error.message}</div>;

  const filteredContacts = contacts?.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.service?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            Mới
          </Badge>
        );
      case "read":
        return (
          <Badge className="bg-gray-100 text-gray-700 border-gray-200">
            Đã đọc
          </Badge>
        );
      case "replied":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            Đã trả lời
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Liên hệ</h1>
        <p className="text-gray-500 mt-1">
          Danh sách khách hàng tiềm năng gửi yêu cầu từ website.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm liên hệ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Khách hàng
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Dịch vụ
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Ngày gửi
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredContacts?.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">{c.name}</p>
                      <div className="flex flex-col gap-1">
                        <a
                          href={`mailto:${c.email}`}
                          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900"
                        >
                          <Mail size={12} /> {c.email}
                        </a>
                        {c.phone && (
                          <a
                            href={`tel:${c.phone}`}
                            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900"
                          >
                            <Phone size={12} /> {c.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MessageSquare size={14} className="text-gray-400" />
                      {c.service || "—"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {new Date(c.created_at).toLocaleDateString("vi-VN")}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={c.status}
                      onChange={(e) =>
                        updateStatus.mutate({
                          id: c.id,
                          status: e.target.value as "new" | "read" | "replied",
                        })
                      }
                      className="text-xs bg-transparent border-none focus:ring-0 cursor-pointer font-medium"
                    >
                      <option value="new">🆕 Mới</option>
                      <option value="read">📖 Đã đọc</option>
                      <option value="replied">✅ Đã trả lời</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteContact.mutate(c.id)}
                      className="hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredContacts?.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Không có liên hệ nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
