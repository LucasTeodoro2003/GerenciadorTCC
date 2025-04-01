"use client";

import { updateUser } from "@/shared/lib/actionsUpdateUser";
import { User } from "@prisma/client";
import { CircleX } from "lucide-react";
import { useState, useTransition } from "react";

export default function PageUsers({ users }: { users: User[] }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userList, setUserList] = useState(users);
  const [isPending, startTransition] = useTransition();

  const handlePermissionChange = (userId: string, newPermission: number) => {
    setUserList((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, permission: newPermission } : user
      )
    );

    if (selectedUser?.id === userId) {
      setSelectedUser((prev) =>
        prev ? { ...prev, permission: newPermission } : null
      );
    }
  };

  const handleUpdateUser = (userId: string, newPermission: number) => {
    startTransition(async () => {
      try {
        await updateUser(userId, newPermission);
      } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
      }
    });
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-300 dark:bg-opacity-10 rounded-lg shadow-md transition-all">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Gerenciador de Usuários
        </h2>
        <button onClick={() => setSelectedUser(null)}>
          <CircleX className="w-4 h-4 text-red-500" />
        </button>
      </div>

      <ul
        className="border dark:border-gray-600 rounded-lg overflow-y-auto mb-4"
        style={{ maxHeight: "120px" }}
      >
        {userList.map((user) => (
          <li
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className={`p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
              selectedUser?.id === user.id ? "bg-gray-300 dark:bg-gray-600" : ""
            }`}
          >
            {user.name} (
            {user.permission === 1
              ? "Admin"
              : user.permission === 2
              ? "Funcionário"
              : "Cliente"}
            )
          </li>
        ))}
      </ul>

      {selectedUser && (
        <div className="p-4 border dark:border-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Usuário: {selectedUser.name}
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            Email: {selectedUser.email}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Permissão Atual:{" "}
            <span className="ml-2 font-bold">
              {selectedUser.permission === 1
                ? "Administrador"
                : selectedUser.permission === 2
                ? "Funcionário"
                : "Cliente"}
            </span>
          </p>

          <label className="block mt-2 text-gray-900 dark:text-white">
            Alterar Permissão:
          </label>
          <select
            value={selectedUser.permission}
            onChange={(e) =>
              handlePermissionChange(selectedUser.id, Number(e.target.value))
            }
            className="mt-1 p-2 border rounded w-full bg-white dark:bg-gray-600 dark:text-white dark:border-gray-600"
          >
            <option value={1}>Administrador</option>
            <option value={2}>Funcionário</option>
            <option value={3}>Cliente</option>
          </select>

          <div className="mt-4 flex justify-center space-x-4 row-span-4">
            <button
              onClick={() =>
                handleUpdateUser(selectedUser.id, selectedUser.permission)
              }
              disabled={isPending}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors dark:bg-green-600 dark:hover:bg-green-700"
            >
              {isPending ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
