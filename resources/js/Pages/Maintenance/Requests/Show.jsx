import React, { useEffect, useMemo, useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import MaintenanceLayout from "@/Layouts/MaintenanceLayout";
import LocationMap from "@/Components/LocationMap";
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

    const [savingTechnician, setSavingTechnician] = useState(false);
    const [savingStatus, setSavingStatus] = useState(false);
    const [repairSaving, setRepairSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [draft, setDraft] = useState("");
    const [sending, setSending] = useState(false);
    const [progress, setProgress] = useState(0);
    const [invoiceSaving, setInvoiceSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [repairForm, setRepairForm] = useState({
        action: "",
        repair_detail: "",
        labor_cost: "",
        parts_cost: "",
        status: "in_progress",
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
            statusAuto: "สถานะเปลี่ยนเองเมื่อมอบหมายช่าง บันทึกการซ่อม และออกใบแจ้งหนี้",
            stepReported: "แจ้งซ่อม",
            stepAssigned: "มอบหมายช่าง",
            stepInProgress: "กำลังซ่อม",
            stepCompleted: "เสร็จสิ้น",
            logWaitingParts: "รออะไหล่ — หยุดรอชิ้นส่วนก่อนซ่อมต่อ",
            logCompleted: "ซ่อมเสร็จแล้ว — ส่งให้ผู้แจ้งยืนยัน",
            awaitingConfirmation: "รอผู้แจ้งยืนยัน",
            admin: "ผู้ดูแลระบบ",
            stepHandedOver: "ช่างส่งงาน",
            confirmDone: "ยืนยันว่าซ่อมเรียบร้อย",
            confirmDoneConfirm: "ยืนยันว่างานซ่อมนี้เรียบร้อยแล้ว?",
            rejectWork: "ยังไม่เรียบร้อย",
            rejectPrompt: "บอกช่างว่ายังมีปัญหาอะไร",
            confirmedBy: "ยืนยันโดย",
            invoiceAfterConfirm: "ออกใบแจ้งหนี้ได้หลังผู้แจ้งยืนยันว่างานเสร็จ",
            media: "รูปภาพและวิดีโอ",
            mediaDesc: "หลักฐานก่อน–หลังซ่อม",
            noMedia: "ยังไม่มีไฟล์แนบ",
            addMedia: "เพิ่มรูปภาพหรือวิดีโอ",
            mediaRules: "JPG, PNG, WebP, MP4, WebM หรือ MOV · ไม่เกิน 25 MB ต่อไฟล์ · สูงสุด 10 ไฟล์",
            uploadingMedia: "กำลังอัปโหลด",
            uploadError: "อัปโหลดไฟล์ไม่สำเร็จ",
            deleteFile: "ลบไฟล์",
            deleteFileConfirm: "ลบไฟล์นี้?",
            chat: "พูดคุยกับช่าง",
            chatWithCustomer: "พูดคุยกับผู้แจ้ง",
            chatDesc: "สอบถามรายละเอียดเพิ่มเติมระหว่างซ่อม",
            chatEmpty: "ยังไม่มีข้อความ เริ่มพูดคุยได้เลย",
            chatPlaceholder: "พิมพ์ข้อความ...",
            chatSend: "ส่ง",
            chatError: "ส่งข้อความไม่สำเร็จ",
            directions: "นำทางไปยังจุดซ่อม",
            locationNote: "รายละเอียดสถานที่",
            cancelJob: "ยกเลิกงาน",
            cancelJobConfirm: "ยืนยันการยกเลิกงานซ่อมนี้?",
            jobCancelled: "งานนี้ถูกยกเลิกแล้ว",
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
            workStatusDesc: "Updates as the work happens",
            statusAuto: "The status changes by itself when a technician is assigned, a repair is logged and the invoice is created.",
            stepReported: "Reported",
            stepAssigned: "Technician assigned",
            stepInProgress: "In progress",
            stepCompleted: "Completed",
            logWaitingParts: "Waiting for parts - work pauses until they arrive",
            logCompleted: "Repair finished - hand over for confirmation",
            awaitingConfirmation: "Awaiting confirmation",
            admin: "An administrator",
            stepHandedOver: "Handed over",
            confirmDone: "Confirm the repair is done",
            confirmDoneConfirm: "Confirm this repair is finished?",
            rejectWork: "Not fixed yet",
            rejectPrompt: "Tell the technician what is still wrong",
            confirmedBy: "Confirmed by",
            invoiceAfterConfirm: "The invoice can be created once the requester confirms the work.",
            media: "Photos and video",
            mediaDesc: "Evidence before and after the repair",
            noMedia: "No files yet",
            addMedia: "Add a photo or video",
            mediaRules: "JPG, PNG, WebP, MP4, WebM or MOV - up to 25 MB each - 10 files per job",
            uploadingMedia: "Uploading",
            uploadError: "Unable to upload the file",
            deleteFile: "Delete file",
            deleteFileConfirm: "Delete this file?",
            chat: "Chat with the technician",
            chatWithCustomer: "Chat with the requester",
            chatDesc: "Ask for details while the repair is going on",
            chatEmpty: "No messages yet. Say hello.",
            chatPlaceholder: "Write a message...",
            chatSend: "Send",
            chatError: "Unable to send the message",
            directions: "Get directions",
            locationNote: "Location details",
            cancelJob: "Cancel job",
            cancelJobConfirm: "Cancel this repair request?",
            jobCancelled: "This job was cancelled",
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

    // ดึงเฉพาะข้อความใหม่ทุก 5 วินาที เพื่อให้คุยกันได้โดยไม่ต้องรีเฟรชหน้า
    useEffect(() => {
        let stop = false;
        let lastId = 0;

        const poll = async () => {
            try {
                const { data } = await axios.get(
                    `/api/maintenance/requests/${requestId}/messages`,
                    { params: lastId ? { after: lastId } : {} },
                );

                if (stop || !data.length) return;

                lastId = data[data.length - 1].id;

                // ข้อความที่เพิ่งส่งเองอาจถูกเพิ่มไปแล้ว จึงกันไม่ให้ซ้ำ
                setMessages((current) => {
                    const known = new Set(current.map((message) => message.id));
                    const fresh = data.filter((message) => !known.has(message.id));

                    return fresh.length ? [...current, ...fresh] : current;
                });
            } catch {
                // ไม่มีสิทธิ์คุยในงานนี้ หรือเครือข่ายขัดข้อง ปล่อยให้รอบถัดไปลองใหม่
            }
        };

        poll();
        const timer = setInterval(poll, 5000);

        return () => {
            stop = true;
            clearInterval(timer);
        };
    }, [requestId]);

    const sendMessage = async (event) => {
        event.preventDefault();

        const body = draft.trim();

        if (!body || sending) return;

        setSending(true);

        try {
            const { data } = await axios.post(
                `/api/maintenance/requests/${requestId}/messages`,
                { body },
            );

            setMessages((current) =>
                current.some((message) => message.id === data.id)
                    ? current
                    : [...current, data],
            );
            setDraft("");
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message ?? t.chatError);
        } finally {
            setSending(false);
        }
    };

    const uploadFiles = async (event) => {
        const files = [...event.target.files];
        event.target.value = "";

        if (!files.length) {
            return;
        }

        setUploading(true);

        try {
            // อัปโหลดทีละไฟล์ เพื่อให้เห็นความคืบหน้าและหยุดทันทีเมื่อไฟล์ใดไม่ผ่าน
            for (const file of files) {
                const body = new FormData();
                body.append("file", file);

                await axios.post(
                    `/api/maintenance/requests/${requestId}/attachments`,
                    body,
                    {
                        onUploadProgress: (e) =>
                            setProgress(Math.round((e.loaded / (e.total || file.size)) * 100)),
                    },
                );
            }

            await loadData();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message ?? t.uploadError);
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    const removeAttachment = async (id) => {
        if (!confirm(t.deleteFileConfirm)) {
            return;
        }

        try {
            await axios.delete(`/api/maintenance/attachments/${id}`);
            await loadData();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message ?? t.uploadError);
        }
    };

    const rejectWork = async () => {
        const note = prompt(t.rejectPrompt);

        if (!note || !note.trim()) {
            return;
        }

        await changeStatus("in_progress", null, note.trim());
    };

    const changeStatus = async (next, confirmText, note) => {
        if (confirmText && !confirm(confirmText)) {
            return;
        }

        setSavingStatus(true);

        try {
            await axios.put(`/api/maintenance/requests/${requestId}`, {
                status: next,
                ...(note ? { note } : {}),
            });

            await loadData();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message ?? t.statusError);
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
                status: repairForm.status,
            });

            setRepairForm({
                action: "",
                repair_detail: "",
                labor_cost: "",
                parts_cost: "",
                status: "in_progress",
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
        awaiting_confirmation: t.awaitingConfirmation,
        completed: t.completed,
        cancelled: t.cancelled,
    };

    const statusClass = {
        pending: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",

        assigned: "bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-200",

        in_progress: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",

        waiting_parts:
            "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200",

        awaiting_confirmation:
            "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200",

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
    const openJob = !["completed", "cancelled"].includes(item.status);
    // ผู้แจ้ง ช่างที่รับงาน และ Admin คุยกันได้
    const canChat =
        isAdmin || item.user_id === user.id || item.technician_id === user.id;
    const files = item.attachments ?? [];
    // ผู้แจ้ง ช่างที่รับงาน และ Admin แนบหลักฐานได้จนกว่างานจะปิด
    const canAttach =
        openJob &&
        files.length < 10 &&
        (isAdmin || item.user_id === user.id || item.technician_id === user.id);
    // ผู้แจ้งและ Admin เป็นผู้ยืนยันว่างานเสร็จจริง
    const canReview =
        (isAdmin || item.user_id === user.id) &&
        item.status === "awaiting_confirmation";
    // ผู้แจ้งและ Admin ยกเลิกงานที่ยังไม่ปิดได้
    const canCancel =
        (isAdmin || item.user_id === user.id) &&
        !["completed", "cancelled"].includes(item.status);

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

                        <div className="flex flex-wrap gap-2">
                            {canEditRequest && (
                            <Link
                                href={`/maintenance/requests/${requestId}/edit`}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 no-underline transition hover:bg-blue-50"
                            >
                                <i className="bi bi-pencil"></i>
                                {t.editRequest}
                            </Link>
                            )}

                            {canEditRequest && (
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
                            )}

                            {canReview && (
                                <>
                                    <button
                                        type="button"
                                        disabled={savingStatus}
                                        onClick={() => changeStatus("completed", t.confirmDoneConfirm)}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <i className="bi bi-patch-check"></i>
                                        {savingStatus ? t.saving : t.confirmDone}
                                    </button>

                                    <button
                                        type="button"
                                        disabled={savingStatus}
                                        onClick={rejectWork}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <i className="bi bi-arrow-counterclockwise"></i>
                                        {t.rejectWork}
                                    </button>
                                </>
                            )}

                            {canCancel && (
                                <button
                                    type="button"
                                    onClick={() => changeStatus("cancelled", t.cancelJobConfirm)}
                                    disabled={savingStatus}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <i className="bi bi-x-circle"></i>
                                    {savingStatus ? t.saving : t.cancelJob}
                                </button>
                            )}
                        </div>
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

                                        {item.location_note && (
                                            <div className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600">
                                                <span className="font-semibold text-slate-500">{t.locationNote}: </span>
                                                {item.location_note}
                                            </div>
                                        )}

                                        {item.latitude && item.longitude && (
                                            <div className="mt-3">
                                                <LocationMap
                                                    latitude={item.latitude}
                                                    longitude={item.longitude}
                                                    height="h-40"
                                                />

                                                <a
                                                    href={`https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 no-underline hover:underline"
                                                >
                                                    <i className="bi bi-signpost-2"></i>
                                                    {t.directions}
                                                </a>
                                            </div>
                                        )}
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

                                        <div className="space-y-2 rounded-xl bg-white p-3">
                                            {[
                                                ["waiting_parts", "logWaitingParts"],
                                                ["awaiting_confirmation", "logCompleted"],
                                            ].map(([value, label]) => (
                                                <label key={value} className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4 rounded border-slate-300"
                                                        checked={repairForm.status === value}
                                                        onChange={(e) =>
                                                            setRepairForm({
                                                                ...repairForm,
                                                                status: e.target.checked ? value : "in_progress",
                                                            })
                                                        }
                                                    />
                                                    {t[label]}
                                                </label>
                                            ))}
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

                        {/* CHAT */}
                        {canChat && (
                        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 px-6 py-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <i className="bi bi-chat-dots"></i>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-900">
                                            {item.user_id === user.id ? t.chat : t.chatWithCustomer}
                                        </h3>

                                        <p className="mt-0.5 text-sm text-slate-500">
                                            {t.chatDesc}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
                                    {messages.length === 0 ? (
                                        <div className="rounded-xl bg-slate-50 px-5 py-8 text-center">
                                            <i className="bi bi-chat-square-text text-3xl text-slate-300"></i>

                                            <div className="mt-3 font-semibold text-slate-600">
                                                {t.chatEmpty}
                                            </div>
                                        </div>
                                    ) : (
                                        messages.map((message) => {
                                            const mine = message.user_id === user.id;

                                            return (
                                                <div
                                                    key={message.id}
                                                    className={`flex ${mine ? "justify-end" : "justify-start"}`}
                                                >
                                                    <div
                                                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                                                            mine
                                                                ? "bg-blue-600 text-white"
                                                                : "bg-slate-100 text-slate-800"
                                                        }`}
                                                    >
                                                        {!mine && (
                                                            <div className="text-xs font-bold text-slate-500">
                                                                {message.sender?.name ?? "-"}
                                                            </div>
                                                        )}

                                                        <div className="whitespace-pre-wrap break-words text-sm leading-6">
                                                            {message.body}
                                                        </div>

                                                        <div className={`mt-1 text-[11px] ${mine ? "text-blue-100" : "text-slate-400"}`}>
                                                            {formatDateTime(message.created_at)}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                <form onSubmit={sendMessage} className="mt-4 flex gap-2">
                                    <input
                                        type="text"
                                        value={draft}
                                        maxLength={2000}
                                        onChange={(e) => setDraft(e.target.value)}
                                        placeholder={t.chatPlaceholder}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                    />

                                    <button
                                        type="submit"
                                        disabled={sending || !draft.trim()}
                                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <i className="bi bi-send"></i>
                                        {t.chatSend}
                                    </button>
                                </form>
                            </div>
                        </section>
                        )}

                        {/* PHOTOS AND VIDEO */}
                        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 px-6 py-5">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                                            <i className="bi bi-images"></i>
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-slate-900">
                                                {t.media}
                                            </h3>

                                            <p className="mt-0.5 text-sm text-slate-500">
                                                {t.mediaDesc}
                                            </p>
                                        </div>
                                    </div>

                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                                        {files.length}/10
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                {files.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {files.map((file) => (
                                            <figure key={file.id} className="overflow-hidden rounded-xl border border-slate-200">
                                                {file.mime_type?.startsWith("video/") ? (
                                                    <video
                                                        src={`/api/maintenance/attachments/${file.id}`}
                                                        controls
                                                        preload="metadata"
                                                        className="h-48 w-full bg-slate-900 object-contain"
                                                    />
                                                ) : (
                                                    <a
                                                        href={`/api/maintenance/attachments/${file.id}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        <img
                                                            src={`/api/maintenance/attachments/${file.id}`}
                                                            alt={file.original_name}
                                                            className="h-48 w-full bg-slate-50 object-cover"
                                                        />
                                                    </a>
                                                )}

                                                <figcaption className="flex items-center justify-between gap-2 px-3 py-2 text-xs text-slate-500">
                                                    <span className="min-w-0 truncate">
                                                        {file.uploader?.name ?? "-"} · {formatDateTime(file.created_at)}
                                                    </span>

                                                    {openJob && (isAdmin || file.user_id === user.id) && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeAttachment(file.id)}
                                                            aria-label={t.deleteFile}
                                                            className="shrink-0 text-rose-600 transition hover:text-rose-700"
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    )}
                                                </figcaption>
                                            </figure>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-xl bg-slate-50 px-5 py-8 text-center">
                                        <i className="bi bi-image text-3xl text-slate-300"></i>

                                        <div className="mt-3 font-semibold text-slate-600">
                                            {t.noMedia}
                                        </div>
                                    </div>
                                )}

                                {canAttach && (
                                    <label className={`mt-5 flex cursor-pointer flex-col items-center gap-1 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-5 py-6 text-center ${uploading ? "cursor-wait opacity-60" : ""}`}>
                                        <i className="bi bi-cloud-arrow-up text-2xl text-slate-400"></i>

                                        <span className="font-semibold text-slate-700">
                                            {uploading ? `${t.uploadingMedia} ${progress}%` : t.addMedia}
                                        </span>

                                        <span className="text-xs text-slate-500">
                                            {t.mediaRules}
                                        </span>

                                        <input
                                            type="file"
                                            className="hidden"
                                            multiple
                                            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                                            disabled={uploading}
                                            onChange={uploadFiles}
                                        />
                                    </label>
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

                        {/* STATUS: เปลี่ยนอัตโนมัติตามงานที่เกิดขึ้นจริง */}
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

                            <ol className="mt-5 space-y-4">
                                {[
                                    ["stepReported", item.created_at, true],
                                    ["stepAssigned", item.assigned_at, !!item.technician_id],
                                    ["stepInProgress", item.started_at, !!item.started_at],
                                    ["stepHandedOver", item.handed_over_at, !!item.handed_over_at || item.status === "completed"],
                                    ["stepCompleted", item.confirmed_at ?? item.completed_at, item.status === "completed"],
                                ].map(([key, at, done], index, steps) => (
                                    <li key={key} className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <span
                                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                                    done
                                                        ? "bg-emerald-500 text-white"
                                                        : "bg-slate-100 text-slate-400"
                                                }`}
                                            >
                                                {done ? <i className="bi bi-check-lg"></i> : index + 1}
                                            </span>

                                            {index < steps.length - 1 && (
                                                <span className={`mt-1 w-0.5 flex-1 ${done ? "bg-emerald-200" : "bg-slate-100"}`} />
                                            )}
                                        </div>

                                        <div className="pb-1">
                                            <div className={`font-semibold ${done ? "text-slate-900" : "text-slate-400"}`}>
                                                {t[key]}
                                            </div>

                                            {done && at && (
                                                <div className="mt-0.5 text-xs text-slate-400">
                                                    {formatDateTime(at)}
                                                </div>
                                            )}

                                            {key === "stepInProgress" && item.status === "waiting_parts" && (
                                                <span className="mt-1 inline-flex rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700">
                                                    {t.waitingParts}
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ol>

                            {item.status === "cancelled" ? (
                                <div className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                                    <i className="bi bi-x-circle mr-2"></i>
                                    {t.jobCancelled}
                                </div>
                            ) : item.status === "completed" && item.confirmed_by ? (
                                <p className="mt-5 text-xs leading-5 text-slate-500">
                                    {t.confirmedBy}{" "}
                                    <span className="font-semibold text-slate-700">
                                        {item.confirmed_by === item.user_id
                                            ? (item.requester?.name ?? "-")
                                            : t.admin}
                                    </span>
                                </p>
                            ) : (
                                <p className="mt-5 text-xs leading-5 text-slate-500">
                                    {t.statusAuto}
                                </p>
                            )}

                        </section>

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
                            ) : isStaff && item.status !== "completed" ? (
                                <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-500">
                                    {t.invoiceAfterConfirm}
                                </p>
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
