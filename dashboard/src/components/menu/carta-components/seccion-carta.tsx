"use client";
import React, { ReactNode, useState } from "react";
import { PencilIcon, PlusIcon, TrashBinIcon } from "@/icons";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import MenuArtIndividualFormComp, { type MenuIndividualFormData } from "./menu-individual-form-comp";
import MenuComboFormComp from "./menu-combo-form-comp";
import type { Menu } from "@/types/entities";
import { API_BASE_URL } from "@/lib/constants";

type Props = {
  titulo?: string;
  categorias?: string[];
  imagenUrl?: string;
  children?: ReactNode;
  onAddIndividual?: (data: MenuIndividualFormData) => Promise<void>;
  onAddCombo?: (savedCombo: Menu) => Promise<void>;
  onEdit?: () => void;
  onDelete?: () => void;
};

const SeccionCartaComp: React.FC<Props> = ({
  titulo = "Sección Entradas",
  categorias = ["Entrada", "Carnes", "Compartidos"],
  imagenUrl,
  children,
  onAddIndividual,
  onAddCombo,
  onEdit,
  onDelete,
}) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [isAddingIndividual, setIsAddingIndividual] = useState(false);
  const [isAddingCombo, setIsAddingCombo] = useState(false);

  const handleSelectIndividual = () => {
    closeModal();
    setIsAddingIndividual(true);
  };

  const handleSelectCombo = () => {
    closeModal();
    setIsAddingCombo(true);
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {imagenUrl && (
                <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-white/[0.05]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${API_BASE_URL}${imagenUrl}`} alt={titulo} className="w-full h-full object-cover" />
                </div>
              )}
              <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                {titulo}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onEdit} className="text-gray-400 hover:text-brand-500 transition-colors">
                <PencilIcon />
              </button>
              <button onClick={onDelete} className="text-gray-400 hover:text-error-500 transition-colors">
                <TrashBinIcon />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {categorias.map((cat, index) => (
              <span
                key={index}
                className="px-3 py-0.5 border border-gray-300 rounded-full text-xs text-gray-600 dark:border-white/[0.15] dark:text-gray-400"
              >
                {cat}
              </span>
            ))}
            <button className="flex items-center justify-center w-6 h-6 border border-gray-300 rounded-full text-gray-400 hover:text-brand-500 hover:border-brand-500 transition-colors dark:border-white/[0.15] dark:text-gray-400">
              <PlusIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 p-5">
          {children}
          {isAddingIndividual && (
            <MenuArtIndividualFormComp
              onSave={async (data) => { await onAddIndividual?.(data); setIsAddingIndividual(false); }}
              onCancel={() => setIsAddingIndividual(false)}
            />
          )}
          {isAddingCombo && (
            <MenuComboFormComp
              onSuccess={async (savedCombo) => { await onAddCombo?.(savedCombo); setIsAddingCombo(false); }}
              onCancel={() => setIsAddingCombo(false)}
            />
          )}
        </div>

        <div className="flex justify-center px-5 pb-5">
          <Button size="sm" variant="outline" startIcon={<PlusIcon />} onClick={openModal}>
            Agregar Detalle Menu
          </Button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-sm p-6">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          Seleccione el tipo de detalle a crear
        </h4>
        <div className="flex gap-3 mb-6">
          <Button className="flex-1" onClick={handleSelectIndividual}>
            Individual
          </Button>
          <Button className="flex-1" variant="outline" onClick={handleSelectCombo}>
            Menú
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default SeccionCartaComp;
