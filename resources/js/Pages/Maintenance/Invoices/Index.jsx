import React, { useEffect, useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MaintenanceLayout from '@/Layouts/MaintenanceLayout';
import useFixFlowSettings from '@/hooks/useFixFlowSettings';

export default function Index() {
    const { language } = useFixFlowSettings();

    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');

    const text = {
        th: {
            layoutTitle: 'ใบแจ้งหนี้',
            title: 'ใบแจ้งหนี้',
            description:
                'ตรวจสอบค่าใช้จ่ายงานซ่อมและสถานะการชำระเงิน',

            totalInvoices: 'ใบแจ้งหนี้ทั้งหมด',
            unpaid: 'ยังไม่ชำระ',
            paid: 'ชำระแล้ว',
            cancelled: 'ยกเลิก',
            totalValue: 'มูลค่ารวม',

            searchInvoice: 'ค้นหาใบแจ้งหนี้',
            searchPlaceholder:
                'ค้นหาเลข Invoice, เลขงานซ่อม, หัวข้อ หรือชื่อผู้แจ้ง...',

            paymentStatus: 'สถานะการชำระเงิน',
            allStatuses: 'ทุกสถานะ',

            invoiceList: 'รายการใบแจ้งหนี้',
            found: 'พบ',
            records: 'รายการ',

            invoice: 'ใบแจ้งหนี้',
            request: 'งานซ่อม',
            requester: 'ผู้แจ้ง',
            labor: 'ค่าแรง',
            parts: 'ค่าอะไหล่',
            total: 'ยอดรวม',
            manage: 'จัดการ',

            view: 'ดู',

            loading: 'กำลังโหลดใบแจ้งหนี้...',
            noInvoices: 'ไม่พบใบแจ้งหนี้',
            noInvoicesDescription:
                'ลองเปลี่ยนคำค้นหาหรือสถานะ',

            updateSuccess:
                'อัปเดตสถานะการชำระเงินสำเร็จ',
            updateError:
                'ไม่สามารถอัปเดตสถานะได้',

            loadError:
                'ไม่สามารถโหลดข้อมูลใบแจ้งหนี้ได้',

            totalBadge: 'ทั้งหมด',
            sheets: 'ใบ',
        },

        en: {
            layoutTitle: 'Invoices',
            title: 'Invoices',
            description:
                'Review maintenance costs and payment status.',

            totalInvoices: 'Total Invoices',
            unpaid: 'Unpaid',
            paid: 'Paid',
            cancelled: 'Cancelled',
            totalValue: 'Total Value',

            searchInvoice: 'Search Invoices',
            searchPlaceholder:
                'Search by invoice number, request, title or requester...',

            paymentStatus: 'Payment Status',
            allStatuses: 'All Statuses',

            invoiceList: 'Invoice List',
            found: 'Found',
            records: 'records',

            invoice: 'Invoice',
            request: 'Repair Request',
            requester: 'Requester',
            labor: 'Labor',
            parts: 'Parts',
            total: 'Total',
            manage: 'Manage',

            view: 'View',

            loading: 'Loading invoices...',
            noInvoices: 'No invoices found',
            noInvoicesDescription:
                'Try changing your search or payment status.',

            updateSuccess:
                'Payment status updated successfully',
            updateError:
                'Unable to update payment status',

            loadError:
                'Unable to load invoices',

            totalBadge: 'Total',
            sheets: '',
        },
    };

    const t = text[language] ?? text.th;

    const loadInvoices = async () => {
        setLoading(true);

        try {
            const response = await axios.get(
                '/api/maintenance/invoices'
            );

            setInvoices(response.data ?? []);
        } catch (error) {
            console.error(error);
            alert(t.loadError);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInvoices();
    }, []);

    const filteredInvoices = useMemo(() => {
        const keyword = search
            .trim()
            .toLowerCase();

        return invoices.filter((invoice) => {
            const matchesSearch =
                !keyword ||
                invoice.invoice_no
                    ?.toLowerCase()
                    .includes(keyword) ||
                invoice.request?.request_no
                    ?.toLowerCase()
                    .includes(keyword) ||
                invoice.request?.title
                    ?.toLowerCase()
                    .includes(keyword) ||
                invoice.request?.requester?.name
                    ?.toLowerCase()
                    .includes(keyword);

            const matchesStatus =
                !status ||
                invoice.payment_status === status;

            return matchesSearch && matchesStatus;
        });
    }, [invoices, search, status]);

    const summary = useMemo(() => {
        return {
            total: invoices.length,

            unpaid: invoices.filter(
                (invoice) =>
                    invoice.payment_status === 'unpaid'
            ).length,

            paid: invoices.filter(
                (invoice) =>
                    invoice.payment_status === 'paid'
            ).length,

            totalAmount: invoices
                .filter(
                    (invoice) =>
                        invoice.payment_status !==
                        'cancelled'
                )
                .reduce(
                    (sum, invoice) =>
                        sum +
                        Number(
                            invoice.total_amount || 0
                        ),
                    0
                ),
        };
    }, [invoices]);

    const paymentText = {
        unpaid: t.unpaid,
        paid: t.paid,
        cancelled: t.cancelled,
    };

    const paymentClass = {
        unpaid:
            'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',

        paid:
            'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',

        cancelled:
            'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200',
    };

    const formatMoney = (value) => {
        return Number(value || 0).toLocaleString(
            language === 'en' ? 'en-US' : 'th-TH',
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );
    };

    const formatDate = (value) => {
        if (!value) return '-';

        return new Date(value).toLocaleDateString(
            language === 'en' ? 'en-US' : 'th-TH',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            }
        );
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

                    <div className="inline-flex items-center gap-2 self-start rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 xl:self-auto">
                        <i className="bi bi-receipt"></i>

                        {t.totalBadge} {invoices.length}{' '}
                        {t.sheets}
                    </div>

                </section>


                {/* SUMMARY */}
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>
                                <div className="text-sm font-medium text-slate-500">
                                    {t.totalInvoices}
                                </div>

                                <div className="mt-2 text-3xl font-bold text-slate-900">
                                    {summary.total}
                                </div>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <i className="bi bi-files text-xl"></i>
                            </div>

                        </div>

                    </div>


                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>
                                <div className="text-sm font-medium text-slate-500">
                                    {t.unpaid}
                                </div>

                                <div className="mt-2 text-3xl font-bold text-amber-600">
                                    {summary.unpaid}
                                </div>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                <i className="bi bi-hourglass-split text-xl"></i>
                            </div>

                        </div>

                    </div>


                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>
                                <div className="text-sm font-medium text-slate-500">
                                    {t.paid}
                                </div>

                                <div className="mt-2 text-3xl font-bold text-emerald-600">
                                    {summary.paid}
                                </div>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <i className="bi bi-check-circle text-xl"></i>
                            </div>

                        </div>

                    </div>


                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between gap-4">

                            <div>
                                <div className="text-sm font-medium text-slate-500">
                                    {t.totalValue}
                                </div>

                                <div className="mt-2 text-2xl font-bold text-slate-900">
                                    ฿
                                    {formatMoney(
                                        summary.totalAmount
                                    )}
                                </div>
                            </div>

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                <i className="bi bi-cash-stack text-xl"></i>
                            </div>

                        </div>

                    </div>

                </section>


                {/* FILTER */}
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">

                        <div className="lg:col-span-8">

                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                {t.searchInvoice}
                            </label>

                            <div className="relative">

                                <i className="bi bi-search pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
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


                        <div className="lg:col-span-4">

                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                {t.paymentStatus}
                            </label>

                            <select
                                value={status}
                                onChange={(e) =>
                                    setStatus(
                                        e.target.value
                                    )
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
                                    {t.allStatuses}
                                </option>

                                <option value="unpaid">
                                    {t.unpaid}
                                </option>

                                <option value="paid">
                                    {t.paid}
                                </option>

                                <option value="cancelled">
                                    {t.cancelled}
                                </option>
                            </select>

                        </div>

                    </div>

                </section>


                {/* TABLE */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

                        <h3 className="text-lg font-bold text-slate-900">
                            {t.invoiceList}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            {t.found}{' '}
                            {filteredInvoices.length}{' '}
                            {t.records}
                        </p>

                    </div>


                    {loading ? (
                        <div className="flex min-h-[320px] items-center justify-center">

                            <div className="flex flex-col items-center gap-3">

                                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                                <span className="text-sm text-slate-500">
                                    {t.loading}
                                </span>

                            </div>

                        </div>
                    ) : filteredInvoices.length === 0 ? (
                        <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">

                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                <i className="bi bi-receipt text-3xl"></i>
                            </div>

                            <div className="mt-4 font-bold text-slate-700">
                                {t.noInvoices}
                            </div>

                            <div className="mt-1 text-sm text-slate-500">
                                {t.noInvoicesDescription}
                            </div>

                        </div>
                    ) : (

                        <div className="w-full">

                            <table className="w-full table-fixed">

                                <thead className="bg-slate-50">

                                    <tr className="border-b border-slate-200">

                                        <th className="w-[15%] px-4 py-3 text-left text-xs font-bold text-slate-500">
                                            {t.invoice}
                                        </th>

                                        <th className="w-[18%] px-4 py-3 text-left text-xs font-bold text-slate-500">
                                            {t.request}
                                        </th>

                                        <th className="w-[18%] px-4 py-3 text-left text-xs font-bold text-slate-500">
                                            {t.requester}
                                        </th>

                                        <th className="w-[11%] px-4 py-3 text-right text-xs font-bold text-slate-500">
                                            {t.labor}
                                        </th>

                                        <th className="w-[11%] px-4 py-3 text-right text-xs font-bold text-slate-500">
                                            {t.parts}
                                        </th>

                                        <th className="w-[11%] px-4 py-3 text-right text-xs font-bold text-slate-500">
                                            {t.total}
                                        </th>

                                        <th className="w-[16%] px-4 py-3 text-center text-xs font-bold text-slate-500">
                                            {t.manage}
                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y divide-slate-100">

                                    {filteredInvoices.map(
                                        (invoice) => (
                                            <tr
                                                key={invoice.id}
                                                className="transition hover:bg-slate-50/80"
                                            >

                                                <td className="px-4 py-4 align-top">

                                                    <div className="truncate font-bold text-slate-900">
                                                        {invoice.invoice_no}
                                                    </div>

                                                    <div className="mt-1 truncate text-xs text-slate-400">
                                                        {formatDate(
                                                            invoice.issued_at
                                                        )}
                                                    </div>

                                                </td>


                                                <td className="px-4 py-4 align-top">

                                                    <Link
                                                        href={`/maintenance/requests/${invoice.maintenance_request_id}`}
                                                        className="block truncate font-semibold text-blue-600 no-underline transition hover:text-blue-800"
                                                    >
                                                        {invoice.request
                                                            ?.request_no ??
                                                            '-'}
                                                    </Link>

                                                    <div className="mt-1 truncate text-sm text-slate-500">
                                                        {invoice.request
                                                            ?.title ??
                                                            '-'}
                                                    </div>

                                                </td>


                                                <td className="px-4 py-4 align-top">

                                                    <div className="truncate text-sm font-medium text-slate-700">
                                                        {invoice.request
                                                            ?.requester
                                                            ?.name ??
                                                            '-'}
                                                    </div>

                                                </td>


                                                <td className="px-4 py-4 text-right align-top text-sm text-slate-700">
                                                    ฿
                                                    {formatMoney(
                                                        invoice.labor_cost
                                                    )}
                                                </td>


                                                <td className="px-4 py-4 text-right align-top text-sm text-slate-700">
                                                    ฿
                                                    {formatMoney(
                                                        invoice.parts_cost
                                                    )}
                                                </td>


                                                <td className="px-4 py-4 text-right align-top">

                                                    <div className="font-bold text-slate-900">
                                                        ฿
                                                        {formatMoney(
                                                            invoice.total_amount
                                                        )}
                                                    </div>

                                                    <span
                                                        className={`
                                                            mt-2 inline-flex
                                                            rounded-full
                                                            px-2.5 py-1
                                                            text-[11px]
                                                            font-bold
                                                            ${
                                                                paymentClass[
                                                                    invoice
                                                                        .payment_status
                                                                ] ??
                                                                'bg-slate-100 text-slate-600'
                                                            }
                                                        `}
                                                    >
                                                        {paymentText[
                                                            invoice
                                                                .payment_status
                                                        ] ??
                                                            invoice.payment_status}
                                                    </span>

                                                </td>


                                                <td className="px-4 py-4 align-top">

                                                    <div className="flex flex-col gap-2">

                                                        <Link
                                                            href={`/maintenance/invoices/${invoice.id}`}
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                justify-center
                                                                gap-1.5
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
                                                            {t.view}
                                                        </Link>
                                                    </div>

                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>
                    )}

                </section>

            </div>
        </MaintenanceLayout>
    );
}