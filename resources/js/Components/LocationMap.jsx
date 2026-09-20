import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// แผนที่แบบดูอย่างเดียว สำหรับแสดงจุดที่ต้องซ่อมในหน้ารายละเอียด
const pin = L.divIcon({
    className: '',
    html: '<div style="width:22px;height:22px;border-radius:50% 50% 50% 0;background:#2563eb;border:3px solid #fff;box-shadow:0 2px 6px rgba(15,23,42,.35);transform:rotate(-45deg)"></div>',
    iconSize: [22, 22],
    iconAnchor: [11, 22],
});

export default function LocationMap({ latitude, longitude, height = 'h-56' }) {
    const container = useRef(null);
    const map = useRef(null);

    useEffect(() => {
        if (map.current || !container.current || !latitude || !longitude) return;

        map.current = L.map(container.current, {
            scrollWheelZoom: false,
            dragging: false,
            zoomControl: false,
            attributionControl: true,
        }).setView([latitude, longitude], 16);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap',
        }).addTo(map.current);

        L.marker([latitude, longitude], { icon: pin }).addTo(map.current);

        setTimeout(() => map.current?.invalidateSize(), 200);

        return () => {
            map.current?.remove();
            map.current = null;
        };
    }, [latitude, longitude]);

    if (!latitude || !longitude) return null;

    return (
        <div
            ref={container}
            className={`${height} w-full overflow-hidden rounded-xl border border-slate-200`}
            style={{ zIndex: 0 }}
        />
    );
}
