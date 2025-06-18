import React, { ReactNode } from 'react';

export function FormWrapper({
  title,
  loading = false,
  children,
}: {
  title: string;
  loading?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="form-wrapper">
      <header>
        <h2>{title}</h2>
        {loading && <span className="spinner">Loading…</span>}
      </header>
      <div className="form-content">{children}</div>
    </div>
  );
}
