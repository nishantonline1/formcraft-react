import React from 'react';
import { useSectionedFormDemo, useHeaderlessFormDemo, useFlatFormDemo } from './hooks';
import { 
  FullFeaturedForm, 
  HeaderlessForm, 
  FlatForm, 
  SectionControls, 
  DebugSection 
} from './components';
import './SectionedFormStyles.css';

/**
 * Sectioned Form Example
 * 
 * Demonstrates different approaches to rendering form sections:
 * 1. Full featured sections with headers, progress, and collapsible behavior
 * 2. Headerless sections (grouped fields only)
 * 3. Flat layout (no section containers)
 */
export default function SectionedFormExample() {
  const fullFeatured = useSectionedFormDemo();
  const headerless = useHeaderlessFormDemo();
  const flat = useFlatFormDemo();

  return (
    <div className="sectioned-form-example">
      <h1>Sectioned Form Examples</h1>
      
      <div className="examples-container">
        {/* Example 1: Full Featured Sectioned Form */}
        <div className="example-section">
          <h2>1. Full Featured Sectioned Form</h2>
          <p>Sections with headers, progress tracking, and collapsible behavior</p>
          
          <FullFeaturedForm
            sectionsHook={fullFeatured.sections}
            form={fullFeatured.form}
          />
        </div>

        {/* Example 2: Headerless Sections */}
        <div className="example-section">
          <h2>2. Headerless Sections (Fields Only)</h2>
          <p>Sections without headers, just grouped fields</p>
          
          <HeaderlessForm
            sectionsHook={headerless.sections}
            form={headerless.form}
          />
        </div>

        {/* Example 3: Flat Layout */}
        <div className="example-section">
          <h2>3. Flat Layout (No Section Grouping)</h2>
          <p>All fields rendered in sequence without section containers</p>
          
          <FlatForm
            sectionsHook={flat.sections}
            form={flat.form}
          />
        </div>
      </div>

      {/* Section Controls */}
      <SectionControls
        sectionsHook={fullFeatured.sections}
        allProgress={fullFeatured.allProgress}
      />

      {/* Form Values Debug */}
      <DebugSection values={fullFeatured.form.values} />
    </div>
  );
} 