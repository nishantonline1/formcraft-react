import React, { useState } from 'react';
import { FormRenderer } from '@dynamic_forms/react';
import { useCustomRenderersForm } from './hooks';
import './CustomRenderersStyles.css';

// Using `any` as a temporary workaround for complex type issues.
const CharacterCountInput: React.FC<any> = ({ field, form }) => {
  const charCount = (form.values[field.path] || '').length;
  const limit = field.maxLength || 100;
  return (
    <div>
      <input
        className="form-input"
        value={form.values[field.path] || ''}
        onChange={(e) => form.handleChange(field.path, e.target.value)}
        maxLength={limit}
      />
      <span className={`char-counter ${charCount > limit ? 'over-limit' : ''}`}>{charCount}/{limit}</span>
    </div>
  );
};

const StarRating: React.FC<any> = ({ field, form }) => {
  const [hover, setHover] = useState(0);
  const value = Number(form.values[field.path] || 0);
  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <span
            key={ratingValue}
            className={`star ${ratingValue <= (hover || value) ? 'filled' : ''}`}
            onClick={() => form.handleChange(field.path, ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

const TagInput: React.FC<any> = ({ field, form }) => {
  const tags = (form.values[field.path] as string[] | undefined) || [];
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (newTag && !tags.includes(newTag)) {
        form.handleChange(field.path, [...tags, newTag]);
      }
      e.currentTarget.value = '';
    }
  };
  const removeTag = (tagToRemove: string) => {
    form.handleChange(field.path, tags.filter((tag) => tag !== tagToRemove));
  };
  return (
    <div className="tag-input">
      <div className="tags-container">
        {tags.map((tag) => (
          <div key={tag} className="tag">
            {tag}
            <button type="button" onClick={() => removeTag(tag)}>x</button>
          </div>
        ))}
      </div>
      <input type="text" onKeyDown={handleKeyDown} placeholder="Add a tag..." />
    </div>
  );
};

const ColorPicker: React.FC<any> = ({ field, form }) => (
  <div className="color-picker">
    <input
      type="color"
      value={(form.values[field.path] as string) || '#ffffff'}
      onChange={(e) => form.handleChange(field.path, e.target.value)}
    />
    <span>{form.values[field.path]}</span>
  </div>
);

// Main Component
export const CustomRenderersFormComponent: React.FC = () => {
  const { form, handleSubmit, customStats } = useCustomRenderersForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const customRenderers = {
    'character-count': CharacterCountInput,
    'star-rating': StarRating,
    'tag-input': TagInput,
    'color-picker': ColorPicker,
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await form.handleSubmit(handleSubmit)();
    setIsSubmitting(false);
  };

  return (
    <div className="example-container custom-renderers-example">
      <div className="example-header">
        <h2>Custom Field Renderers</h2>
        <p className="description">
          Extending the form with completely custom input components for a unique UX.
        </p>
      </div>
      <div className="example-content">
        <div className="form-area">
          <form onSubmit={onSubmit}>
            <FormRenderer form={form} config={form.config} customRenderers={customRenderers as any} />
            <div className="form-actions">
              <button type="submit" className="submit-button" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Custom Form'}
              </button>
            </div>
          </form>
        </div>
        <div className="info-area">
          <CustomStatsPanel stats={customStats} />
        </div>
      </div>
    </div>
  );
};

// Info Panel
const CustomStatsPanel: React.FC<{ stats: ReturnType<typeof useCustomRenderersForm>['customStats'] }> = ({ stats }) => {
  const { username, rating, tags, favoriteColor } = stats;
  return (
    <div className="custom-stats-panel">
      <h3>Live Field-State Analysis</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Username</h4>
          <p>{username.statusText}</p>
          <div className={`char-indicator ${username.isWarning ? 'warning' : ''}`}>{username.count}/{username.limit}</div>
        </div>
        <div className="stat-card">
          <h4>Rating</h4>
          <p>{rating.text}</p>
          <div className="stars-display">{rating.stars}</div>
        </div>
        <div className="stat-card">
          <h4>Tags</h4>
          <p>{tags.statusText}</p>
          <div className="tags-display">{(tags.value as string[]).join(', ') || 'No tags yet'}</div>
        </div>
        <div className="stat-card" style={{ backgroundColor: favoriteColor.value as string, color: favoriteColor.contrastColor }}>
          <h4>Favorite Color</h4>
          <p>This panel's background is your chosen color.</p>
          <strong>{favoriteColor.value as string}</strong>
        </div>
      </div>
    </div>
  );
}; 