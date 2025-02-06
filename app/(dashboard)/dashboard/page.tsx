'use client'
import { Header, TaskForm, TaskItem } from "@/components";
import { useState, useEffect, useRef } from "react";
import TaskService from "@/services/task.service";
import { Task } from "@/interfaces/task.interface";
import useAuthStore from "@/stores/auth.store";

const Dashboard = () => {
    const { user } = useAuthStore();

    const [activeTab, setActiveTab] = useState<any>("NOT_STARTED");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const taskEdit = useRef<Task | undefined>(undefined);

    const fetchTasks = async (status?: string) => {
        try {
            const taskService = new TaskService();
            const data = await taskService.getTasks(status);
            setTasks(data);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        }
    };

    useEffect(() => {
        fetchTasks(activeTab);
    }, []);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        fetchTasks(tab);
    };

    const handleAddTask = () => {
        taskEdit.current = undefined;
        setIsModalOpen(true);
    };

    const handleDeleteTask = async (id: string) => {
        if (confirm("Are you sure you want to delete this task?")) {
            try {
                const taskService = new TaskService();
                await taskService.delete(id);
                fetchTasks(activeTab);
            } catch (error) {
                console.error("Failed to delete task:", error);
            }
        }
    };
    console.log("user?.roleuser?.roleuser?.role", user?.role)
    return (
        <>
            <Header />
            <main className="p-4">
                <div className="w-full border border-gray-200 bg-gray-50 rounded-t-xl sticky top-0">
                    <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
                        <ul className="flex flex-wrap -mb-px">
                            {["NOT_STARTED", "ON_PROGRESS", "DONE", "REJECT"].map((tab) => (
                                <li key={tab} className="me-2">
                                    <button
                                        onClick={() => handleTabChange(tab)}
                                        className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === tab ? "text-blue-600 border-blue-600" : "border-transparent hover:text-gray-600 hover:border-gray-300"}`}
                                    >
                                        {tab.replace('_', ' ')}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col gap-4 bg-white border-gray-200 border-x border-b p-4 overflow-y-auto">
                    {tasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <p className="text-lg">No tasks available</p>
                            <p className="text-sm">Add a new task to get started</p>
                        </div>
                    ) : (
                        tasks.map((task, index) => (
                            <TaskItem
                                key={index}
                                task={task}
                                onDelete={handleDeleteTask}
                                role={user?.role === 'LEAD' ? 'lead' : 'member'}
                                onEdit={(task) => {
                                    taskEdit.current = task;
                                    setIsModalOpen(true);
                                }}
                            />
                        ))
                    )}
                </div>

                {user?.role === 'LEAD' && (
                    <button
                        onClick={handleAddTask}
                        className="fixed bottom-[3rem] right-[2rem] w-12 h-12 shadow-md bg-blue-600 text-white rounded-full hover:bg-blue-700 flex items-center justify-center text-2xl"
                    >
                        +
                    </button>
                )}



                <TaskForm
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false)
                        taskEdit.current = undefined;
                        fetchTasks(activeTab);
                    }}
                    id={taskEdit.current?.id}
                    mode={taskEdit.current ? "edit" : "create"}
                    role={taskEdit.current ? (user?.role === 'LEAD' ? 'lead' : 'member') : 'lead'}
                    initialData={taskEdit.current || undefined}
                />
            </main>
        </>
    );
};

export default Dashboard;