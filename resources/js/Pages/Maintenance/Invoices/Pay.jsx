import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MaintenanceLayout from '@/Layouts/MaintenanceLayout';
import useFixFlowSettings from '@/hooks/useFixFlowSettings';

// หน้าชำระเงินแบบจำลองสำหรับสาธิต: ไม่มีการตัดเงินจริง
// และเลขบัตรเต็มไม่ถูกส่งไปที่เซิร์ฟเวอร์ (ส่งเพียง token แบบเดียวกับผู้ให้บริการชำระเงินจริง)
const text = {
    th: {
        title: 'ชำระเงิน',
        back: 'กลับไปที่งานซ่อม',
        demo: 'โหมดจำลองการชำระเงิน — ไม่มีการตัดเงินจริง',
        amountDue: 'ยอดที่ต้องชำระ',
        invoiceNo: 'เลขที่ใบแจ้งหนี้',
        requestNo: 'เลขที่งานซ่อม',
        labor: 'ค่าแรง',
        parts: 'ค่าอะไหล่',
        promptpay: 'พร้อมเพย์',
        card: 'บัตรเครดิต/เดบิต',
        scanHint: 'QR ตัวอย่างสำหรับสาธิต ใช้ชำระเงินจริงไม่ได้',
        simulateScan: 'จำลองการสแกนจ่ายสำเร็จ',
        cardName: 'ชื่อบนบัตร',
        cardNumber: 'หมายเลขบัตร',
        expiry: 'วันหมดอายุ (MM/YY)',
        cvc: 'CVC',
        payNow: 'ชำระเงิน',
        testCards:
            'บัตรทดสอบ: 4242 4242 4242 4242 = สำเร็จ · 4000 0000 0000 0002 = ถูกปฏิเสธ (วันหมดอายุในอนาคต CVC 3 หลักใดก็ได้)',
        invalidCard:
            'ข้อมูลบัตรไม่ถูกต้อง กรุณาตรวจสอบชื่อ หมายเลขบัตร วันหมดอายุ และ CVC',
        processing: 'กำลังประมวลผลการชำระเงิน...',
        success: 'ชำระเงินสำเร็จ',
        paidAt: 'ชำระเมื่อ',
        method: 'ช่องทาง',
        reference: 'เลขอ้างอิง',
        cancelled: 'ใบแจ้งหนี้นี้ถูกยกเลิกแล้ว ไม่ต้องชำระเงิน',
        loading: 'กำลังโหลดข้อมูล...',
        loadError: 'ไม่สามารถโหลดใบแจ้งหนี้ได้',
        payError: 'ชำระเงินไม่สำเร็จ กรุณาลองใหม่',
    },
    en: {
        title: 'Payment',
        back: 'Back to repair request',
        demo: 'Simulated payment — no real money is charged',
        amountDue: 'Amount due',
        invoiceNo: 'Invoice No.',
        requestNo: 'Repair Request No.',
        labor: 'Labor',
        parts: 'Parts',
        promptpay: 'PromptPay',
        card: 'Credit/debit card',
        scanHint: 'Demo QR code for the simulation. It cannot take real payments.',
        simulateScan: 'Simulate a successful scan',
        cardName: 'Name on card',
        cardNumber: 'Card number',
        expiry: 'Expiry (MM/YY)',
        cvc: 'CVC',
        payNow: 'Pay now',
        testCards:
            'Test cards: 4242 4242 4242 4242 = success · 4000 0000 0000 0002 = declined (any future expiry, any 3-digit CVC)',
        invalidCard:
            'Check the name, card number, expiry date and CVC.',
        processing: 'Processing payment...',
        success: 'Payment successful',
        paidAt: 'Paid at',
        method: 'Method',
        reference: 'Reference',
        cancelled: 'This invoice was cancelled. Nothing to pay.',
        loading: 'Loading invoice...',
        loadError: 'Unable to load invoice',
        payError: 'Payment failed. Please try again.',
    },
};

