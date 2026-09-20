import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// แผนที่จาก OpenStreetMap (ไม่ต้องใช้ API key) ค้นหาที่อยู่ด้วย Nominatim
const THAILAND = [13.7563, 100.5018];

// ใช้หมุดแบบวาดเอง จะได้ไม่ต้องพึ่งไฟล์รูปของ Leaflet
const pin = L.divIcon({
    className: '',
    html: '<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;background:#2563eb;border:3px solid #fff;box-shadow:0 2px 6px rgba(15,23,42,.35);transform:rotate(-45deg)"></div>',
    iconSize: [26, 26],
    iconAnchor: [13, 26],
});

const text = {
    th: {
        search: 'ค้นหาสถานที่ เช่น ชื่ออาคารหรือมหาวิทยาลัย',
        searching: 'กำลังค้นหา...',
        noResults: 'ไม่พบสถานที่นี้ ลองพิมพ์ใหม่หรือปักหมุดเองบนแผนที่',
        useMyLocation: 'ใช้ตำแหน่งปัจจุบัน',
        locating: 'กำลังหาตำแหน่ง...',
        locationDenied: 'ไม่สามารถเข้าถึงตำแหน่งได้ กรุณาปักหมุดเอง',
        hint: 'คลิกบนแผนที่หรือลากหมุดเพื่อระบุจุดที่ต้องซ่อม',
        picked: 'พิกัดที่เลือก',
        clear: 'ล้างหมุด',
    },
    en: {
        search: 'Search for a place or building name',
        searching: 'Searching...',
        noResults: 'No place found. Try again or drop the pin yourself.',
        useMyLocation: 'Use my location',
        locating: 'Finding you...',
        locationDenied: 'Location unavailable. Please drop the pin yourself.',
        hint: 'Click the map or drag the pin to mark where the repair is needed',
        picked: 'Selected point',
        clear: 'Clear pin',
    },
};

export default function LocationPicker({ language = 'th', latitude, longitude, onPick }) {
    const t = text[language] ?? text.th;
    const container = useRef(null);
    const map = useRef(null);
    const marker = useRef(null);
    const [query, setQuery] = useState('');
    const [busy, setBusy] = useState('');
    const [message, setMessage] = useState('');

    // แจ้งพิกัดกลับไปหน้าแม่ พร้อมชื่อสถานที่ถ้าหาเจอ
    const publish = async (lat, lng, address) => {
        onPick({ latitude: Number(lat.toFixed(7)), longitude: Number(lng.toFixed(7)), address });
    };

    const place = (lat, lng, address) => {
        if (!map.current) return;

        if (marker.current) {
            marker.current.setLatLng([lat, lng]);
        } else {
            marker.current = L.marker([lat, lng], { icon: pin, draggable: true }).addTo(map.current);
            marker.current.on('dragend', async () => {
                const point = marker.current.getLatLng();
                publish(point.lat, point.lng, await lookupAddress(point.lat, point.lng));
            });
        }

        map.current.setView([lat, lng], Math.max(map.current.getZoom(), 16));
        publish(lat, lng, address);
    };

    // แปลงพิกัดเป็นชื่อสถานที่ (ถ้าบริการไม่ตอบก็ไม่เป็นไร ผู้ใช้พิมพ์เองได้)
    const lookupAddress = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=${language}`,
            );
            const data = await response.json();

            return data.display_name ?? '';
        } catch {
            return '';
        }
    };

    useEffect(() => {
        if (map.current || !container.current) return;

        map.current = L.map(container.current, { scrollWheelZoom: false }).setView(
            latitude && longitude ? [latitude, longitude] : THAILAND,
            latitude && longitude ? 16 : 6,
        );

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap',
        }).addTo(map.current);

        map.current.on('click', async (event) => {
            const { lat, lng } = event.latlng;
            place(lat, lng, await lookupAddress(lat, lng));
        });

        if (latitude && longitude) {
            marker.current = L.marker([latitude, longitude], { icon: pin, draggable: true }).addTo(map.current);
            marker.current.on('dragend', async () => {
                const point = marker.current.getLatLng();
                publish(point.lat, point.lng, await lookupAddress(point.lat, point.lng));
            });
        }

        // แผนที่ต้องวัดขนาดใหม่หลังวางลงใน layout
        setTimeout(() => map.current?.invalidateSize(), 200);

        return () => {
            map.current?.remove();
            map.current = null;
            marker.current = null;
        };
    }, []);

    // หน้านี้อยู่ในฟอร์มแจ้งซ่อมอยู่แล้ว จึงไม่ใช้ <form> ซ้อน และกัน Enter ไม่ให้ส่งฟอร์มหลัก
    const search = async (event) => {
        event?.preventDefault?.();

        if (!query.trim()) return;

        setBusy('search');
        setMessage('');

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=${language}&q=${encodeURIComponent(query)}`,
            );
            const [found] = await response.json();

            if (!found) {
                setMessage(t.noResults);
                return;
            }

            place(Number(found.lat), Number(found.lon), found.display_name ?? query);
        } catch {
            setMessage(t.noResults);
        } finally {
            setBusy('');
        }
    };

    const locateMe = () => {
        if (!navigator.geolocation) {
            setMessage(t.locationDenied);
            return;
        }

        setBusy('locate');
        setMessage('');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude: lat, longitude: lng } = position.coords;
                place(lat, lng, await lookupAddress(lat, lng));
                setBusy('');
            },
            () => {
                setMessage(t.locationDenied);
                setBusy('');
            },
            { enableHighAccuracy: true, timeout: 10000 },
        );
    };

    const clear = () => {
        marker.current?.remove();
        marker.current = null;
        onPick({ latitude: null, longitude: null, address: null });
    };

    const field =
        'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10';

    return (
        <div>
            <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex flex-1 gap-2">
                    <input
                        type="search"
                        className={field}
                        placeholder={t.search}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                search(e);
                            }
                        }}
                    />

                    <button
                        type="button"
                        onClick={search}
                        disabled={busy === 'search'}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                    >
                        <i className="bi bi-search"></i>
                        {busy === 'search' ? t.searching : ''}
                    </button>
                </div>

                <button
                    type="button"
                    onClick={locateMe}
                    disabled={busy === 'locate'}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                >
                    <i className="bi bi-crosshair"></i>
                    {busy === 'locate' ? t.locating : t.useMyLocation}
                </button>
            </div>

            <div
                ref={container}
                className="mt-3 h-72 w-full overflow-hidden rounded-xl border border-slate-200"
                style={{ zIndex: 0 }}
            />

            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span>
                    {latitude && longitude ? (
                        <>
                            <i className="bi bi-geo-alt-fill mr-1 text-blue-600"></i>
                            {t.picked}: {Number(latitude).toFixed(5)}, {Number(longitude).toFixed(5)}
                        </>
                    ) : (
                        t.hint
                    )}
                </span>

                {latitude && longitude && (
                    <button type="button" onClick={clear} className="font-semibold text-rose-600 hover:text-rose-700">
                        {t.clear}
                    </button>
                )}
            </div>

            {message && (
                <p role="alert" className="mt-2 text-xs font-semibold text-amber-700">
                    {message}
                </p>
            )}
        </div>
    );
}
