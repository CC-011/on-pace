"use client";
import { useEffect, useState } from "react";
import { db } from "../app/firebase";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  arrayUnion,
  deleteDoc,
} from "firebase/firestore";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MiniTask {
  id: string;
  name: string;
  done: boolean;
}

interface Task {
  id: string;
  name: string;
  endDate: string;
  miniTasks: MiniTask[];
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showMiniTask, setShowMiniTask] = useState(false);
  const [showMiniTaskName, setShowMiniTaskName] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const liveTasks: Task[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Task, "id">; // tell TS that data has all fields except id
        return {
          ...data,
          id: doc.id, // ✅ we place this last to guarantee it's the one we keep
        };
      });
      setTasks(liveTasks);
    });

    return () => unsub();
  }, []);

  const toggleMiniTask = async (taskId: string, miniTaskId: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            miniTasks: task.miniTasks.map((m) =>
              m.id === miniTaskId ? { ...m, done: !m.done } : m
            ),
          }
        : task
    );

    setTasks(updatedTasks);

    const taskRef = doc(db, "tasks", taskId);
    const updatedTask = updatedTasks.find((t) => t.id === taskId);
    if (updatedTask)
      await updateDoc(taskRef, { miniTasks: updatedTask.miniTasks });
  };

  const createMiniTask = (name: string) => ({
    id: crypto.randomUUID(),
    name,
    done: false,
  });

  const addTask = async () => {
    const miniTaskNames: string[] = showMiniTaskName ? [showMiniTaskName] : [];

    const newTask: Task = {
      id: crypto.randomUUID(),
      name: taskName,
      endDate: endDate,
      miniTasks: miniTaskNames.map(createMiniTask),
    };

    await setDoc(doc(db, "tasks", newTask.id), newTask);
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const addMiniTasksToExistingTask = async (
    taskId: string,
    newMiniTaskNames: string[]
  ) => {
    const newMiniTasks = newMiniTaskNames.map(createMiniTask);
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, miniTasks: [...task.miniTasks, ...newMiniTasks] }
          : task
      )
    );
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, {
      miniTasks: arrayUnion(...newMiniTasks),
    });
  };

  const removeTask = async (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    setShowMiniTaskName("");
    const taskRef = doc(db, "tasks", id);
    await deleteDoc(taskRef);
  };

  const removeMiniTask = async (taskId: string, miniTaskId: string) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) => {
        if (task.id === taskId) {
          const newMiniTasks = task.miniTasks.filter(
            (mt) => mt.id !== miniTaskId
          );
          const taskRef = doc(db, "tasks", taskId);
          updateDoc(taskRef, { miniTasks: newMiniTasks });
          return { ...task, miniTasks: newMiniTasks };
        }
        return task;
      });
      return updatedTasks;
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Task List</h1>
      <button
        onClick={addTask}
        className="px-3 py-1 bg-blue-500 text-white rounded-lg"
      >
        Add Task
      </button>
      {tasks.length === 0 && <p className="text-gray-500">No tasks yet.</p>}
      <>
        <Card className="w-full max-w-sm">
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Task name</Label>
                  <Input
                    id="email"
                    required
                    onChange={(e) => setTaskName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Start date</Label>
                  <div className="flex items-center">
                    <Input type="date" required />
                  </div>
                  <Label>
                    <>End date</>
                  </Label>
                  <div className="flex items-center">
                    <></>
                    <Input
                      type="date"
                      required
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full" onClick={addTask}>
              Add Task
            </Button>
          </CardFooter>
        </Card>
      </>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="p-4 rounded-2xl shadow-md bg-white border border-gray-200"
          >
            <div onClick={() => removeTask(task.id)}>X</div>
            <h2 className="text-xl font-semibold">{task.name}</h2>
            <p className="text-sm text-gray-500">End: {task.endDate}</p>
            <ul className="mt-3 space-y-2">
              {showMiniTask ? (
                <>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Task name</Label>

                      <Input
                        id="email"
                        required
                        onChange={(e) => setShowMiniTaskName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Start date</Label>
                      <div className="flex items-center">
                        <Input type="date" required />
                      </div>
                      <Label>
                        <>End date</>
                      </Label>
                      <div className="flex items-center">
                        <></>
                        <Input
                          type="date"
                          required
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      disabled={!selectedTaskId}
                      onClick={() => {
                        if (selectedTaskId) {
                          addMiniTasksToExistingTask(selectedTaskId, [
                            showMiniTaskName,
                          ]);
                        }
                        setShowMiniTask(!showMiniTask);
                      }}
                    >
                      Add Mini Task
                    </Button>
                  </div>
                </>
              ) : (
                <></>
              )}
              <Button
                type="submit"
                className="w-full"
                onClick={() => {
                  setShowMiniTask(!showMiniTask);
                  setSelectedTaskId(task.id);
                }}
              >
                show mini task menu
              </Button>
              {task.miniTasks.map((m) => (
                <li key={m.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={m.done}
                    onChange={() => toggleMiniTask(task.id, m.id)}
                  />
                  <span className={m.done ? "line-through text-gray-400" : ""}>
                    {m.name}
                  </span>
                  <Button
                    type="submit"
                    onClick={() => removeMiniTask(task.id, m.id)}
                  >
                    Remove MiniTask
                  </Button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
