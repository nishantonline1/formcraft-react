import React, { useState } from 'react';
import type { ChemicalElement } from '../pages/create/types';

interface ChemistryTableProps {
  elements: ChemicalElement[];
  onChange: (elements: ChemicalElement[]) => void;
  showBathColumns?: boolean;
}

const availableElements = ['C', 'Si', 'Mn', 'P', 'S', 'Cr', 'Ni', 'Mo', 'Cu', 'Al', 'Ti', 'V', 'Nb'];

export const ChemistryTable: React.FC<ChemistryTableProps> = ({
  elements,
  onChange,
  showBathColumns = true
}) => {
  const [newElement, setNewElement] = useState('Mn');

  const updateElement = (index: number, field: keyof ChemicalElement, value: number | string) => {
    const updatedElements = [...elements];
    updatedElements[index] = { ...updatedElements[index], [field]: value };
    onChange(updatedElements);
  };

  const addElement = () => {
    if (!elements.find(el => el.symbol === newElement)) {
      const newEl: ChemicalElement = {
        symbol: newElement,
        bathMin: 0,
        bathMax: 0,
        finalMin: 0,
        finalMax: 0
      };
      onChange([...elements, newEl]);
    }
  };

  const removeElement = (index: number) => {
    const updatedElements = elements.filter((_, i) => i !== index);
    onChange(updatedElements);
  };

  return (
    <div className="chemistry-table-wrapper">
      <div className="chemistry-table">
        <div className="table-header">
          <div className="header-cell">Element</div>
          {showBathColumns && (
            <>
              <div className="header-cell">Bath Min</div>
              <div className="header-cell">Bath Max</div>
            </>
          )}
          <div className="header-cell">Final Min</div>
          <div className="header-cell">Final Max</div>
          <div className="header-cell">Actions</div>
        </div>

        {elements.map((element, index) => (
          <div key={element.symbol} className="table-row">
            <div className="cell element-cell">
              <strong>{element.symbol}</strong>
            </div>
            
            {showBathColumns && (
              <>
                <div className="cell">
                  <input
                    type="number"
                    step="0.01"
                    value={element.bathMin}
                    onChange={(e) => updateElement(index, 'bathMin', parseFloat(e.target.value) || 0)}
                    className="table-input"
                  />
                </div>
                <div className="cell">
                  <input
                    type="number"
                    step="0.01"
                    value={element.bathMax}
                    onChange={(e) => updateElement(index, 'bathMax', parseFloat(e.target.value) || 0)}
                    className="table-input"
                  />
                </div>
              </>
            )}
            
            <div className="cell">
              <input
                type="number"
                step="0.01"
                value={element.finalMin}
                onChange={(e) => updateElement(index, 'finalMin', parseFloat(e.target.value) || 0)}
                className="table-input"
              />
            </div>
            <div className="cell">
              <input
                type="number"
                step="0.01"
                value={element.finalMax}
                onChange={(e) => updateElement(index, 'finalMax', parseFloat(e.target.value) || 0)}
                className="table-input"
              />
            </div>
            <div className="cell actions-cell">
              <button
                type="button"
                onClick={() => removeElement(index)}
                className="remove-button"
                title="Remove element"
              >
                ×
              </button>
            </div>
          </div>
        ))}

        <div className="table-row add-row">
          <div className="cell">
            <select
              value={newElement}
              onChange={(e) => setNewElement(e.target.value)}
              className="element-select"
            >
              {availableElements
                .filter(el => !elements.find(existing => existing.symbol === el))
                .map(el => (
                  <option key={el} value={el}>{el}</option>
                ))}
            </select>
          </div>
          <div className="cell-span">
            <button
              type="button"
              onClick={addElement}
              className="add-button"
              disabled={!newElement || !!elements.find(el => el.symbol === newElement)}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
