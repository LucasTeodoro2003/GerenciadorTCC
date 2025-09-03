"use client";

import { updateUser } from "@/shared/lib/actionsUpdateUser";
import { User } from "@prisma/client";
import {
  CircleX,
  ChevronDown,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { revalidatePath } from "next/cache";
import { useState, useTransition } from "react";

export default function PageUsers({ users }: { users: User[] }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userList, setUserList] = useState(users);
  const [isPending, startTransition] = useTransition();
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const USERS_PER_PAGE = 5;

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
    revalidatePath("/dashboard");
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

  const filteredUsers = userList.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    currentPage * USERS_PER_PAGE,
    (currentPage + 1) * USERS_PER_PAGE
  );

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-300 dark:bg-opacity-10 rounded-lg shadow-md transition-all max-w-xl mx-auto">
      {/* Header com título e busca */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Gerenciador de Usuários
        </h2>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Buscar nome ou email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0);
            }}
            className="w-full p-2 pr-10 border rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          <Search className="w-4 h-4 absolute right-3 top-3 text-gray-500" />
        </div>
      </div>

      {/* Accordion */}
      <button
        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
        className="flex items-center justify-between w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white mb-2 transition"
      >
        <span className="font-medium">Usuários</span>
        <ChevronDown
          className={`w-5 h-5 transform transition-transform duration-200 ${
            isAccordionOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {isAccordionOpen && (
        <div className="mb-4 h-64 flex flex-col justify-between">
          {/* Paginação */}
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 0}
              className={`p-2 rounded ${
                currentPage === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <ChevronLeft />
            </button>
            <button
              onClick={goToNextPage}
              disabled={currentPage >= totalPages - 1}
              className={`p-2 rounded ${
                currentPage >= totalPages - 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <ChevronRight />
            </button>
          </div>

          {/* Lista fixa */}
          <div className="flex-1 overflow-hidden">
            <ul className="border dark:border-gray-600 rounded-lg h-full overflow-hidden flex flex-col">
              {paginatedUsers.map((user) => (
                <li
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`p-2 flex-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                    selectedUser?.id === user.id
                      ? "bg-gray-300 dark:bg-gray-600"
                      : ""
                  }`}
                >
                  {user.name} ({user.email})
                </li>
              ))}

              {paginatedUsers.length === 0 && (
                <li className="p-2 text-gray-500 dark:text-gray-400 text-sm">
                  Nenhum usuário encontrado.
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Drawer lateral */}
      {selectedUser && (
        <div className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg border-l dark:border-gray-700 p-4 flex flex-col transition-transform duration-300 z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedUser.name}
            </h3>
            <button onClick={() => setSelectedUser(null)}>
              <CircleX className="w-5 h-5 text-red-500" />
            </button>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-2">
            📧 {selectedUser.email}
          </p>

          <div className="mb-4">
            <span className="block text-gray-900 dark:text-white font-medium mb-1">
              Permissão:
            </span>
            <select
              value={selectedUser.permission}
              onChange={(e) =>
                handlePermissionChange(selectedUser.id, Number(e.target.value))
              }
              className="p-2 border rounded w-full bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value={1}>Administrador</option>
              <option value={2}>Funcionário</option>
              <option value={3}>Cliente</option>
            </select>
          </div>

          <button
            onClick={() =>
              handleUpdateUser(selectedUser.id, selectedUser.permission)
            }
            disabled={isPending}
            className="mt-auto bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors dark:bg-green-600 dark:hover:bg-green-700"
          >
            {isPending ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      )}
    </div>
  );
}