// QR ตกแต่งที่สร้างจากเลขใบแจ้งหนี้ (ไม่มีข้อมูลบัญชีจริง จึงสแกนจ่ายไม่ได้)
function DemoQr({ seed }) {
    let hash = [...seed].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0, 7);
    const cells = [];
    const finder = (x, y) => (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
    for (let y = 0; y < 21; y++) {
        for (let x = 0; x < 21; x++) {
            if (finder(x, y)) continue;
            hash = (Math.imul(hash, 1103515245) + 12345) >>> 0;
            if (hash & 0x10000) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
        }
    }
    const eye = (x, y) => (
        <g key={`${x}-${y}`}>
            <rect x={x} y={y} width="7" height="7" />
            <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />
            <rect x={x + 2} y={y + 2} width="3" height="3" />
        </g>
    );
    return (
        <svg viewBox="-2 -2 25 25" className="h-52 w-52 rounded-xl shadow-sm" role="img" aria-label="PromptPay QR (demo)">
            <rect x="-2" y="-2" width="25" height="25" fill="#fff" />
            <g fill="#0f172a">
                {eye(0, 0)}
                {eye(14, 0)}
                {eye(0, 14)}
                {cells}
            </g>
        </svg>
    );
}

function Row({ label, children }) {
    return (
        <div className="flex justify-between gap-3">
            <dt className="text-slate-500">{label}</dt>
            <dd className="text-right font-semibold text-slate-900">{children}</dd>
        </div>
    );
}

