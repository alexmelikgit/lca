'use client';

import { useRef, useState } from 'react';

interface Props {
  label: string;
  value: string;
  onChange: (url: string) => void;
  aspectHint?: string;
}

export default function ImageUpload({ label, value, onChange, aspectHint }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(file: File) {
    setError('');
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Upload failed');
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6B58' }}>
        {label}
      </label>

      {/* Preview */}
      {value && (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #D8D4C8', display: 'block' }}
          />
          <button
            onClick={() => onChange('')}
            title="Remove image"
            style={{
              position: 'absolute', top: '8px', right: '8px',
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'rgba(220,38,38,0.9)', border: 'none', color: 'white',
              fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        style={{
          border: '1.5px dashed #D8D4C8',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center',
          cursor: uploading ? 'wait' : 'pointer',
          background: '#FAFAF7',
          transition: 'border-color 0.15s ease',
          opacity: uploading ? 0.6 : 1,
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = '#C49A3C'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = '#D8D4C8'; }}
      >
        <div style={{ fontSize: '1.4rem', marginBottom: '6px', opacity: 0.4 }}>↑</div>
        <div style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.82rem', color: '#6B6B58' }}>
          {uploading ? 'Uploading…' : value ? 'Replace image' : 'Click or drag to upload'}
        </div>
        {aspectHint && (
          <div style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.72rem', color: '#9B9B82', marginTop: '4px' }}>
            {aspectHint}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        style={{ display: 'none' }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
      />

      {error && <span style={{ fontSize: '0.75rem', color: '#DC2626' }}>{error}</span>}
    </div>
  );
}
