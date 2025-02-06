import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "../common/modal";
import { toast } from "sonner";
import TaskService from "@/services/task.service";
import { Task } from "@/interfaces/task.interface";

const baseSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().min(5, "Description must be at least 5 characters long"),
    status: z.enum(["Not Started", "On Progress", "Done", "Reject"]),
});

const createLeadSchema = baseSchema.extend({
    members: z.array(z.string()).min(1, "Select at least one user"),
});

const statusMap: { [key: string]: string } = {
    "Not Started": "NOT_STARTED",
    "On Progress": "ON_PROGRESS",
    "Done": "DONE",
    "Reject": "REJECT",
};


interface TaskFormProps {
    isOpen: boolean;
    onClose: () => void;
    mode: "create" | "edit";
    id?: string;
    initialData?: Task;
    role: "lead" | "member" | undefined;
}

const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, id, mode, initialData, role }) => {
    const schema = role === "lead" ? createLeadSchema : baseSchema;

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });

    const [availableMembers, setAvailableMembers] = useState<{ id: string, name: string, email: string }[]>([]);

    useEffect(() => {
        if (mode === "edit" && initialData) {
            reset({
                title: initialData.title,
                description: initialData.description,
                status: Object.keys(statusMap).find(key => statusMap[key] === initialData.status),
                members: initialData.task_members.map(member => member.user.id),
            });
        }
    }, [mode, initialData]);

    useEffect(() => {
        if (isOpen) {
            fetchMembers();
        }
    }, [isOpen]);

    const fetchMembers = async () => {
        try {
            const service = new TaskService();
            const membersData = await service.getMembers();
            setAvailableMembers(membersData);
        } catch (error) {
            toast.error("Failed to fetch members");
        }
    };

    const onSubmit = async (data: any) => {

        const service = new TaskService();
        const formattedData = {
            ...data,
            status: statusMap[data.status],
            members: data.members || initialData?.task_members.map(member => member.user.id),
        };

        try {
            if (mode === "create") {
                await service.create(formattedData);
                toast.success("Task created successfully");
            } else if (mode === "edit" && id) {
                await service.update(id, formattedData);
                toast.success("Task updated successfully");
            }
            onClose();
        } catch (error) {
            toast.error(`Failed to ${mode === "create" ? "create" : "update"} task`);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-semibold mb-4">{mode === "create" ? "Create Task" : "Edit Task"}</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label className="block text-sm font-medium">Title</label>
                    <input
                        type="text"
                        {...register("title")}
                        className="w-full p-2 border rounded-lg"
                        disabled={mode === "edit"}
                    />
                    {errors.title && <p className="text-red-500 text-sm">{String(errors.title.message)}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                        {...register("description")}
                        className="w-full p-2 border rounded-lg"
                        disabled={mode === "edit"}
                    />
                    {errors.description && <p className="text-red-500 text-sm">{String(errors.description.message)}</p>}
                </div>
                {role === "lead" && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Assign Users</label>
                        <div className="flex flex-wrap space-x-2">
                            {availableMembers.map(member => (
                                <div key={member.id} className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        value={member.id}
                                        {...register("members")}
                                        className="mr-2"
                                    />
                                    <label>{member.name}</label>
                                </div>
                            ))}
                        </div>
                        {errors.members && <p className="text-red-500 text-sm">{errors.members.message as string}</p>}
                    </div>
                )}
                <div className="mb-4">
                    <label className="block text-sm font-medium">Status</label>
                    <select
                        {...register("status")}
                        className="w-full p-2 border rounded-lg"
                    >
                        <option value="Not Started">Not Started</option>
                        <option value="On Progress">On Progress</option>
                        <option value="Done">Done</option>
                        <option value="Reject">Reject</option>
                    </select>
                    {errors.status && <p className="text-red-500 text-sm">{String(errors.status.message)}</p>}
                </div>
                <div className="flex justify-end">
                    <button type="button" onClick={onClose} className="mr-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg">
                        Cancel
                    </button>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                        {mode === "create" ? "Create" : "Save"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default TaskForm;