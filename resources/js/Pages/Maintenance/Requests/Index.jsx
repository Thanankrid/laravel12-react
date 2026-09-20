import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MaintenanceLayout from '@/Layouts/MaintenanceLayout';
import useFixFlowSettings from '@/hooks/useFixFlowSettings';

export default function Index() {
    const { language } = useFixFlowSettings();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');

    const text = {
        th: {
            layoutTitle: 'รายการแจ้งซ่อม',
            title: 'รายการแจ้งซ่อม',
            description:
                'ตรวจสอบ ค้นหา และติดตามสถานะงานซ่อมทั้งหมด',

            newRequest: 'แจ้งซ่อมใหม่',

            search: 'ค้นหา',
            searchPlaceholder:
                'เลขที่แจ้งซ่อม, หัวข้อ, อุปกรณ์ หรือสถานที่',

            status: 'สถานะ',
            allStatus: 'ทุกสถานะ',

            priority: 'ความเร่งด่วน',
            allPriority: 'ทุกระดับ',

            searchButton: 'ค้นหา',
            clear: 'ล้างตัวกรอง',

            allRequests: 'งานซ่อมทั้งหมด',
            found: 'พบ',
            records: 'รายการในหน้านี้',

            requestNo: 'เลขที่',
            details: 'รายละเอียด',
            location: 'สถานที่',
            priorityColumn: 'ความเร่งด่วน',
            statusColumn: 'สถานะ',
            technician: 'ช่าง',
            action: 'จัดการ',

            noTechnician: 'ยังไม่ได้มอบหมาย',
            viewDetail: 'ดูรายละเอียด',

            loading: 'กำลังโหลดรายการ...',
            noData: 'ไม่พบรายการแจ้งซ่อม',
            noDataDescription:
                'ลองเปลี่ยนคำค้นหาหรือตัวกรอง',

            pending: 'รอดำเนินการ',
            assigned: 'มอบหมายแล้ว',
            inProgress: 'กำลังซ่อม',
            waitingParts: 'รออะไหล่',
            awaitingConfirmation: 'รอผู้แจ้งยืนยัน',
            completed: 'เสร็จสิ้น',
            cancelled: 'ยกเลิก',

            low: 'ต่ำ',
            medium: 'ปกติ',
            high: 'สูง',
            urgent: 'เร่งด่วน',
        },

        en: {
            layoutTitle: 'Repair Requests',
            title: 'Repair Requests',
            description:
                'Search, review and track all maintenance requests.',

            newRequest: 'New Request',

            search: 'Search',
            searchPlaceholder:
                'Request number, title, equipment or location',

            status: 'Status',
            allStatus: 'All Statuses',

            priority: 'Priority',
            allPriority: 'All Priorities',

            searchButton: 'Search',
            clear: 'Clear filters',

            allRequests: 'All Repair Requests',
            found: 'Showing',
            records: 'records on this page',

            requestNo: 'Request No.',
            details: 'Details',
            location: 'Location',
            priorityColumn: 'Priority',
            statusColumn: 'Status',
            technician: 'Technician',
            action: 'Action',

            noTechnician: 'Not assigned',
            viewDetail: 'View Details',

            loading: 'Loading requests...',
            noData: 'No repair requests found',
            noDataDescription:
                'Try changing your search or filters.',

            pending: 'Pending',
            assigned: 'Assigned',
            inProgress: 'In Progress',
            waitingParts: 'Waiting for Parts',
            awaitingConfirmation: 'Awaiting Confirmation',
            completed: 'Completed',
            cancelled: 'Cancelled',

            low: 'Low',
            medium: 'Medium',
            high: 'High',
            urgent: 'Urgent',
        },
    };

    const t = text[language] ?? text.th;

    const loadRequests = async () => {
        setLoading(true);

        try {
            const response = await axios.get(
                '/api/maintenance/requests',
                {
                    params: {
                        search,
                        status,
                        priority,
                    },
                }
            );

            setRequests(response.data.data ?? []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        loadRequests();
    };

    const clearFilters = async () => {
        setSearch('');
        setStatus('');
        setPriority('');
        setLoading(true);

        try {
            const response = await axios.get(
                '/api/maintenance/requests'
            );

            setRequests(response.data.data ?? []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
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

    const priorityText = {
        low: t.low,
        medium: t.medium,
        high: t.high,
        urgent: t.urgent,
    };

    const statusClass = {
        pending:
            'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',

        assigned:
            'bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-200',

        in_progress:
            'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',

        waiting_parts:
            'bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200',

        awaiting_confirmation:
            'bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200',

        completed:
            'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',

        cancelled:
            'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200',
    };

    const priorityClass = {
        low:
            'bg-slate-100 text-slate-600',

        medium:
            'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',

        high:
            'bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200',

        urgent:
            'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200',
    };

    return (
        <MaintenanceLayout title={t.layoutTitle}>
            <Head title={t.title} />

            <div className="space-y-6">

                {/* HEADER */}
                <section className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                            {t.title}
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            {t.description}
                        </p>
                    </div>

                    <Link
                        href="/maintenance/requests/create"
                        className="
                            inline-flex items-center justify-center gap-2
                            rounded-xl
                            bg-blue-600
                            px-5 py-3
                            text-sm font-semibold
                            text-white
                            no-underline
                            shadow-lg shadow-blue-600/20
                            transition
                            hover:bg-blue-700
                        "
                    >
                        <i className="bi bi-plus-lg"></i>
                        {t.newRequest}
                    </Link>

                </section>


                {/* FILTER */}
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                    <form
                        onSubmit={handleSearch}
                        className="grid grid-cols-1 gap-4 lg:grid-cols-12"
                    >

                        {/* SEARCH */}
                        <div className="lg:col-span-5">

                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                {t.search}
                            </label>

                            <div className="relative">

                                <i className="bi bi-search pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    placeholder={t.searchPlaceholder}
                                    className="
                                        w-full
                                        rounded-xl
                                        border border-slate-200
                                        bg-white
                                        py-3 pl-11 pr-4
                                        text-sm text-slate-900
                                        outline-none
                                        transition
                                        placeholder:text-slate-400
                                        focus:border-blue-500
                                        focus:ring-4
                                        focus:ring-blue-500/10
                                    "
                                />

                            </div>

                        </div>


                        {/* STATUS */}
                        <div className="lg:col-span-3">

                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                {t.status}
                            </label>

                            <select
                                value={status}
                                onChange={(e) =>
                                    setStatus(e.target.value)
                                }
                                className="
                                    w-full
                                    rounded-xl
                                    border border-slate-200
                                    bg-white
                                    px-4 py-3
                                    text-sm text-slate-900
                                    outline-none
                                    transition
                                    focus:border-blue-500
                                    focus:ring-4
                                    focus:ring-blue-500/10
                                "
                            >
                                <option value="">
                                    {t.allStatus}
                                </option>

                                <option value="pending">
                                    {t.pending}
                                </option>

                                <option value="assigned">
                                    {t.assigned}
                                </option>

                                <option value="in_progress">
                                    {t.inProgress}
                                </option>

                                <option value="waiting_parts">
                                    {t.waitingParts}
                                </option>

                                <option value="awaiting_confirmation">
                                    {t.awaitingConfirmation}
                                </option>

                                <option value="completed">
                                    {t.completed}
                                </option>

                                <option value="cancelled">
                                    {t.cancelled}
                                </option>
                            </select>

                        </div>


                        {/* PRIORITY */}
                        <div className="lg:col-span-2">

                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                {t.priority}
                            </label>

                            <select
                                value={priority}
                                onChange={(e) =>
                                    setPriority(e.target.value)
                                }
                                className="
                                    w-full
                                    rounded-xl
                                    border border-slate-200
                                    bg-white
                                    px-4 py-3
                                    text-sm text-slate-900
                                    outline-none
                                    transition
                                    focus:border-blue-500
                                    focus:ring-4
                                    focus:ring-blue-500/10
                                "
                            >
                                <option value="">
                                    {t.allPriority}
                                </option>

                                <option value="low">
                                    {t.low}
                                </option>

                                <option value="medium">
                                    {t.medium}
                                </option>

                                <option value="high">
                                    {t.high}
                                </option>

                                <option value="urgent">
                                    {t.urgent}
                                </option>
                            </select>

                        </div>


                        {/* BUTTONS */}
                        <div className="flex items-end gap-2 lg:col-span-2">

                            <button
                                type="submit"
                                className="
                                    flex-1
                                    rounded-xl
                                    bg-slate-900
                                    px-4 py-3
                                    text-sm font-semibold
                                    text-white
                                    transition
                                    hover:bg-slate-800
                                "
                            >
                                {t.searchButton}
                            </button>

                            <button
                                type="button"
                                onClick={clearFilters}
                                title={t.clear}
                                className="
                                    rounded-xl
                                    border border-slate-200
                                    bg-white
                                    px-4 py-3
                                    text-sm font-semibold
                                    text-slate-600
                                    transition
                                    hover:bg-slate-50
                                "
                            >
                                <i className="bi bi-arrow-counterclockwise"></i>
                            </button>

                        </div>

                    </form>

                </section>


                {/* TABLE */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

                        <h3 className="text-lg font-bold text-slate-900">
                            {t.allRequests}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            {t.found} {requests.length} {t.records}
                        </p>

                    </div>


                    {loading ? (
                        <div className="flex min-h-[300px] items-center justify-center">

                            <div className="flex flex-col items-center gap-3">

                                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                                <span className="text-sm text-slate-500">
                                    {t.loading}
                                </span>

                            </div>

                        </div>
                    ) : requests.length === 0 ? (

                        <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                <i className="bi bi-inbox text-3xl"></i>
                            </div>

                            <h3 className="mt-4 font-bold text-slate-800">
                                {t.noData}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                {t.noDataDescription}
                            </p>

                        </div>

                    ) : (

                        <>
                        {/* มือถือ: แสดงเป็นการ์ดแทนตารางที่แคบเกินไป */}
                        <div className="divide-y divide-slate-100 md:hidden">
                            {requests.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/maintenance/requests/${item.id}`}
                                    className="block px-5 py-4 no-underline transition hover:bg-slate-50/80"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="font-bold text-slate-900">
                                            {item.request_no}
                                        </span>
                                        <span className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${statusClass[item.status] ?? 'bg-slate-100 text-slate-600'}`}>
                                            {statusText[item.status] ?? item.status}
                                        </span>
                                    </div>
                                    <div className="mt-2 font-semibold text-slate-900">
                                        {item.title}
                                    </div>
                                    <div className="mt-1 text-sm text-slate-500">
                                        {item.equipment_type} · {item.location}
                                    </div>
                                    <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                                        <span className={`inline-flex rounded-full px-2.5 py-1 font-bold ${priorityClass[item.priority] ?? 'bg-slate-100 text-slate-600'}`}>
                                            {priorityText[item.priority] ?? item.priority}
                                        </span>
                                        <span className="truncate text-slate-500">
                                            {item.technician?.name ?? t.noTechnician}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="hidden w-full md:block">

                            <table className="w-full table-fixed">

                                <thead className="bg-slate-50">

                                    <tr className="border-b border-slate-200">

                                        <th className="w-[13%] px-4 py-3 text-left text-xs font-bold text-slate-500">
                                            {t.requestNo}
                                        </th>

                                        <th className="w-[24%] px-4 py-3 text-left text-xs font-bold text-slate-500">
                                            {t.details}
                                        </th>

                                        <th className="w-[16%] px-4 py-3 text-left text-xs font-bold text-slate-500">
                                            {t.location}
                                        </th>

                                        <th className="w-[11%] px-4 py-3 text-left text-xs font-bold text-slate-500">
                                            {t.priorityColumn}
                                        </th>

                                        <th className="w-[13%] px-4 py-3 text-left text-xs font-bold text-slate-500">
                                            {t.statusColumn}
                                        </th>

                                        <th className="w-[13%] px-4 py-3 text-left text-xs font-bold text-slate-500">
                                            {t.technician}
                                        </th>

                                        <th className="w-[10%] px-4 py-3 text-right text-xs font-bold text-slate-500">
                                            {t.action}
                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y divide-slate-100">

                                    {requests.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="transition hover:bg-slate-50/80"
                                        >

                                            {/* REQUEST NUMBER */}
                                            <td className="px-4 py-4 align-top">

                                                <div className="whitespace-nowrap text-sm font-bold text-slate-900">
                                                    {item.request_no}
                                                </div>

                                                <div className="mt-1 text-xs text-slate-400">
                                                    #{item.id}
                                                </div>

                                            </td>


                                            {/* DETAILS */}
                                            <td className="px-4 py-4 align-top">

                                                <div className="truncate font-semibold text-slate-900">
                                                    {item.title}
                                                </div>

                                                <div className="mt-1 flex items-center gap-2 truncate text-sm text-slate-500">

                                                    <i className="bi bi-pc-display shrink-0"></i>

                                                    <span className="truncate">
                                                        {item.equipment_type}
                                                    </span>

                                                </div>

                                            </td>


                                            {/* LOCATION */}
                                            <td className="px-4 py-4 align-top text-sm text-slate-700">

                                                <div className="flex items-center gap-1.5">

                                                    <i className="bi bi-geo-alt shrink-0 text-slate-400"></i>

                                                    <span className="truncate">
                                                        {item.location}
                                                    </span>

                                                </div>

                                            </td>


                                            {/* PRIORITY */}
                                            <td className="px-4 py-4 align-top">

                                                <span
                                                    className={`
                                                        inline-flex
                                                        rounded-full
                                                        px-2.5 py-1.5
                                                        text-xs
                                                        font-bold
                                                        ${
                                                            priorityClass[
                                                                item.priority
                                                            ] ??
                                                            'bg-slate-100 text-slate-600'
                                                        }
                                                    `}
                                                >
                                                    {priorityText[
                                                        item.priority
                                                    ] ??
                                                        item.priority}
                                                </span>

                                            </td>


                                            {/* STATUS */}
                                            <td className="px-4 py-4 align-top">

                                                <span
                                                    className={`
                                                        inline-flex
                                                        rounded-full
                                                        px-2.5 py-1.5
                                                        text-xs
                                                        font-bold
                                                        ${
                                                            statusClass[
                                                                item.status
                                                            ] ??
                                                            'bg-slate-100 text-slate-600'
                                                        }
                                                    `}
                                                >
                                                    {statusText[
                                                        item.status
                                                    ] ??
                                                        item.status}
                                                </span>

                                            </td>


                                            {/* TECHNICIAN */}
                                            <td className="px-4 py-4 align-top text-sm text-slate-700">

                                                {item.technician ? (
                                                    <div className="flex items-center gap-2">

                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                                                            {item.technician.name
                                                                ?.charAt(0)
                                                                .toUpperCase()}
                                                        </div>

                                                        <span className="truncate">
                                                            {item.technician.name}
                                                        </span>

                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400">
                                                        {t.noTechnician}
                                                    </span>
                                                )}

                                            </td>


                                            {/* ACTION */}
                                            <td className="px-4 py-4 text-right align-top">

                                                <Link
                                                    href={`/maintenance/requests/${item.id}`}
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        border
                                                        border-blue-200
                                                        bg-white
                                                        px-3 py-2
                                                        text-xs
                                                        font-semibold
                                                        text-blue-600
                                                        no-underline
                                                        transition
                                                        hover:bg-blue-50
                                                    "
                                                >
                                                    <i className="bi bi-eye"></i>
                                                </Link>

                                            </td>

                                        </tr>
                                    ))}

                                </tbody>

                            </table>

                        </div>
                        </>
                    )}

                </section>

            </div>
        </MaintenanceLayout>
    );
}