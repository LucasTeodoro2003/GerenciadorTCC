export const executeActionDB = async ({ actionFn }: { actionFn: () => Promise<void> }) => {
  try {
    await actionFn();
    return { success: true, message: "Operação realizada com sucesso" };
  } catch (error: any) {
    console.error("Erro na operação do banco de dados:", error);
      return { 
      success: false, 
      message: error?.message || "An error has occurred during executing the action"
    };
  }
};