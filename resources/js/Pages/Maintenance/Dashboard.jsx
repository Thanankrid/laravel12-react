import React, { useEffect, useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MaintenanceLayout from '@/Layouts/MaintenanceLayout';
import useFixFlowSettings from '@/hooks/useFixFlowSettings';

export default function Dashboard() {
    const { language } = useFixFlowSettings();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const text = {
        th: {
            title: 'แดชบอร์ด',
            pageTitle: 'ภาพรวมงานซ่อม',
            description:
                'ติดตามสถานะและภาพรวมงานซ่อมทั้งหมดในระบบ',

            newRequest: 'แจ้งซ่อมใหม่',

            total: 'งานทั้งหมด',
            pending: 'รอดำเนินการ',
            progress: 'กำลังดำเนินการ',
            completed: 'เสร็จสิ้น',

            recent: 'รายการแจ้งซ่อมล่าสุด',
            recentDescription: 'งานล่าสุดที่ถูกเพิ่มเข้ามาในระบบ',
            viewAll: 'ดูทั้งหมด',

            requestNo: 'เลขที่',
            detail: 'รายละเอียด',
            location: 'สถานที่',
            status: 'สถานะ',
            action: 'จัดการ',

            viewDetail: 'ดูรายละเอียด',

            noRequests: 'ยังไม่มีรายการแจ้งซ่อม',
            noRequestsDescription:
                'เมื่อมีการแจ้งซ่อม รายการจะแสดงที่นี่',

            loading: 'กำลังโหลดข้อมูล...',

            quickActions: 'เมนูด่วน',
            quickDescription:
                'เข้าถึงฟังก์ชันที่ใช้บ่อยได้อย่างรวดเร็ว',

            createRequest: 'สร้างใบแจ้งซ่อม',
            allRequests: 'ตรวจสอบงานทั้งหมด',
            invoices: 'ตรวจสอบใบแจ้งหนี้',

            systemTitle: 'FixFlow',
            systemDescription:
                'ระบบบริหารจัดการงานซ่อมบำรุง ตั้งแต่การแจ้งปัญหา มอบหมายช่าง ติดตามสถานะ บันทึกการซ่อม และออกใบแจ้งหนี้',

            pendingStatus: 'รอดำเนินการ',
            assignedStatus: 'มอบหมายแล้ว',
            inProgressStatus: 'กำลังซ่อม',
            waitingStatus: 'รออะไหล่',
            completedStatus: 'เสร็จสิ้น',
            cancelledStatus: 'ยกเลิก',
        },

        en: {
            title: 'Dashboard',
            pageTitle: 'Maintenance Overview',
            description:
                'Track maintenance requests and overall system activity.',

            newRequest: 'New Request',

            total: 'Total Requests',
            pending: 'Pending',
            progress: 'In Progress',
            completed: 'Completed',

            recent: 'Recent Repair Requests',
            recentDescription:
                'Latest maintenance requests added to the system.',
            viewAll: 'View All',

            requestNo: 'Request No.',
            detail: 'Details',
            location: 'Location',
            status: 'Status',
            action: 'Action',

            viewDetail: 'View Details',

            noRequests: 'No repair requests yet',
            noRequestsDescription:
                'New repair requests will appear here.',

            loading: 'Loading data...',

            quickActions: 'Quick Actions',
            quickDescription:
                'Access frequently used features.',

            createRequest: 'Create Repair Request',
            allRequests: 'View All Requests',
            invoices: 'View Invoices',

            systemTitle: 'FixFlow',
            systemDescription:
                'Maintenance management from issue reporting and technician assignment to repair tracking and invoicing.',

            pendingStatus: 'Pending',
            assignedStatus: 'Assigned',
            inProgressStatus: 'In Progress',
            waitingStatus: 'Waiting for Parts',
            completedStatus: 'Completed',
            cancelledStatus: 'Cancelled',
        },
    };

    const t = text[language] ?? text.th;

    const loadRequests = async () => {
        setLoading(true);

        try {
            const response = await axios.get(
                '/api/maintenance/requests'
            );

            setRequests(
                response.data.data ?? []
            );
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const stats = useMemo(() => {
        return {
            total: requests.length,

            pending: requests.filter(
                (item) =>
                    item.status === 'pending'
            ).length,

            inProgress: requests.filter(
                (item) =>
                    item.status === 'assigned' ||
                    item.status === 'in_progress' ||
                    item.status === 'waiting_parts'
            ).length,

            completed: requests.filter(
                (item) =>
                    item.status === 'completed'
            ).length,
        };
    }, [requests]);

    const recentRequests = requests.slice(0, 5);

    const statusText = {
        pending: t.pendingStatus,
        assigned: t.assignedStatus,
        in_progress: t.inProgressStatus,
        waiting_parts: t.waitingStatus,
        completed: t.completedStatus,
        cancelled: t.cancelledStatus,
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

        completed:
            'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',

        cancelled:
            'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200',
    };

    const statCards = [
        {
            title: t.total,
            value: stats.total,
            icon: 'bi-clipboard-data',
            iconBox:
                'bg-indigo-50 text-indigo-600',
        },
        {
            title: t.pending,
            value: stats.pending,
            icon: 'bi-hourglass-split',
            iconBox:
                'bg-amber-50 text-amber-600',
        },
        {
            title: t.progress,
            value: stats.inProgress,
            icon: 'bi-gear',
            iconBox:
                'bg-blue-50 text-blue-600',
        },
        {
            title: t.completed,
            value: stats.completed,
            icon: 'bi-check-circle',
            iconBox:
                'bg-emerald-50 text-emerald-600',
        },
    ];

    return (
        <MaintenanceLayout title={t.title}>
            <Head title={t.title} />

            <div className="space-y-6">

                {/* HEADER */}
                <section className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                            {t.pageTitle}
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            {t.description}
                        </p>
                    </div>

                    <Link
                        href="/maintenance/requests/create"
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-blue-600
                            px-5 py-3
                            text-sm
                            font-semibold
                            text-white
                            no-underline
                            shadow-lg
                            shadow-blue-600/20
                            transition
                            hover:bg-blue-700
                        "
                    >
                        <i className="bi bi-plus-lg"></i>

                        {t.newRequest}
                    </Link>

                </section>


                {/* STATS */}
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    {statCards.map((card) => (
                        <div
                            key={card.title}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-center justify-between gap-4">

                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        {card.title}
                                    </p>

                                    <div className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
                                        {card.value}
                                    </div>
                                </div>

                                <div
                                    className={`
                                        flex h-14 w-14
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        ${card.iconBox}
                                    `}
                                >
                                    <i
                                        className={`bi ${card.icon} text-2xl`}
                                    ></i>
                                </div>

                            </div>
                        </div>
                    ))}

                </section>


                <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">

                    {/* RECENT */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">

                            <div>
                                <h3 className="text-xl font-bold text-slate-900">
                                    {t.recent}
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    {t.recentDescription}
                                </p>
                            </div>

                            <Link
                                href="/maintenance/requests"
                                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 no-underline transition hover:bg-slate-100 hover:text-slate-900"
                            >
                                {t.viewAll}
                            </Link>

                        </div>


                        {loading ? (
                            <div className="flex min-h-[260px] items-center justify-center">

                                <div className="flex flex-col items-center gap-3 text-slate-500">

                                    <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                                    <span className="text-sm">
                                        {t.loading}
                                    </span>

                                </div>

                            </div>
                        ) : recentRequests.length === 0 ? (
                            <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">

                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                    <i className="bi bi-inbox text-2xl"></i>
                                </div>

                                <div className="mt-4 font-semibold text-slate-800">
                                    {t.noRequests}
                                </div>

                                <p className="mt-1 text-sm text-slate-500">
                                    {t.noRequestsDescription}
                                </p>

                            </div>
                        ) : (
                            <>
                            {/* มือถือ: แสดงเป็นการ์ดแทนตาราง */}
                            <div className="divide-y divide-slate-100 md:hidden">
                                {recentRequests.map((item) => (
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
                                    </Link>
                                ))}
                            </div>

                            <div className="hidden w-full md:block">

                                <table className="w-full table-fixed">

                                    <thead className="bg-slate-50">

                                        <tr className="border-b border-slate-200">

                                            <th className="w-[20%] px-5 py-3 text-left text-xs font-bold text-slate-500">
                                                {t.requestNo}
                                            </th>

                                            <th className="w-[32%] px-5 py-3 text-left text-xs font-bold text-slate-500">
                                                {t.detail}
                                            </th>

                                            <th className="w-[18%] px-5 py-3 text-left text-xs font-bold text-slate-500">
                                                {t.location}
                                            </th>

                                            <th className="w-[20%] px-5 py-3 text-left text-xs font-bold text-slate-500">
                                                {t.status}
                                            </th>

                                            <th className="w-[10%] px-5 py-3 text-right text-xs font-bold text-slate-500">
                                                {t.action}
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody className="divide-y divide-slate-100">

                                        {recentRequests.map(
                                            (item) => (
                                                <tr
                                                    key={item.id}
                                                    className="transition hover:bg-slate-50/80"
                                                >

                                                    <td className="px-5 py-4 align-top">

                                                        <div className="whitespace-nowrap text-sm font-bold text-slate-900">
                                                            {item.request_no}
                                                        </div>

                                                    </td>


                                                    <td className="px-5 py-4 align-top">

                                                        <div className="truncate font-semibold text-slate-900">
                                                            {item.title}
                                                        </div>

                                                        <div className="mt-1 truncate text-sm text-slate-500">
                                                            {item.equipment_type}
                                                        </div>

                                                    </td>


                                                    <td className="px-5 py-4 align-top text-sm text-slate-700">

                                                        <div className="truncate">
                                                            {item.location}
                                                        </div>

                                                    </td>


                                                    <td className="px-5 py-4 align-top">

                                                        <span
                                                            className={`
                                                                inline-flex
                                                                whitespace-nowrap
                                                                rounded-full
                                                                px-3 py-1.5
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


                                                    <td className="px-5 py-4 text-right align-top">

                                                        <Link
                                                            href={`/maintenance/requests/${item.id}`}
                                                            className="inline-flex items-center justify-center rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-600 no-underline transition hover:bg-blue-50"
                                                            title={t.viewDetail}
                                                            aria-label={t.viewDetail}
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                        </Link>

                                                    </td>

                                                </tr>
                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>
                            </>
                        )}

                    </div>


                    {/* QUICK ACTIONS */}
                    <div className="space-y-6">

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                            <h3 className="text-xl font-bold text-slate-900">
                                {t.quickActions}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                {t.quickDescription}
                            </p>


                            <div className="mt-5 space-y-3">

                                <Link
                                    href="/maintenance/requests/create"
                                    className="flex items-center gap-3 rounded-xl bg-blue-600 px-4 py-4 font-semibold text-white no-underline transition hover:bg-blue-700"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                                        <i className="bi bi-plus-circle"></i>
                                    </div>

                                    {t.createRequest}
                                </Link>


                                <Link
                                    href="/maintenance/requests"
                                    className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-4 font-semibold text-slate-700 no-underline transition hover:bg-slate-100"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm">
                                        <i className="bi bi-list-check"></i>
                                    </div>

                                    {t.allRequests}
                                </Link>


                                <Link
                                    href="/maintenance/invoices"
                                    className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-4 font-semibold text-slate-700 no-underline transition hover:bg-slate-100"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm">
                                        <i className="bi bi-receipt"></i>
                                    </div>

                                    {t.invoices}
                                </Link>

                            </div>

                        </div>


                        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-blue-700 p-6 text-white shadow-xl shadow-blue-950/10">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                                <i className="bi bi-shield-check text-xl"></i>
                            </div>

                            <h3 className="mt-5 text-xl font-bold">
                                {t.systemTitle}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-blue-100/80">
                                {t.systemDescription}
                            </p>

                        </div>

                    </div>

                </section>

            </div>
        </MaintenanceLayout>
    );
}