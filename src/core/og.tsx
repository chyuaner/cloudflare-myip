/** @jsxImportSource react */
import React from 'react';
import { ASSETS } from './assets.gen.js';

export const OgImage = ({ ip, longitude, latitude }: { ip: string, longitude?: string, latitude?: string }) => {
    const isIpv6 = ip.includes(':');
    // const isIpv6 = true;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundImage: `url(data:image/png;base64,${ASSETS.ogbg_png})`,
            backgroundSize: '100% 100%',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'sans-serif',
            color: '#333'
        }}>
            <div style={{ display: 'flex', fontSize: 60, marginBottom: 60, color: '#000' }}>查看你的公網IP</div>
            <div style={{ display: 'flex', textAlign: 'left', alignSelf: 'flex-start', marginLeft: 80, fontSize: 42, marginBottom: 20, color: '#000' }}>你目前的IP：</div>
            <div style={{
                display: 'flex',
                fontSize: isIpv6 ? 50 : 100,
                fontWeight: 'bold',
                color: isIpv6 ? '#10b981' : '#3b82f6',
                wordBreak: 'break-word', // Use break-word for long IPv6
                textAlign: 'center',
                padding: '0 40px',
                lineHeight: 1.2
            }}>
                {/* 2001:b400:e2c2:64ab:3b66:a17b:57f6:44a9 */}
                {/* 255.255.255.255 */}
                {ip}
            </div>

            {(longitude || latitude) && (
                 <div style={{
                    display: 'flex',
                    marginTop: 80,
                    fontSize: 48,
                    color: '#444',
                    padding: '10px 20px',
                    alignItems: 'center'
                 }}>
                    <div style={{ display: 'flex', marginRight: 15 }}>📌</div>
                    <div style={{ display: 'flex', gap: 20 }}>
                        <div style={{ display: 'flex' }}>經度: {longitude}</div>
                        <div style={{ display: 'flex' }}>緯度: {latitude}</div>
                    </div>
                 </div>
            )}
        </div>
    );
};
