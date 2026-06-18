import { useParams, useNavigate } from "react-router";
import {
  useTasks,
  useUpdateTaskStatus,
  useDeleteTask,
} from "@/app/hooks/useTasks";
import { useState } from "react";
import TaskModal from "./TaskModal";
import { Loader2, ArrowLeft } from "lucide-react";
import { useClient } from "@/app/hooks/useClients";
import { Button } from "@/components/ui/button";

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const clientId = Number(id);
  const { data: client, isLoading: clientLoading } = useClient(clientId);
  const { data: tasks, isLoading: tasksLoading, refetch } = useTasks(clientId);
  const updateStatus = useUpdateTaskStatus();
  const deleteTask = useDeleteTask();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [targetStatus, setTargetStatus] = useState<"todo" | "doing" | "done">(
    "todo",
  );
  const [dragId, setDragId] = useState<number | null>(null);
  const [dragCol, setDragCol] = useState<string | null>(null);

  if (clientLoading || tasksLoading)
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (!client) return <div>Không tìm thấy khách hàng</div>;

  const groupedTasks = {
    todo: tasks?.filter((t) => t.status === "todo") || [],
    doing: tasks?.filter((t) => t.status === "doing") || [],
    done: tasks?.filter((t) => t.status === "done") || [],
  };

  const handleDragStart = (e: React.DragEvent, taskId: number, col: string) => {
    setDragId(taskId);
    setDragCol(col);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = async (e: React.DragEvent, newCol: string) => {
    e.preventDefault();
    if (!dragId || dragCol === newCol) return;
    await updateStatus.mutateAsync({
      id: dragId,
      status: newCol as any,
      clientId,
    });
    setDragId(null);
    setDragCol(null);
    refetch();
  };

  const handleDeleteTask = async (taskId: number) => {
    if (confirm("Xóa công việc?")) {
      await deleteTask.mutateAsync(taskId);
      refetch();
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate("/admin/clients")}
        className="flex items-center gap-2 text-blue-600 mb-4"
      >
        <ArrowLeft size={16} /> Quay lại
      </button>

      <div className="bg-blue-900 text-white p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-bold">{client.name}</h1>
        <div className="flex flex-wrap gap-6 mt-2 text-sm">
          <div>
            <span className="opacity-70">Loại hình:</span>{" "}
            {client.business_types?.name}
          </div>
          <div>
            <span className="opacity-70">Gói:</span>{" "}
            {client.service_packages?.name}
          </div>
          <div>
            <span className="opacity-70">Liên hệ:</span> {client.contact_person}
          </div>
          <div>
            <span className="opacity-70">Chi phí:</span>{" "}
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(Number(client.monthly_cost) || 0)}
          </div>
          {client.assigned_to && (
            <div>
              <span className="opacity-70">Phụ trách:</span>{" "}
              {client.assigned_to}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(["todo", "doing", "done"] as const).map((status) => (
          <div key={status} className="bg-gray-50 rounded-lg border p-3">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold uppercase text-sm">
                {status === "todo" && "📋 Cần làm"}
                {status === "doing" && "🔄 Đang làm"}
                {status === "done" && "✅ Đã hoàn thành"}
                <span className="ml-2 bg-gray-200 text-gray-600 px-2 rounded-full text-xs">
                  {groupedTasks[status].length}
                </span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingTask(null);
                  setTargetStatus(status);
                  setShowTaskModal(true);
                }}
              >
                ＋ Thêm
              </Button>
            </div>
            <div
              className="space-y-2 min-h-[200px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
            >
              {groupedTasks[status].map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id, status)}
                  className="bg-white p-3 rounded shadow border cursor-grab hover:border-blue-400 transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold">{task.title}</div>
                      {task.description && (
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {task.description}
                        </div>
                      )}
                      <div className="flex gap-3 mt-1 text-xs">
                        {task.deadline && (
                          <span className="text-gray-400">
                            📅{" "}
                            {new Date(task.deadline).toLocaleDateString(
                              "vi-VN",
                            )}
                          </span>
                        )}
                        {task.assigned_to && (
                          <span className="text-gray-400">
                            👤 {task.assigned_to}
                          </span>
                        )}
                        <span
                          className={`font-semibold ${
                            task.priority === "high"
                              ? "text-red-500"
                              : task.priority === "medium"
                                ? "text-yellow-500"
                                : "text-green-500"
                          }`}
                        >
                          {task.priority === "high" && "🔴 Cao"}
                          {task.priority === "medium" && "🟡 TB"}
                          {task.priority === "low" && "🟢 Thấp"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => {
                          setEditingTask(task);
                          setTargetStatus(status);
                          setShowTaskModal(true);
                        }}
                        className="text-xs text-gray-400 hover:text-blue-600 p-1"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-xs text-gray-400 hover:text-red-600 p-1"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <TaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        clientId={clientId}
        initialData={editingTask}
        defaultStatus={targetStatus}
        onSuccess={() => {
          setShowTaskModal(false);
          refetch();
        }}
      />
    </div>
  );
}
