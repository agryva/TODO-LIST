import { FaTrash, FaPencilAlt } from "react-icons/fa";
import { Task } from "@/interfaces/task.interface";

interface TaskItemProps {
    task: Task;
    role: string
    onDelete: (id: string) => void;
    onEdit: (task: Task) => void;
}

const statusColors: any = {
    "NOT_STARTED": "bg-gray-300 text-gray-800",
    "ON_PROGRESS": "bg-blue-300 text-blue-800",
    "DONE": "bg-green-300 text-green-800",
    "REJECT": "bg-red-300 text-red-800",
};

const TaskItem: React.FC<TaskItemProps> = ({ task, role, onEdit, onDelete }) => {
    return (
        <div className="flex flex-col items-start gap-3 rounded-lg border p-4 text-left text-sm transition-all hover:bg-gray-100 bg-gray-50 w-full">
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-sm">
                        {task.user.name[0]}
                    </div>
                    <div>
                        <div className="font-semibold text-base">{task.title}</div>
                        <div className="text-xs text-gray-500">{task.description}</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <FaPencilAlt
                        className="h-4 w-4 text-gray-500 cursor-pointer hover:text-gray-700"
                        onClick={() => onEdit(task)}
                    />
                    {role === "lead" && (
                        <FaTrash
                            className="h-4 w-4 text-gray-500 cursor-pointer hover:text-red-600"
                            onClick={() => onDelete(task.id)}
                        />
                    )}

                </div>
            </div>
            <div className="flex flex-wrap gap-2">
                {task.task_members.map((member, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-gray-200 text-gray-800 text-xs rounded-md">{member.user.name}</span>
                ))}
            </div>
            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-md ${statusColors[task.status]}`}>
                {task.status.replace('_', ' ')}
            </span>
        </div>
    );
};

export default TaskItem;