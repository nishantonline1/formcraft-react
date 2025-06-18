import React, { useMemo } from 'react';
import { useEnhancedForm } from '../../enhanced-hooks';

// Dummy model and initial values for demonstration
const formModel: any[] = [
  { key: 'query', type: 'text', label: 'Search Query' },
  { key: 'filter', type: 'select', label: 'Filter', options: async () => [{value: 'A', label: 'A'}, {value: 'B', label: 'B'}] },
];
const initialValues = { query: '', filter: 'A' };

// A custom hook for managing search state
const useSearchState = (form: ReturnType<typeof useEnhancedForm>) => {
  const { values } = form;
  return useMemo(() => ({
    searchQuery: values.query,
    activeFilter: values.filter,
    isSearching: (values.query as string)?.length > 0,
  }), [values]);
};

// A custom hook for managing search results (simulated)
const useSearchResults = (searchState: ReturnType<typeof useSearchState>) => {
  return useMemo(() => {
    if (!searchState.isSearching) return { results: [], status: 'idle' };
    // Simulate an API call
    return { 
      results: [`Result for "${searchState.searchQuery}" with filter "${searchState.activeFilter}"`],
      status: 'loaded',
    };
  }, [searchState]);
};

export const FormHooksComponent: React.FC = () => {
  const form = useEnhancedForm(formModel, { initialValues });
  const searchState = useSearchState(form);
  const searchResults = useSearchResults(searchState);

  return (
    <div className="example-container">
      <div className="example-header">
        <h2>Composable Form Hooks Pattern</h2>
        <p className="description">
          This example shows how to build complex form logic by composing multiple, small, single-responsibility hooks.
        </p>
      </div>
      <div>
        <input 
          type="text"
          className="form-input"
          placeholder="Search..."
          value={form.values.query as string}
          onChange={(e) => form.handleChange('query', e.target.value)}
        />
         <select
            className="form-input"
            value={form.values.filter as string}
            onChange={(e) => form.handleChange('filter', e.target.value)}
          >
            <option value="A">Filter A</option>
            <option value="B">Filter B</option>
          </select>

        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8f9fa' }}>
          <h4>Search State:</h4>
          <pre>{JSON.stringify(searchState, null, 2)}</pre>
        </div>
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8f9fa' }}>
          <h4>Search Results:</h4>
          <pre>{JSON.stringify(searchResults, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}; 