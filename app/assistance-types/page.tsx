"use client";

import { useMemo, useState } from "react";
import NavBar from "@/components/Navbar";
import Loader from "@/components/Loader";
import {
  AssistanceTypePayload,
  useMutationCreateAssistanceType,
  useMutationDeleteAssistanceType,
  useMutationUpdateAssistanceType,
  useQueryGetAllAssistanceTypes,
} from "@/api/assistanceType";
import { AssistanceType } from "@/types/assistance_type";

const emptyPayload: AssistanceTypePayload = {
  name: "",
  extraFieldLabel: "",
  extraFieldPlaceholder: "",
  extraFieldRequired: false,
  isActive: true,
};

function mapTypeToPayload(type: AssistanceType): AssistanceTypePayload {
  return {
    name: type.name,
    isActive: type.isActive ?? true,
    extraFieldLabel: type.extraFieldLabel ?? "",
    extraFieldPlaceholder: type.extraFieldPlaceholder ?? "",
    extraFieldRequired: Boolean(type.extraFieldRequired),
  };
}

export default function AssistanceTypesPage() {
  const assistanceTypesQuery = useQueryGetAllAssistanceTypes();
  const createMutation = useMutationCreateAssistanceType();
  const updateMutation = useMutationUpdateAssistanceType();
  const deleteMutation = useMutationDeleteAssistanceType();

  const [createForm, setCreateForm] = useState<AssistanceTypePayload>(emptyPayload);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<AssistanceTypePayload>(emptyPayload);

  const activeTypes = useMemo(
    () => (assistanceTypesQuery.data ?? []).filter((item) => item.isActive !== false),
    [assistanceTypesQuery.data],
  );

  const isBusy =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    assistanceTypesQuery.isPending;

  const resetCreateForm = () => {
    setCreateForm(emptyPayload);
  };

  const handleCreate = async () => {
    const name = createForm.name?.trim() ?? "";
    if (!name) {
      return;
    }

    await createMutation.mutateAsync({
      ...createForm,
      name,
      extraFieldLabel: createForm.extraFieldLabel?.trim() || null,
      extraFieldPlaceholder: createForm.extraFieldPlaceholder?.trim() || null,
      extraFieldRequired: Boolean(createForm.extraFieldRequired),
      isActive: true,
    });

    resetCreateForm();
  };

  const startEdit = (type: AssistanceType) => {
    setEditingId(type.id);
    setEditForm(mapTypeToPayload(type));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(emptyPayload);
  };

  const saveEdit = async (id: number) => {
    const name = editForm.name?.trim() ?? "";
    if (!name) {
      return;
    }

    await updateMutation.mutateAsync({
      id,
      payload: {
        ...editForm,
        name,
        extraFieldLabel: editForm.extraFieldLabel?.trim() || null,
        extraFieldPlaceholder: editForm.extraFieldPlaceholder?.trim() || null,
        extraFieldRequired: Boolean(editForm.extraFieldRequired),
      },
    });

    cancelEdit();
  };

  const handleDelete = async (id: number) => {
    const ok = window.confirm("ยืนยันการลบประเภทเรื่องนี้?");
    if (!ok) {
      return;
    }

    await deleteMutation.mutateAsync(id);
    if (editingId === id) {
      cancelEdit();
    }
  };

  if (assistanceTypesQuery.isPending) {
    return <Loader />;
  }

  return (
    <>
      <NavBar />
      <div className="px-[3%] py-5 font-kanit">
        <h1 className="mb-4 text-[4vmin] font-bold text-[#505050]">จัดการประเภทเรื่องแจ้งเหตุ</h1>

        <div className="mb-4 rounded-xl border border-[#d9d9d9] bg-[#EFEFEF] p-4">
          <h2 className="mb-3 text-[3vmin] font-semibold text-[#505050]">เพิ่มรายการใหม่</h2>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input
              value={createForm.name ?? ""}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-xl border border-[#cccccc] px-4 py-3 text-[2.2vmin]"
              placeholder="ชื่อประเภท"
            />

            <input
              value={createForm.extraFieldLabel ?? ""}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, extraFieldLabel: e.target.value }))}
              className="w-full rounded-xl border border-[#cccccc] px-4 py-3 text-[2.2vmin]"
              placeholder="ชื่อช่องข้อมูลเพิ่มเติม (ถ้ามี)"
            />

            <input
              value={createForm.extraFieldPlaceholder ?? ""}
              onChange={(e) =>
                setCreateForm((prev) => ({ ...prev, extraFieldPlaceholder: e.target.value }))
              }
              className="w-full rounded-xl border border-[#cccccc] px-4 py-3 text-[2.2vmin]"
              placeholder="ข้อความตัวอย่างในช่องกรอก"
            />

            <label className="flex items-center gap-3 px-1 text-[2.1vmin]">
              <input
                type="checkbox"
                checked={Boolean(createForm.extraFieldRequired)}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, extraFieldRequired: e.target.checked }))
                }
                className="h-5 w-5"
              />
              บังคับกรอกข้อมูลเพิ่มเติม
            </label>
          </div>

          <div className="mt-3">
            <button
              disabled={isBusy || !(createForm.name?.trim() ?? "")}
              className={`rounded-xl px-6 py-2 text-[2.2vmin] text-white ${
                isBusy || !(createForm.name?.trim() ?? "")
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-[#22C55E] hover:bg-[#16a34a]"
              }`}
              onClick={handleCreate}
            >
              เพิ่ม
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#d9d9d9] bg-[#EFEFEF] p-4">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#cccccc] text-[2.4vmin] text-[#333333]">
                <th className="py-3 font-semibold">ชื่อประเภท</th>
                <th className="py-3 font-semibold">ช่องข้อมูลเพิ่มเติม</th>
                <th className="w-[230px] py-3 font-semibold">การจัดการ</th>
              </tr>
            </thead>

            <tbody>
              {activeTypes.map((type) => {
                const editing = editingId === type.id;

                return (
                  <tr key={type.id} className="align-top border-b border-[#dddddd]">
                    <td className="py-3 pr-4 text-[2.5vmin]">
                      {editing ? (
                        <input
                          value={editForm.name ?? ""}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                          className="w-full rounded-lg border border-[#bbbbbb] px-3 py-2"
                          placeholder="ชื่อประเภท"
                        />
                      ) : (
                        <span className="font-medium">{type.name}</span>
                      )}
                    </td>

                    <td className="py-3 pr-4 text-[2.1vmin]">
                      {editing ? (
                        <div className="flex flex-col gap-2">
                          <input
                            value={editForm.extraFieldLabel ?? ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({ ...prev, extraFieldLabel: e.target.value }))
                            }
                            className="w-full rounded-lg border border-[#bbbbbb] px-3 py-2"
                            placeholder="ชื่อช่องข้อมูลเพิ่มเติม"
                          />

                          <input
                            value={editForm.extraFieldPlaceholder ?? ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({ ...prev, extraFieldPlaceholder: e.target.value }))
                            }
                            className="w-full rounded-lg border border-[#bbbbbb] px-3 py-2"
                            placeholder="ข้อความตัวอย่าง"
                          />

                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={Boolean(editForm.extraFieldRequired)}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  extraFieldRequired: e.target.checked,
                                }))
                              }
                              className="h-4 w-4"
                            />
                            บังคับกรอก
                          </label>
                        </div>
                      ) : type.extraFieldLabel ? (
                        <div>
                          <div className="font-medium">{type.extraFieldLabel}</div>
                          <div className="text-[#666666]">{type.extraFieldPlaceholder || "-"}</div>
                          <div className="text-[#888888]">
                            {type.extraFieldRequired ? "บังคับกรอก" : "ไม่บังคับกรอก"}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[#888888]">ไม่มี</span>
                      )}
                    </td>

                    <td className="py-3">
                      {editing ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(type.id)}
                            disabled={isBusy || !(editForm.name?.trim() ?? "")}
                            className={`rounded-lg px-4 py-2 text-white ${
                              isBusy || !(editForm.name?.trim() ?? "")
                                ? "cursor-not-allowed bg-gray-400"
                                : "bg-[#F59E0B] hover:bg-[#d97706]"
                            }`}
                          >
                            บันทึก
                          </button>

                          <button
                            onClick={cancelEdit}
                            className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                          >
                            ยกเลิก
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(type)}
                            className="rounded-lg bg-[#F59E0B] px-4 py-2 text-white hover:bg-[#d97706]"
                          >
                            แก้ไข
                          </button>

                          <button
                            onClick={() => handleDelete(type.id)}
                            className="rounded-lg bg-[#EF4444] px-4 py-2 text-white hover:bg-[#dc2626]"
                          >
                            ลบ
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {activeTypes.length === 0 && (
            <div className="py-6 text-center text-[2.2vmin] text-[#777777]">ยังไม่มีประเภทเรื่อง</div>
          )}
        </div>
      </div>
    </>
  );
}
