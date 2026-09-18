import React, { useEffect, useMemo, useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import MaintenanceLayout from "@/Layouts/MaintenanceLayout";
import useFixFlowSettings from "@/hooks/useFixFlowSettings";

export default function Show({ requestId }) {
    const { language } = useFixFlowSettings();
    const user = usePage().props.auth.user;
    const isAdmin = user.role === "admin";
    const isStaff = isAdmin || user.role === "technician";

    const [item, setItem] = useState(null);
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);

    const [technicianId, setTechnicianId] = useState("");
    const [status, setStatus] = useState("");

    const [savingTechnician, setSavingTechnician] = useState(false);
    const [savingStatus, setSavingStatus] = useState(false);
    const [repairSaving, setRepairSaving] = useState(false);
    const [invoiceSaving, setInvoiceSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [repairForm, setRepairForm] = useState({
        action: "",
        repair_detail: "",
        labor_cost: "",
        parts_cost: "",
    });

    const text = {
        th: {
            layoutTitle: "รายละเอียดงานซ่อม",
            back: "กลับรายการแจ้งซ่อม",
            createdAt: "สร้างเมื่อ",

            pending: "รอดำเนินการ",
            assigned: "มอบหมายแล้ว",
            inProgress: "กำลังซ่อม",
            waitingParts: "รออะไหล่",
            completed: "เสร็จสิ้น",
            cancelled: "ยกเลิก",

            low: "ต่ำ",
            medium: "ปกติ",
            high: "สูง",
            urgent: "เร่งด่วน",

            requestDetails: "รายละเอียดการแจ้งซ่อม",
            requestDetailsDesc: "ข้อมูลปัญหาและผู้แจ้ง",

            requester: "ผู้แจ้ง",
            equipment: "ประเภทอุปกรณ์",
            location: "สถานที่",
            technician: "ช่างที่รับผิดชอบ",
            notAssigned: "ยังไม่ได้มอบหมาย",
            noInvoice: "ยังไม่มีใบแจ้งหนี้",
            payNow: "ชำระเงิน",
            problemDetails: "รายละเอียดปัญหา",
            noDescription: "ไม่มีรายละเอียดเพิ่มเติม",

            repairHistory: "ประวัติการซ่อม",
            repairHistoryDesc: "บันทึกการดำเนินงานและค่าใช้จ่าย",
            records: "รายการ",
            noRepairLog: "ยังไม่มีบันทึกการซ่อม",

            technicianLabel: "ช่าง",
            labor: "ค่าแรง",
            parts: "ค่าอะไหล่",

            addRepairLog: "เพิ่มบันทึกการซ่อม",
            actionPlaceholder: "การดำเนินการ เช่น ตรวจสอบ Power Supply",
            detailPlaceholder: "รายละเอียดการตรวจสอบหรือการซ่อม",
            laborLabel: "ค่าแรง",
            partsLabel: "ค่าอะไหล่",
            saving: "กำลังบันทึก...",
            addLog: "เพิ่มบันทึกการซ่อม",

            assignTechnician: "มอบหมายช่าง",
            assignDesc: "เลือกผู้รับผิดชอบงาน",
            selectTechnician: "เลือกช่างซ่อม",
            assigning: "กำลังบันทึก...",

            workStatus: "สถานะงาน",
            workStatusDesc: "อัปเดตความคืบหน้า",
            saveStatus: "บันทึกสถานะ",

            costSummary: "สรุปค่าใช้จ่าย",
            total: "รวม",

            invoice: "ใบแจ้งหนี้",
            invoiceDesc: "ค่าใช้จ่ายงานซ่อม",
            invoiceNo: "เลขที่ใบแจ้งหนี้",
            totalAmount: "ยอดรวม",
            viewInvoice: "ดูใบแจ้งหนี้",
            createInvoice: "สร้างใบแจ้งหนี้",
            creatingInvoice: "กำลังสร้าง...",

            unpaid: "ยังไม่ชำระ",
            paid: "ชำระแล้ว",
            paymentCancelled: "ยกเลิก",

            chooseTechnicianWarning: "กรุณาเลือกช่างซ่อม",
            assignSuccess: "มอบหมายช่างสำเร็จ",
            assignError: "ไม่สามารถมอบหมายช่างได้",

            statusSuccess: "อัปเดตสถานะสำเร็จ",
            statusError: "ไม่สามารถอัปเดตสถานะได้",

            actionRequired: "กรุณากรอกหัวข้อการดำเนินการ",
            repairSuccess: "เพิ่มบันทึกการซ่อมสำเร็จ",
            repairError: "ไม่สามารถบันทึกข้อมูลการซ่อมได้",

            invoiceConfirm:
                "ยืนยันการสร้างใบแจ้งหนี้จากค่าใช้จ่ายทั้งหมดของงานซ่อมนี้?",
            invoiceSuccess: "สร้างใบแจ้งหนี้สำเร็จ",
            invoiceError: "ไม่สามารถสร้างใบแจ้งหนี้ได้",

            loadError: "ไม่สามารถโหลดข้อมูลงานซ่อมได้",
            loading: "กำลังโหลดข้อมูล...",
            notFound: "ไม่พบรายการแจ้งซ่อม",

            editRequest: "แก้ไข",
            deleteRequest: "ลบรายการ",
            deleteConfirm:
                "ยืนยันลบรายการแจ้งซ่อมนี้? ข้อมูลที่เกี่ยวข้องอาจถูกลบไปด้วย",
            deleteSuccess: "ลบรายการแจ้งซ่อมสำเร็จ",
            deleteError: "ไม่สามารถลบรายการแจ้งซ่อมได้",
            deleting: "กำลังลบ...",
        },

        en: {
            layoutTitle: "Repair Request Details",
            back: "Back to Repair Requests",
            createdAt: "Created",

            pending: "Pending",
            assigned: "Assigned",
            inProgress: "In Progress",
            waitingParts: "Waiting for Parts",
            completed: "Completed",
            cancelled: "Cancelled",

            low: "Low",
            medium: "Medium",
            high: "High",
            urgent: "Urgent",

            requestDetails: "Request Details",
            requestDetailsDesc: "Issue and requester information",

            requester: "Requester",
            equipment: "Equipment Type",
            location: "Location",
            technician: "Assigned Technician",
            notAssigned: "Not assigned",
            noInvoice: "No invoice yet",
            payNow: "Pay now",
            problemDetails: "Issue Description",
            noDescription: "No additional description",

            repairHistory: "Repair History",
            repairHistoryDesc: "Repair records and costs",
            records: "records",
            noRepairLog: "No repair records yet",

            technicianLabel: "Technician",
            labor: "Labor",
            parts: "Parts",

            addRepairLog: "Add Repair Record",
            actionPlaceholder: "Action, e.g. Inspect Power Supply",
            detailPlaceholder: "Repair or inspection details",
            laborLabel: "Labor Cost",
            partsLabel: "Parts Cost",
            saving: "Saving...",
            addLog: "Add Repair Record",

            assignTechnician: "Assign Technician",
            assignDesc: "Select the technician responsible for this job",
            selectTechnician: "Select Technician",
            assigning: "Saving...",

            workStatus: "Work Status",
            workStatusDesc: "Update repair progress",
            saveStatus: "Save Status",

            costSummary: "Cost Summary",
            total: "Total",

            invoice: "Invoice",
            invoiceDesc: "Maintenance costs",
            invoiceNo: "Invoice Number",
            totalAmount: "Total Amount",
            viewInvoice: "View Invoice",
            createInvoice: "Create Invoice",
            creatingInvoice: "Creating...",

            unpaid: "Unpaid",
            paid: "Paid",
            paymentCancelled: "Cancelled",

            chooseTechnicianWarning: "Please select a technician",
            assignSuccess: "Technician assigned successfully",
            assignError: "Unable to assign technician",

            statusSuccess: "Status updated successfully",
            statusError: "Unable to update status",

            actionRequired: "Please enter the repair action",
            repairSuccess: "Repair record added successfully",
            repairError: "Unable to save repair record",

            invoiceConfirm:
                "Create an invoice from all repair costs for this request?",
            invoiceSuccess: "Invoice created successfully",
            invoiceError: "Unable to create invoice",

            loadError: "Unable to load repair request",
            loading: "Loading data...",
            notFound: "Repair request not found",

            editRequest: "Edit",
            deleteRequest: "Delete Request",
            deleteConfirm:
                "Are you sure you want to delete this repair request? Related data may also be removed.",
            deleteSuccess: "Repair request deleted successfully",
            deleteError: "Unable to delete repair request",
            deleting: "Deleting...",
        },
    };

    const t = text[language] ?? text.th;

    const loadData = async () => {
        setLoading(true);

        try {
            const [requestResponse, technicianResponse] = await Promise.all([
                axios.get(`/api/maintenance/requests/${requestId}`),
                axios.get("/api/maintenance/technicians"),
            ]);

            const requestData = requestResponse.data;

            setItem(requestData);
            setStatus(requestData.status ?? "");

            setTechnicianId(
                requestData.technician_id
                    ? String(requestData.technician_id)
                    : "",
            );

            setTechnicians(technicianResponse.data ?? []);
        } catch (error) {
            console.error(error);
            alert(t.loadError);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [requestId]);

    const assignTechnician = async () => {
        if (!technicianId) {
            alert(t.chooseTechnicianWarning);
            return;
        }

        setSavingTechnician(true);

        try {
            await axios.put(`/api/maintenance/requests/${requestId}/assign`, {
                technician_id: technicianId,
            });

            await loadData();
            alert(t.assignSuccess);
        } catch (error) {
            console.error(error);
            alert(t.assignError);
        } finally {
            setSavingTechnician(false);
        }
    };

    const updateStatus = async () => {
        if (!status) return;

        setSavingStatus(true);

        try {
            await axios.put(`/api/maintenance/requests/${requestId}`, {
                status,
            });

            await loadData();
            alert(t.statusSuccess);
        } catch (error) {
            console.error(error);
            alert(t.statusError);
        } finally {
            setSavingStatus(false);
        }
    };

    const saveRepairLog = async (e) => {
        e.preventDefault();

        if (!repairForm.action.trim()) {
            alert(t.actionRequired);
            return;
        }

        setRepairSaving(true);

        try {
            await axios.post("/api/maintenance/repair-logs", {
                maintenance_request_id: item.id,
                action: repairForm.action,
                repair_detail: repairForm.repair_detail || null,
                labor_cost: Number(repairForm.labor_cost || 0),
                parts_cost: Number(repairForm.parts_cost || 0),
            });

            setRepairForm({
                action: "",
                repair_detail: "",
                labor_cost: "",
                parts_cost: "",
            });

            await loadData();
            alert(t.repairSuccess);
        } catch (error) {
            console.error(error);

            alert(error.response?.data?.message ?? t.repairError);
        } finally {
            setRepairSaving(false);
        }
    };

    const createInvoice = async () => {
        if (!confirm(t.invoiceConfirm)) {
            return;
        }

        setInvoiceSaving(true);

        try {
            await axios.post("/api/maintenance/invoices", {
                maintenance_request_id: item.id,
            });

            await loadData();
            alert(t.invoiceSuccess);
        } catch (error) {
            console.error(error);

            alert(error.response?.data?.message ?? t.invoiceError);
        } finally {
            setInvoiceSaving(false);
        }
    };

    const deleteRequest = async () => {
        const confirmed = window.confirm(t.deleteConfirm);

        if (!confirmed) {
            return;
        }

        setDeleting(true);

        try {
            await axios.delete(`/api/maintenance/requests/${requestId}`);

            alert(t.deleteSuccess);

            window.location.href = "/maintenance/requests";
        } catch (error) {
            console.error(error);

            alert(error.response?.data?.message ?? t.deleteError);
        } finally {
            setDeleting(false);
        }
    };

    const statusText = {
        pending: t.pending,
        assigned: t.assigned,
        in_progress: t.inProgress,
        waiting_parts: t.waitingParts,
        completed: t.completed,
        cancelled: t.cancelled,
    };

    const statusClass = {
        pending: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",

        assigned: "bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-200",

        in_progress: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",

        waiting_parts:
            "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200",

        completed:
            "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",

        cancelled: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
    };

    const priorityText = {
        low: t.low,
        medium: t.medium,
        high: t.high,
        urgent: t.urgent,
    };

    const priorityClass = {
        low: "bg-slate-100 text-slate-600",

        medium: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",

        high: "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200",

        urgent: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
    };

    const paymentText = {
        unpaid: t.unpaid,
        paid: t.paid,
        cancelled: t.paymentCancelled,
    };

    const formatMoney = (value) => {
        return Number(value || 0).toLocaleString(
            language === "en" ? "en-US" : "th-TH",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            },
        );
    };

    const formatDateTime = (value) => {
        if (!value) return "-";

        return new Date(value).toLocaleString(
            language === "en" ? "en-US" : "th-TH",
            {
                dateStyle: "medium",
                timeStyle: "short",
            },
        );
    };

    const totals = useMemo(() => {
        const logs = item?.repair_logs ?? [];

        return logs.reduce(
            (result, log) => {
                result.labor += Number(log.labor_cost || 0);

                result.parts += Number(log.parts_cost || 0);

                return result;
            },
            {
                labor: 0,
                parts: 0,
            },
        );
    }, [item]);

    if (loading) {
        return (
            <MaintenanceLayout title={t.layoutTitle}>
                <div className="flex min-h-[500px] items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                        <span className="text-sm text-slate-500">
                            {t.loading}
                        </span>
                    </div>
                </div>
            </MaintenanceLayout>
        );
    }

    if (!item) {
        return (
            <MaintenanceLayout title={t.layoutTitle}>
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">
                    {t.notFound}
                </div>
            </MaintenanceLayout>
        );
    }

    // ตรงกับสิทธิ์ใน API: แต่ละ Role เห็นเฉพาะปุ่มที่ใช้งานได้
    const canEditRequest =
        isAdmin || (item.user_id === user.id && item.status === "pending");
    const canUpdateStatus = isAdmin || item.technician_id === user.id;

    return (
        <MaintenanceLayout title={t.layoutTitle}>
            <Head title={item.request_no} />

            <div className="space-y-6">
                {/* HEADER */}
                <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div>
                        <Link
                            href="/maintenance/requests"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 no-underline transition hover:text-slate-900"
                        >
                            <i className="bi bi-arrow-left"></i>
                            {t.back}
                        </Link>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                                {item.request_no}
                            </h2>

                            <span
                                className={`
                                    inline-flex rounded-full
                                    px-3 py-1.5
                                    text-xs font-bold
                                    ${
                                        statusClass[item.status] ??
                                        "bg-slate-100 text-slate-600"
                                    }
                                `}
                            >
                                {statusText[item.status] ?? item.status}
                            </span>

                            <span
                                className={`
                                    inline-flex rounded-full
                                    px-3 py-1.5
                                    text-xs font-bold
                                    ${
                                        priorityClass[item.priority] ??
                                        "bg-slate-100 text-slate-600"
                                    }
                                `}
                            >
                                {priorityText[item.priority] ?? item.priority}
                            </span>
                        </div>

                        <p className="mt-2 text-slate-500">{item.title}</p>
                    </div>

                    <div className="flex flex-col items-start gap-3 xl:items-end">
                        <div className="text-sm text-slate-500">
                            {t.createdAt}{" "}
                            <span className="font-semibold text-slate-700">
                                {formatDateTime(item.created_at)}
                            </span>
                        </div>

                        {canEditRequest && (
                        <div className="flex flex-wrap gap-2">
                            <Link
                                href={`/maintenance/requests/${requestId}/edit`}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 no-underline transition hover:bg-blue-50"
                            >
                                <i className="bi bi-pencil"></i>
                                {t.editRequest}
                            </Link>

                            <button
                                type="button"
                                onClick={deleteRequest}
                                disabled={deleting}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {deleting ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-rose-300 border-t-rose-700" />
                                        {t.deleting}
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-trash"></i>
                                        {t.deleteRequest}
                                    </>
                                )}
                            </button>
                        </div>
                        )}
                    </div>
                </section>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
                    {/* LEFT */}
                    <div className="space-y-6">
                        {/* DETAILS */}
                        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 px-6 py-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <i className="bi bi-card-text"></i>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-900">
                                            {t.requestDetails}
                                        </h3>

                                        <p className="mt-0.5 text-sm text-slate-500">
                                            {t.requestDetailsDesc}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                            {t.requester}
                                        </div>

                                        <div className="mt-2 font-semibold text-slate-900">
                                            {item.requester?.name ?? "-"}
                                        </div>

                                        <div className="mt-1 text-sm text-slate-500">
                                            {item.requester?.email ?? "-"}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                            {t.equipment}
                                        </div>

                                        <div className="mt-2 font-semibold text-slate-900">
                                            {item.equipment_type}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                            {t.location}
                                        </div>

                                        <div className="mt-2 font-semibold text-slate-900">
                                            <i className="bi bi-geo-alt mr-2 text-slate-400"></i>

                                            {item.location}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                            {t.technician}
                                        </div>

                                        <div className="mt-2 font-semibold text-slate-900">
                                            {item.technician?.name ??
                                                t.notAssigned}
                                        </div>
                                    </div>
                                </div>

                                <div className="my-6 border-t border-slate-100" />

                                <div>
                                    <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                        {t.problemDetails}
                                    </div>

                                    <div className="mt-3 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                                        {item.description || t.noDescription}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* REPAIR HISTORY */}
                        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 px-6 py-5">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                            <i className="bi bi-wrench-adjustable"></i>
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-slate-900">
                                                {t.repairHistory}
                                            </h3>

                                            <p className="mt-0.5 text-sm text-slate-500">
                                                {t.repairHistoryDesc}
                                            </p>
                                        </div>
                                    </div>

                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                                        {item.repair_logs?.length ?? 0}{" "}
                                        {t.records}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                {item.repair_logs?.length > 0 ? (
                                    <div className="space-y-4">
                                        {item.repair_logs.map((log, index) => (
                                            <div
                                                key={log.id}
                                                className="rounded-xl border border-slate-200 p-4"
                                            >
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                                                                {index + 1}
                                                            </div>

                                                            <div className="font-bold text-slate-900">
                                                                {log.action}
                                                            </div>
                                                        </div>

                                                        {log.repair_detail && (
                                                            <p className="ml-9 mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                                                {
                                                                    log.repair_detail
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="text-sm text-slate-400">
                                                        {formatDateTime(
                                                            log.created_at,
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="ml-9 mt-4 flex flex-wrap gap-2">
                                                    <span className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                                                        {t.technicianLabel}:{" "}
                                                        <b>
                                                            {log.technician
                                                                ?.name ?? "-"}
                                                        </b>
                                                    </span>

                                                    <span className="rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
                                                        {t.labor} ฿
                                                        {formatMoney(
                                                            log.labor_cost,
                                                        )}
                                                    </span>

                                                    <span className="rounded-lg bg-orange-50 px-3 py-2 text-xs text-orange-700">
                                                        {t.parts} ฿
                                                        {formatMoney(
                                                            log.parts_cost,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-xl bg-slate-50 px-5 py-8 text-center">
                                        <i className="bi bi-journal-x text-3xl text-slate-300"></i>

                                        <div className="mt-3 font-semibold text-slate-600">
                                            {t.noRepairLog}
                                        </div>
                                    </div>
                                )}

                                {/* ADD LOG */}
                                {isStaff && (
                                <form
                                    onSubmit={saveRepairLog}
                                    className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-5"
                                >
                                    <h4 className="font-bold text-slate-900">
                                        {t.addRepairLog}
                                    </h4>

                                    <div className="mt-4 space-y-4">
                                        <input
                                            type="text"
                                            value={repairForm.action}
                                            onChange={(e) =>
                                                setRepairForm({
                                                    ...repairForm,
                                                    action: e.target.value,
                                                })
                                            }
                                            placeholder={t.actionPlaceholder}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                        />

                                        <textarea
                                            rows="3"
                                            value={repairForm.repair_detail}
                                            onChange={(e) =>
                                                setRepairForm({
                                                    ...repairForm,
                                                    repair_detail:
                                                        e.target.value,
                                                })
                                            }
                                            placeholder={t.detailPlaceholder}
                                            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                        />

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className="mb-2 block text-xs font-bold text-slate-600">
                                                    {t.laborLabel}
                                                </label>

                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={
                                                        repairForm.labor_cost
                                                    }
                                                    onChange={(e) =>
                                                        setRepairForm({
                                                            ...repairForm,
                                                            labor_cost:
                                                                e.target.value,
                                                        })
                                                    }
                                                    placeholder="0.00"
                                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-xs font-bold text-slate-600">
                                                    {t.partsLabel}
                                                </label>

                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={
                                                        repairForm.parts_cost
                                                    }
                                                    onChange={(e) =>
                                                        setRepairForm({
                                                            ...repairForm,
                                                            parts_cost:
                                                                e.target.value,
                                                        })
                                                    }
                                                    placeholder="0.00"
                                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={repairSaving}
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {repairSaving ? (
                                                <>
                                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
                                                    {t.saving}
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-plus-lg"></i>
                                                    {t.addLog}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT */}
                    <div className="space-y-6">
                        {/* ASSIGN */}
                        {isAdmin && (
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                                    <i className="bi bi-person-gear"></i>
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-900">
                                        {t.assignTechnician}
                                    </h3>

                                    <p className="text-sm text-slate-500">
                                        {t.assignDesc}
                                    </p>
                                </div>
                            </div>

                            <select
                                value={technicianId}
                                onChange={(e) =>
                                    setTechnicianId(e.target.value)
                                }
                                className="mt-5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            >
                                <option value="">{t.selectTechnician}</option>

                                {technicians.map((technician) => (
                                    <option
                                        key={technician.id}
                                        value={technician.id}
                                    >
                                        {technician.name}
                                    </option>
                                ))}
                            </select>

                            <button
                                type="button"
                                onClick={assignTechnician}
                                disabled={savingTechnician}
                                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-60"
                            >
                                <i className="bi bi-person-check"></i>

                                {savingTechnician
                                    ? t.assigning
                                    : t.assignTechnician}
                            </button>
                        </section>
                        )}

                        {/* STATUS */}
                        {canUpdateStatus && (
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <i className="bi bi-arrow-repeat"></i>
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-900">
                                        {t.workStatus}
                                    </h3>

                                    <p className="text-sm text-slate-500">
                                        {t.workStatusDesc}
                                    </p>
                                </div>
                            </div>

                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="mt-5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            >
                                <option value="pending">{t.pending}</option>

                                <option value="assigned">{t.assigned}</option>

                                <option value="in_progress">
                                    {t.inProgress}
                                </option>

                                <option value="waiting_parts">
                                    {t.waitingParts}
                                </option>

                                <option value="completed">{t.completed}</option>

                                <option value="cancelled">{t.cancelled}</option>
                            </select>

                            <button
                                type="button"
                                onClick={updateStatus}
                                disabled={savingStatus}
                                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                            >
                                <i className="bi bi-check2-circle"></i>

                                {savingStatus ? t.saving : t.saveStatus}
                            </button>
                        </section>
                        )}

                        {/* COST */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="font-bold text-slate-900">
                                {t.costSummary}
                            </h3>

                            <div className="mt-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">
                                        {t.labor}
                                    </span>

                                    <span className="font-semibold text-slate-900">
                                        ฿{formatMoney(totals.labor)}
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">
                                        {t.parts}
                                    </span>

                                    <span className="font-semibold text-slate-900">
                                        ฿{formatMoney(totals.parts)}
                                    </span>
                                </div>

                                <div className="border-t border-slate-100 pt-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-slate-900">
                                            {t.total}
                                        </span>

                                        <span className="text-xl font-bold text-slate-900">
                                            ฿
                                            {formatMoney(
                                                totals.labor + totals.parts,
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* INVOICE */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                    <i className="bi bi-receipt"></i>
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-900">
                                        {t.invoice}
                                    </h3>

                                    <p className="text-sm text-slate-500">
                                        {t.invoiceDesc}
                                    </p>
                                </div>
                            </div>

                            {item.invoice ? (
                                <div className="mt-5">
                                    <div className="rounded-xl bg-slate-50 p-4">
                                        <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                            {t.invoiceNo}
                                        </div>

                                        <div className="mt-1 text-lg font-bold text-slate-900">
                                            {item.invoice.invoice_no}
                                        </div>

                                        <div className="mt-4 space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">
                                                    {t.labor}
                                                </span>

                                                <span>
                                                    ฿
                                                    {formatMoney(
                                                        item.invoice.labor_cost,
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="text-slate-500">
                                                    {t.parts}
                                                </span>

                                                <span>
                                                    ฿
                                                    {formatMoney(
                                                        item.invoice.parts_cost,
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                                                <span>{t.totalAmount}</span>

                                                <span>
                                                    ฿
                                                    {formatMoney(
                                                        item.invoice
                                                            .total_amount,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className={`mt-3 rounded-xl px-4 py-3 text-sm font-semibold ${
                                            {
                                                paid: "bg-emerald-50 text-emerald-700",
                                                unpaid: "bg-amber-50 text-amber-700",
                                                cancelled: "bg-rose-50 text-rose-700",
                                            }[item.invoice.payment_status] ??
                                            "bg-slate-100 text-slate-600"
                                        }`}
                                    >
                                        <i
                                            className={`bi ${
                                                item.invoice.payment_status === "paid"
                                                    ? "bi-check-circle"
                                                    : item.invoice.payment_status === "cancelled"
                                                      ? "bi-x-circle"
                                                      : "bi-hourglass-split"
                                            } mr-2`}
                                        ></i>

                                        {paymentText[
                                            item.invoice.payment_status
                                        ] ?? item.invoice.payment_status}
                                    </div>

                                    {item.invoice.payment_status === "unpaid" &&
                                        (isAdmin || item.user_id === user.id) && (
                                            <Link
                                                href={`/maintenance/invoices/${item.invoice.id}/pay`}
                                                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white no-underline transition hover:bg-emerald-700"
                                            >
                                                <i className="bi bi-wallet2"></i>
                                                {t.payNow}
                                            </Link>
                                        )}

                                    {isStaff && (
                                    <Link
                                        href={`/maintenance/invoices/${item.invoice.id}`}
                                        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 no-underline transition hover:bg-emerald-50"
                                    >
                                        <i className="bi bi-eye"></i>
                                        {t.viewInvoice}
                                    </Link>
                                    )}
                                </div>
                            ) : isStaff ? (
                                <button
                                    type="button"
                                    onClick={createInvoice}
                                    disabled={invoiceSaving}
                                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <i className="bi bi-receipt"></i>

                                    {invoiceSaving
                                        ? t.creatingInvoice
                                        : t.createInvoice}
                                </button>
                            ) : (
                                <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                                    {t.noInvoice}
                                </p>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </MaintenanceLayout>
    );
}
