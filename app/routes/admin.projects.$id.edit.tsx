// app/routes/admin/projects.$id.edit.tsx
import { useParams } from "react-router";
import { useProject } from "../hooks/useProjects";
import ProjectForm from "../components/admin/ProjectForm";
import { Loader2 } from "lucide-react";

export default function EditProject() {
  const { id } = useParams();
  const { data: project, isLoading, error } = useProject(Number(id));
  if (isLoading)
    return (
      <div className="flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (error || !project)
    return <div className="text-center py-12">Không tìm thấy dự án</div>;
  return <ProjectForm initialData={project} isEditing={true} />;
}
