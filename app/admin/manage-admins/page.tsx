"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/Navbar";
import { isAuthenticated, isSuperAdmin } from "@/api/login";
import {
  useQueryGetAdmins,
  useMutationCreateAdmin,
  useMutationUpdateAdmin,
  useMutationDeactivateAdmin,
  useMutationDeleteAdmin,
  useQueryGetProvinces,
  useQueryGetDistricts,
} from "@/api/admin";
import Loader from "@/components/Loader";

export default function ManageAdmins() {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any | null>(null);

  // Province used to load the district list for the modal
  const [selectedProvince, setSelectedProvince] = useState<string>("เชียงใหม่");

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    phone: "",
    role: "DISTRICT_ADMIN",
    province: "เชียงใหม่",
    districtIds: [] as number[],
  });

  const adminsQuery = useQueryGetAdmins();
  const provincesQuery = useQueryGetProvinces();
  const districtsQuery = useQueryGetDistricts(selectedProvince);

  const createAdmin = useMutationCreateAdmin();
  const updateAdmin = useMutationUpdateAdmin();
  const deactivateAdmin = useMutationDeactivateAdmin();
  const deleteAdmin = useMutationDeleteAdmin();

  // Keep selectedProvince in sync with form province field
  useEffect(() => {
    setSelectedProvince(formData.province || "เชียงใหม่");
  }, [formData.province]);

  useEffect(() => {
    if (!isAuthenticated() || !isSuperAdmin()) {
      router.replace("/main");
    }
  }, [router]);

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      fullName: "",
      phone: "",
      role: "DISTRICT_ADMIN",
      province: "เชียงใหม่",
      districtIds: [],
    });
    setSelectedProvince("เชียงใหม่");
    setEditingAdmin(null);
    setIsCreateModalOpen(false);
  };

  const handleCreate = async () => {
    await createAdmin.mutateAsync(formData);
    resetForm();
  };

  const handleUpdate = async () => {
    if (!editingAdmin) return;
    await updateAdmin.mutateAsync({
      id: editingAdmin.id,
      request: {
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        role: formData.role,
        province: formData.role === "SUPER_ADMIN" ? formData.province : undefined,
        districtIds: formData.role === "DISTRICT_ADMIN" ? formData.districtIds : [],
      },
    });
    resetForm();
  };

  const handleDeactivate = async (id: number) => {
    if (confirm("คุณต้องการปิดใช้งานผู้ดูแลคนนี้หรือไม่?")) {
      await deactivateAdmin.mutateAsync(id);
    }
  };

  const handleActivate = async (id: number) => {
    if (confirm("คุณต้องการเปิดใช้งานผู้ดูแลคนนี้อีกครั้งหรือไม่?")) {
      await updateAdmin.mutateAsync({
        id,
        request: { isActive: true },
      });
    }
  };

  const handleDelete = async (id: number, username: string) => {
    if (
      confirm(
        `⚠️ คุณต้องการลบผู้ดูแล "${username}" อย่างถาวรหรือไม่?\n\nการดำเนินการนี้ไม่สามารถย้อนกลับได้!`
      )
    ) {
      await deleteAdmin.mutateAsync(id);
    }
  };

  const openEditModal = (admin: any) => {
    const province = admin.province || "เชียงใหม่";
    setEditingAdmin(admin);
    setSelectedProvince(province);
    setFormData({
      username: admin.username,
      email: admin.email || "",
      password: "",
      fullName: admin.fullName,
      phone: admin.phone || "",
      role: admin.role,
      province: province,
      districtIds: admin.assignedDistricts?.map((d: any) => d.id) || [],
    });
    setIsCreateModalOpen(true);
  };

  const toggleDistrictId = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      districtIds: prev.districtIds.includes(id)
        ? prev.districtIds.filter((d) => d !== id)
        : [...prev.districtIds, id],
    }));
  };

  if (adminsQuery.isPending) return <Loader />;

  const admins = adminsQuery.data || [];
  const provinces = provincesQuery.data || [];
  const districts = districtsQuery.data || [];

  return (
    <>
      <NavBar />
      <div className="px-[3%] py-4 font-kanit">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">จัดการผู้ดูแลระบบ</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/admin/audit-logs")}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-bold"
            >
              📋 บันทึกการใช้งาน
            </button>
            <button
              onClick={() => {
                resetForm();
                setIsCreateModalOpen(true);
              }}
              className="px-4 py-2 bg-[#ff3388] text-white rounded-lg hover:bg-[#ff0066] transition-colors font-bold"
            >
              + เพิ่มผู้ดูแล
            </button>
          </div>
        </div>

        {/* Admin List */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-[#ff3388] text-white">
                <th className="p-3 text-left">ชื่อผู้ใช้</th>
                <th className="p-3 text-left">ชื่อ-นามสกุล</th>
                <th className="p-3 text-left">อีเมล</th>
                <th className="p-3 text-left">บทบาท</th>
                <th className="p-3 text-left">จังหวัด / เขตที่ดูแล</th>
                <th className="p-3 text-left">สถานะ</th>
                <th className="p-3 text-left">เข้าสู่ระบบล่าสุด</th>
                <th className="p-3 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin: any) => (
                <tr key={admin.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{admin.username}</td>
                  <td className="p-3">{admin.fullName}</td>
                  <td className="p-3">{admin.email || "-"}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        admin.role === "SUPER_ADMIN"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {admin.role === "SUPER_ADMIN"
                        ? "ผู้ดูแลระบบ"
                        : "ผู้ดูแลเขต"}
                    </span>
                  </td>
                  <td className="p-3 max-w-[240px]">
                    {admin.role === "SUPER_ADMIN" ? (
                      admin.province ? (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-xs rounded-full border border-amber-200">
                          🏛️ {admin.province}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">ทุกจังหวัด</span>
                      )
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {admin.assignedDistricts?.length > 0
                          ? admin.assignedDistricts.map((d: any) => (
                              <span
                                key={d.id}
                                className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200"
                              >
                                {d.nameInThai}
                              </span>
                            ))
                          : "-"}
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        admin.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {admin.isActive ? "ใช้งาน" : "ปิดใช้งาน"}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-500">
                    {admin.lastLoginAt
                      ? new Date(admin.lastLoginAt).toLocaleString("th-TH")
                      : "-"}
                  </td>
                  <td className="p-3 text-center whitespace-nowrap">
                    <button
                      onClick={() => openEditModal(admin)}
                      className="px-2 py-1 text-blue-600 hover:text-blue-800 mr-1"
                    >
                      แก้ไข
                    </button>
                    {admin.role !== "SUPER_ADMIN" && (
                      admin.isActive ? (
                        <button
                          onClick={() => handleDeactivate(admin.id)}
                          className="px-2 py-1 text-orange-600 hover:text-orange-800 mr-1"
                        >
                          ปิดใช้งาน
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(admin.id)}
                          className="px-2 py-1 text-green-600 hover:text-green-800 mr-1"
                        >
                          เปิดใช้งาน
                        </button>
                      )
                    )}
                    {admin.role !== "SUPER_ADMIN" && (
                      <button
                        onClick={() =>
                          handleDelete(admin.id, admin.username)
                        }
                        className="px-2 py-1 text-red-600 hover:text-red-800 font-bold"
                      >
                        ลบ
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 font-kanit">
              {editingAdmin ? "แก้ไขผู้ดูแล" : "เพิ่มผู้ดูแลใหม่"}
            </h2>

            <div className="space-y-4 font-kanit">
              {!editingAdmin && (
                <div>
                  <label className="block text-sm font-bold mb-1">
                    ชื่อผู้ใช้ *
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    required
                    autoComplete="off"
                    data-lpignore="true"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-bold mb-1">
                  ชื่อ-นามสกุล *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                  required
                  autoComplete="off"
                  data-lpignore="true"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">อีเมล</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                  autoComplete="off"
                  data-lpignore="true"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                  autoComplete="off"
                  data-lpignore="true"
                />
              </div>

              {!editingAdmin && (
                <div>
                  <label className="block text-sm font-bold mb-1">
                    รหัสผ่าน *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    required
                    autoComplete="new-password"
                    data-lpignore="true"
                  />
                </div>
              )}

              {/* Province selector – scope for filtering districts */}
              <div>
                <label className="block text-sm font-bold mb-1">
                  จังหวัด (ใช้กรองรายชื่อเขต)
                </label>
                {provincesQuery.isPending ? (
                  <div className="flex items-center gap-2 p-2 border rounded-lg text-gray-400 text-sm">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#ff3388]"></div>
                    กำลังโหลด...
                  </div>
                ) : (
                  <select
                    value={formData.province}
                    onChange={(e) => {
                      setFormData({ ...formData, province: e.target.value, districtIds: [] });
                    }}
                    className="w-full p-2 border rounded-lg"
                  >
                    {provinces.map((p) => (
                      <option key={p.id} value={p.nameInThai}>
                        {p.nameInThai}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* District checkboxes – only for DISTRICT_ADMIN */}
              {formData.role === "DISTRICT_ADMIN" && (
                <div>
                  <label className="block text-sm font-bold mb-1">
                    เขตที่ดูแล
                    {formData.districtIds.length > 0 && (
                      <span className="ml-2 text-[#ff3388] font-normal text-xs">
                        ({formData.districtIds.length} เขต)
                      </span>
                    )}
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    คลิกเพื่อเลือก/ยกเลิกเขตที่ต้องการ
                  </p>

                  {districtsQuery.isPending ? (
                    <div className="flex items-center gap-2 p-3 border rounded-lg text-gray-400 text-sm">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#ff3388]"></div>
                      กำลังโหลดรายชื่อเขต...
                    </div>
                  ) : districts.length === 0 ? (
                    <div className="p-3 border rounded-lg text-gray-400 text-sm text-center">
                      ไม่พบข้อมูลเขตในจังหวัดที่เลือก
                    </div>
                  ) : (
                    <div className="max-h-48 overflow-y-auto border rounded-lg p-2 grid grid-cols-2 gap-1">
                      {districts.map((district) => (
                        <label
                          key={district.id}
                          className={`flex items-center gap-2 p-1.5 rounded cursor-pointer hover:bg-gray-50 text-sm transition-colors ${
                            formData.districtIds.includes(district.id)
                              ? "bg-blue-50 text-blue-800"
                              : "text-gray-700"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.districtIds.includes(district.id)}
                            onChange={() => toggleDistrictId(district.id)}
                            className="rounded accent-[#ff3388]"
                          />
                          {district.nameInThai}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={resetForm}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 font-kanit"
              >
                ยกเลิก
              </button>
              <button
                onClick={editingAdmin ? handleUpdate : handleCreate}
                disabled={createAdmin.isPending || updateAdmin.isPending}
                className="px-4 py-2 bg-[#ff3388] text-white rounded-lg hover:bg-[#ff0066] disabled:opacity-50 font-kanit"
              >
                {editingAdmin ? "บันทึกการแก้ไข" : "เพิ่มผู้ดูแล"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