export default function Pay({ invoiceId }) {
    const { language } = useFixFlowSettings();
    const t = text[language] ?? text.th;

    const [invoice, setInvoice] = useState(null);
    const [method, setMethod] = useState('promptpay');
    const [card, setCard] = useState({ name: '', number: '', expiry: '', cvc: '' });
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        axios
            .get(`/api/maintenance/invoices/${invoiceId}`)
            .then((response) => setInvoice(response.data))
            .catch((e) => setError(e.response?.data?.message ?? t.loadError));
    }, [invoiceId]);

    const locale = language === 'en' ? 'en-US' : 'th-TH';
    const money = (value) =>
        Number(value || 0).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // ตรวจบัตรฝั่งหน้าเว็บ แล้วแปลงเป็น token เช่น tok_visa_4242
    const cardToken = () => {
        const digits = card.number.replace(/\D/g, '');
        const luhn =
            digits
                .split('')
                .reverse()
                .reduce((sum, digit, i) => {
                    let n = Number(digit);
                    if (i % 2) {
                        n *= 2;
                        if (n > 9) n -= 9;
                    }
                    return sum + n;
                }, 0) %
                10 ===
            0;
        const [month, year] = card.expiry.split('/').map(Number);
        const notExpired = /^\d{2}\/\d{2}$/.test(card.expiry) && month >= 1 && month <= 12 && new Date(2000 + year, month) > new Date();
        if (!card.name.trim() || digits.length !== 16 || !luhn || !notExpired || !/^\d{3}$/.test(card.cvc)) return null;
        const brand = digits.startsWith('35') ? 'jcb' : digits.startsWith('5') ? 'mastercard' : 'visa';
        return `tok_${brand}_${digits.slice(-4)}`;
    };

    async function pay(event) {
        event?.preventDefault();
        setError('');
        const token = method === 'card' ? cardToken() : null;
        if (method === 'card' && !token) {
            setError(t.invalidCard);
            return;
        }
        setProcessing(true);
        try {
            // หน่วงเวลาเล็กน้อยให้เหมือนการรอผู้ให้บริการชำระเงินตอบกลับ
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const { data } = await axios.post(`/api/maintenance/invoices/${invoiceId}/pay`, { method, token });
            setInvoice(data);
        } catch (e) {
            setError(e.response?.data?.message ?? t.payError);
        } finally {
            setProcessing(false);
        }
    }

    const input =
        'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10';

    if (!invoice) {
        return (
            <MaintenanceLayout title={t.title}>
                {error ? (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">{error}</div>
                ) : (
                    <div className="flex min-h-[400px] items-center justify-center text-sm text-slate-500">{t.loading}</div>
                )}
            </MaintenanceLayout>
        );
    }

    const status = invoice.payment_status;

    return (
        <MaintenanceLayout title={t.title}>
            <Head title={`${t.title} ${invoice.invoice_no}`} />

            <div className="space-y-6">
                <Link
                    href={`/maintenance/requests/${invoice.maintenance_request_id}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 no-underline transition hover:text-slate-900"
                >
                    <i className="bi bi-arrow-left"></i>
                    {t.back}
                </Link>

                <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-700">
                    <i className="bi bi-info-circle"></i>
                    {t.demo}
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        {status === 'paid' ? (
                            <div className="py-6 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl text-emerald-600">
                                    <i className="bi bi-check-lg"></i>
                                </div>
                                <h2 className="mt-4 text-2xl font-bold text-slate-900">{t.success}</h2>
                                <dl className="mx-auto mt-6 max-w-sm space-y-3 text-left text-sm">
                                    <Row label={t.paidAt}>
                                        {new Date(invoice.paid_at).toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' })}
                                    </Row>
                                    <Row label={t.method}>{t[invoice.payment_method] ?? invoice.payment_method}</Row>
                                    <Row label={t.reference}>{invoice.payment_ref}</Row>
                                </dl>
                                <Link
                                    href={`/maintenance/requests/${invoice.maintenance_request_id}`}
                                    className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white no-underline transition hover:bg-blue-700"
                                >
                                    {t.back}
                                </Link>
                            </div>
                        ) : status === 'cancelled' ? (
                            <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-8 text-center font-semibold text-rose-700">
                                {t.cancelled}
                            </div>
                        ) : processing ? (
                            <div className="flex min-h-[320px] flex-col items-center justify-center gap-4" role="status">
                                <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
                                <span className="font-semibold text-slate-700">{t.processing}</span>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 gap-3">
                                    {['promptpay', 'card'].map((option) => (
                                        <button
                                            type="button"
                                            key={option}
                                            aria-pressed={method === option}
                                            onClick={() => {
                                                setMethod(option);
                                                setError('');
                                            }}
                                            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                                                method === option
                                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            <i className={`bi ${option === 'promptpay' ? 'bi-qr-code' : 'bi-credit-card'} mr-2`}></i>
                                            {t[option]}
                                        </button>
                                    ))}
                                </div>

                                {method === 'promptpay' ? (
                                    <div className="mt-6 flex flex-col items-center text-center">
                                        <DemoQr seed={invoice.invoice_no} />
                                        <div className="mt-4 text-2xl font-bold text-slate-900">฿{money(invoice.total_amount)}</div>
                                        <p className="mt-1 text-sm text-slate-500">{t.scanHint}</p>
                                        <button
                                            type="button"
                                            onClick={pay}
                                            className="mt-5 inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                                        >
                                            <i className="bi bi-phone"></i>
                                            {t.simulateScan}
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={pay} className="mt-6 space-y-4" noValidate>
                                        <div>
                                            <label className="mb-2 block text-xs font-bold text-slate-600">{t.cardName}</label>
                                            <input
                                                className={input}
                                                autoComplete="cc-name"
                                                value={card.name}
                                                onChange={(e) => setCard({ ...card, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-xs font-bold text-slate-600">{t.cardNumber}</label>
                                            <input
                                                className={input}
                                                inputMode="numeric"
                                                autoComplete="cc-number"
                                                placeholder="4242 4242 4242 4242"
                                                value={card.number}
                                                onChange={(e) =>
                                                    setCard({
                                                        ...card,
                                                        number: e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '),
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="mb-2 block text-xs font-bold text-slate-600">{t.expiry}</label>
                                                <input
                                                    className={input}
                                                    inputMode="numeric"
                                                    autoComplete="cc-exp"
                                                    placeholder="12/30"
                                                    value={card.expiry}
                                                    onChange={(e) => {
                                                        const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                                                        setCard({ ...card, expiry: digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits });
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-xs font-bold text-slate-600">{t.cvc}</label>
                                                <input
                                                    className={input}
                                                    inputMode="numeric"
                                                    autoComplete="cc-csc"
                                                    placeholder="123"
                                                    value={card.cvc}
                                                    onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                                                />
                                            </div>
                                        </div>
                                        <p className="text-xs leading-5 text-slate-500">{t.testCards}</p>
                                        <button
                                            type="submit"
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                                        >
                                            <i className="bi bi-lock"></i>
                                            {t.payNow} ฿{money(invoice.total_amount)}
                                        </button>
                                    </form>
                                )}

                                {error && (
                                    <div role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                                        {error}
                                    </div>
                                )}
                            </>
                        )}
                    </section>

                    <aside>
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="text-xs font-bold uppercase tracking-wide text-slate-400">{t.amountDue}</div>
                            <div className="mt-2 text-3xl font-bold text-slate-900">฿{money(invoice.total_amount)}</div>
                            <dl className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm">
                                <Row label={t.invoiceNo}>{invoice.invoice_no}</Row>
                                <Row label={t.requestNo}>{invoice.request?.request_no}</Row>
                                <Row label={t.labor}>฿{money(invoice.labor_cost)}</Row>
                                <Row label={t.parts}>฿{money(invoice.parts_cost)}</Row>
                            </dl>
                        </section>
                    </aside>
                </div>
            </div>
        </MaintenanceLayout>
    );
}
