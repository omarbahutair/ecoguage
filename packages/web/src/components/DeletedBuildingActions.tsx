import React, { useCallback, useState } from 'react';
import Modal from './Modal';
import DeleteForm from './DeleteForm';
import AreYouSureForm from './AreYouSureForm';
import { apiClient } from '../util/apiClient';

interface DeletedBuildingActionsProps {
  building: Record<string, any>;
  onDeleteSucess?: () => void;
  onRestoreSuccess?: () => void;
}

export default function DeletedBuildingActions({
  building,
  onDeleteSucess,
  onRestoreSuccess,
}: DeletedBuildingActionsProps) {
  const [modals, setModals] = useState({
    restore: false,
    delete: false,
  });

  const onRestore = useCallback(
    async (setIsLoading: (isLoading: boolean) => void) => {
      try {
        setIsLoading(true);

        await apiClient.put(`manage-deleted-buildings/${building.id}`);
        onRestoreSuccess?.();
      } catch {
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return (
    <div className="flex flex-wrap gap-1">
      <button
        onClick={() => {
          setModals((prev) => ({ ...prev, restore: true }));
        }}
        className="bg-primary-fade text-white flex items-center gap-3 px-3 py-1.5 rounded"
      >
        <i className="fa-solid fa-trash-arrow-up" />
        <p>RESTORE</p>
      </button>
      <button
        onClick={() => {
          setModals((prev) => ({ ...prev, delete: true }));
        }}
        className="bg-red-500 text-white flex items-center gap-3 px-3 py-1.5 rounded"
      >
        <i className="fa-solid fa-trash" />
      </button>
      <Modal
        isOpen={modals.restore}
        onClose={() => {
          setModals((prev) => ({ ...prev, restore: false }));
        }}
      >
        <AreYouSureForm
          confirmText="RESTORE"
          onCancel={() => {
            setModals((prev) => ({ ...prev, restore: false }));
          }}
          onConfirm={onRestore}
          title={`Restore ${building.name}?`}
        />
      </Modal>
      <Modal
        isOpen={modals.delete}
        onClose={() => {
          setModals((prev) => ({ ...prev, delete: false }));
        }}
      >
        <DeleteForm
          deletePath={`/buildings/${building.id}/hard`}
          title={`Delete ${building.name}?`}
          onCancel={() => {
            setModals((prev) => ({ ...prev, delete: false }));
          }}
          onSucess={() => {
            setModals((prev) => ({ ...prev, delete: false }));
            onDeleteSucess?.();
          }}
        />
      </Modal>
    </div>
  );
}
