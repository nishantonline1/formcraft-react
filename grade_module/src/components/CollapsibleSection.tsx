import React, { useState, ReactNode } from 'react';

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  iconLeft?: string;
  iconRight?: string;
  variant?: 'default' | 'power-user';
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  subtitle,
  children,
  defaultExpanded = false,
  iconLeft,
  iconRight,
  variant = 'default'
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`collapsible-section ${variant}`}>
      <button
        type="button"
        className="section-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="header-content">
          <div className="header-left">
            <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
            {iconLeft && <span className="section-icon">{iconLeft}</span>}
            <span className="section-title">{title}</span>
          </div>
          
          <div className="header-right">
            {subtitle && <span className="section-subtitle">{subtitle}</span>}
            {iconRight && <span className="section-icon-right">{iconRight}</span>}
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="section-content">
          {children}
        </div>
      )}
    </div>
  );
};
