import { useParams, useNavigate } from "react-router";
import {
  useTasks,
  useUpdateTaskStatus,
  useDeleteTask,
} from "@/app/hooks/useTasks";
import { useState } from "react";
import TaskModal from "./TaskModal";
import ClientModal from "./ClientModal";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";
import { useClient } from "@/app/hooks/useClients";
import { useCanViewRevenue } from "@/app/hooks/useCanViewRevenue";

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const clientId = Number(id);
  const {
    data: client,
    isLoading: clientLoading,
    refetch: refetchClient,
  } = useClient(clientId);
  const {
    data: tasks,
    isLoading: tasksLoading,
    refetch: refetchTasks,
  } = useTasks(clientId);
  const updateStatus = useUpdateTaskStatus();
  const deleteTask = useDeleteTask();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [targetStatus, setTargetStatus] = useState<"todo" | "doing" | "done">(
    "todo",
  );
  const [dragId, setDragId] = useState<number | null>(null);
  const [dragCol, setDragCol] = useState<string | null>(null);

  const canViewRevenue = useCanViewRevenue();

  if (clientLoading || tasksLoading)
    return (
      <div className="flex justify-center py-[80px]">
        <Loader2 className="animate-spin text-[var(--crm-navy)]" size={48} />
      </div>
    );
  if (!client)
    return (
      <div className="p-[40px] text-center text-[var(--crm-text-muted)]">
        <div className="text-[60px] opacity-25 mb-[16px]">⚠️</div>
        <h2 className="text-[18px] font-[700] text-[var(--crm-text)]">
          Không tìm thấy khách hàng
        </h2>
        <button
          onClick={() => navigate("/admin/crm")}
          className="mt-[24px] px-[20px] py-[10px] bg-[var(--crm-navy)] text-white rounded-[var(--crm-r)] font-[600]"
        >
          Quay lại Dashboard
        </button>
      </div>
    );

  const groupedTasks = {
    todo: tasks?.filter((t) => t.status === "todo") || [],
    doing: tasks?.filter((t) => t.status === "doing") || [],
    done: tasks?.filter((t) => t.status === "done") || [],
  };

  const handleDragStart = (e: React.DragEvent, taskId: number, col: string) => {
    setDragId(taskId);
    setDragCol(col);
    e.currentTarget.classList.add("opacity-40");
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("opacity-40");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("bg-[rgba(26,60,110,0.06)]");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("bg-[rgba(26,60,110,0.06)]");
  };

  const handleDrop = async (e: React.DragEvent, newCol: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-[rgba(26,60,110,0.06)]");
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
    if (confirm("Xóa công việc này?")) {
      await deleteTask.mutateAsync(taskId);
      refetch();
    }
  };

  const fmtDate = (s: string | null) => {
    if (!s) return "";
    const d = new Date(s);
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
  };

  return (
    <div className="max-w-[1440px] mx-auto">
      <button
        onClick={() => navigate("/admin/crm")}
        className="inline-flex items-center gap-[7px] text-[var(--crm-navy)] font-[600] text-[14px] cursor-pointer py-[6px] mb-[18px] hover:text-[var(--crm-navy-light)] transition-colors"
      >
        ← Quay lại Dashboard
      </button>

      {/* detail-head */}
      <div className="bg-[var(--crm-navy)] rounded-[var(--crm-r-lg)] p-[24px_28px] mb-[24px] text-white">
        <div className="flex justify-between items-start mb-[18px] gap-[12px]">
          <div>
            <div className="text-[26px] font-[800] line-height-[1.2]">
              {client.name}
            </div>
            <div className="inline-block bg-[rgba(200,150,62,0.25)] text-[var(--crm-gold-light)] px-[14px] py-[4px] rounded-[20px] text-[13px] font-[600] border border-[rgba(200,150,62,0.35)] mt-[8px]">
              {client.industries?.name || "Khác"}
            </div>
          </div>
          <div className="flex gap-[8px] flex-shrink-0">
            <button
              className="px-[20px] py-[10px] rounded-[var(--crm-r)] text-[14px] font-[600] border border-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.15)] transition-all flex items-center gap-2"
              onClick={() => setShowClientModal(true)}
            >
              ✏️ Sửa
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px]">
          <div>
            <div className="text-[11px] text-[rgba(255,255,255,0.55)] font-[600] uppercase tracking-[0.5px] mb-[4px]">
              Người liên hệ
            </div>
            <div className="text-[15px] font-[600]">
              {client.contact_person || "—"}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-[rgba(255,255,255,0.55)] font-[600] uppercase tracking-[0.5px] mb-[4px]">
              Điện thoại / Zalo
            </div>
            <div className="text-[15px] font-[600]">{client.phone || "—"}</div>
          </div>
          <div>
            <div className="text-[11px] text-[rgba(255,255,255,0.55)] font-[600] uppercase tracking-[0.5px] mb-[4px]">
              Gói dịch vụ
            </div>
            <div className="text-[15px] font-[600]">
              {client.service_packages?.name || "—"}
            </div>
          </div>
          {canViewRevenue && (
            <div>
              <div className="text-[11px] text-[rgba(255,255,255,0.55)] font-[600] uppercase tracking-[0.5px] mb-[4px]">
                Chi phí / tháng
              </div>
              <div className="text-[15px] font-[600] text-[var(--crm-gold-light)]">
                {new Intl.NumberFormat("vi-VN").format(
                  Number(client.monthly_cost) || 0,
                )}{" "}
                ₫
              </div>
            </div>
          )}
          {client.notes && (
            <div className="col-span-full mt-[8px] pt-[12px] border-t border-[rgba(255,255,255,0.15)]">
              <div className="text-[11px] text-[rgba(255,255,255,0.55)] font-[600] uppercase tracking-[0.5px] mb-[4px]">
                Ghi chú
              </div>
              <div className="text-[13px] font-[400] whitespace-pre-wrap">
                {client.notes}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
        {(["todo", "doing", "done"] as const).map((status) => (
          <div
            key={status}
            className="bg-[var(--crm-surface2)] rounded-[var(--crm-r-lg)] border border-[var(--crm-border)] overflow-hidden"
          >
            <div
              className={`p-[14px_16px] flex justify-between items-center bg-[var(--crm-surface)] border-b-[3px] ${
                status === "todo"
                  ? "border-[#94A3B8]"
                  : status === "doing"
                    ? "border-[var(--crm-gold)]"
                    : "border-[var(--crm-green)]"
              }`}
            >
              <div className="flex items-center gap-[8px] font-[700] text-[14px] text-[var(--crm-text)] uppercase">
                {status === "todo" && "📋 Cần làm"}
                {status === "doing" && "🔄 Đang làm"}
                {status === "done" && "✅ Đã hoàn thành"}
                <span className="bg-[var(--crm-border)] text-[var(--crm-text-muted)] px-[8px] py-[2px] rounded-[12px] text-[12px] font-[600]">
                  {groupedTasks[status].length}
                </span>
              </div>
              <button
                onClick={() => {
                  setEditingTask(null);
                  setTargetStatus(status);
                  setShowTaskModal(true);
                }}
                className="px-[14px] py-[7px] border border-[var(--crm-border)] rounded-[var(--crm-r)] text-[13px] font-[600] bg-white hover:border-[var(--crm-navy)] hover:text-[var(--crm-navy)] transition-all"
              >
                ＋ Thêm
              </button>
            </div>

            <div
              className="p-[12px] space-y-[10px] min-h-[320px] transition-all duration-150"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, status)}
            >
              {groupedTasks[status].map((task) => {
                const now = new Date();
                now.setHours(0, 0, 0, 0);
                let dlCls = "bg-[var(--crm-bg)] text-[var(--crm-text-muted)]";
                let dlIco = "🟢";
                if (task.deadline) {
                  const d = new Date(task.deadline);
                  d.setHours(0, 0, 0, 0);
                  const diff = Math.ceil((d.getTime() - now.getTime()) / 864e5);
                  if (diff < 0) {
                    dlCls = "bg-[var(--crm-red-bg)] text-[var(--crm-red)]";
                    dlIco = "🔴";
                  } else if (diff <= 3) {
                    dlCls =
                      "bg-[var(--crm-yellow-bg)] text-[var(--crm-yellow)]";
                    dlIco = "🟡";
                  }
                }

                return (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id, status)}
                    onDragEnd={handleDragEnd}
                    className="ticket bg-[var(--crm-surface)] rounded-[var(--crm-r)] border border-[var(--crm-border)] p-[13px_14px] cursor-grab shadow-[var(--crm-shadow)] hover:border-[var(--crm-navy)] hover:shadow-[var(--crm-shadow-md)] transition-all group relative"
                  >
                    <div className="flex items-center gap-[6px] mb-[7px]">
                      <div
                        className={`w-[8px] h-[8px] rounded-full ${
                          task.priority === "high"
                            ? "bg-[var(--crm-red)]"
                            : task.priority === "medium"
                              ? "bg-[var(--crm-yellow)]"
                              : "bg-[var(--crm-green)]"
                        }`}
                      />
                      <span
                        className={`text-[11px] font-[700] uppercase tracking-[0.5px] ${
                          task.priority === "high"
                            ? "text-[var(--crm-red)]"
                            : task.priority === "medium"
                              ? "text-[var(--crm-yellow)]"
                              : "text-[var(--crm-green)]"
                        }`}
                      >
                        {task.priority === "high"
                          ? "Cao"
                          : task.priority === "medium"
                            ? "Trung bình"
                            : "Thấp"}
                      </span>
                    </div>

                    <div className="text-[14px] font-[600] text-[var(--crm-text)] mb-[5px] leading-[1.4] line-clamp-2">
                      {task.title}
                    </div>

                    {task.description && (
                      <p className="text-[12px] text-[var(--crm-text-muted)] mb-[9px] line-clamp-2 leading-[1.5]">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      {task.deadline ? (
                        <span
                          className={`inline-flex items-center gap-[5px] px-[8px] py-[2px] rounded-[20px] text-[11px] font-[600] ${dlCls}`}
                        >
                          {dlIco} {fmtDate(task.deadline)}
                        </span>
                      ) : (
                        <span />
                      )}

                      <div className="flex gap-[4px] opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEditingTask(task);
                            setTargetStatus(status);
                            setShowTaskModal(true);
                          }}
                          className="w-[28px] h-[28px] border border-[var(--crm-border)] rounded-[6px] bg-white flex items-center justify-center hover:bg-[var(--crm-bg)] hover:border-[var(--crm-navy)] transition-all text-[13px]"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="w-[28px] h-[28px] border border-[var(--crm-border)] rounded-[6px] bg-white flex items-center justify-center hover:bg-[var(--crm-red-bg)] hover:border-[var(--crm-red)] transition-all text-[13px]"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                className="w-full p-[10px] border-2 border-dashed border-[var(--crm-border)] rounded-[var(--crm-r)] text-[var(--crm-text-muted)] text-[13px] font-[500] hover:border-[var(--crm-navy)] hover:text-[var(--crm-navy)] hover:bg-[rgba(26,60,110,0.03)] transition-all flex items-center justify-center gap-[6px]"
                onClick={() => {
                  setEditingTask(null);
                  setTargetStatus(status);
                  setShowTaskModal(true);
                }}
              >
                ＋ Thêm công việc
              </button>
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
          refetchTasks();
        }}
      />

      <ClientModal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        initialData={client}
        onSuccess={() => {
          setShowClientModal(false);
          refetchClient();
        }}
      />
    </div>
  );
}
