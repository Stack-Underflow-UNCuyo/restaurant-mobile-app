"use client";
import React from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";

interface DeletionConfirmationPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  description?: string;
  isLoading?: boolean;
}

export default function DeletionConfirmationPopUp({
  isOpen,
  onClose,
  onConfirm,
  description = "¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.",
  isLoading = false,
}: DeletionConfirmationPopUpProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-sm p-6">
      <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
        Confirmar eliminación
      </h4>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
      <div className="flex justify-end gap-3">
        <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          size="sm"
          className="bg-error-500 hover:bg-error-600 text-white"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? "Eliminando…" : "Eliminar"}
        </Button>
      </div>
    </Modal>
  );
}
