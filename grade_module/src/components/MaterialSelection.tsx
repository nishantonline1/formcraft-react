import React, { useState } from 'react';
import type { Material } from '../pages/create/types';

interface MaterialSelectionProps {
  materials: Material[];
  onChange: (materials: Material[]) => void;
}

const materialIcons: Record<Material['type'], string> = {
  'Furnace': '🔥',
  'Additives': '⚗️',
  'Nodularizer': '🔮'
};

export const MaterialSelection: React.FC<MaterialSelectionProps> = ({
  materials,
  onChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newMaterial, setNewMaterial] = useState({ name: '', type: 'Furnace' as Material['type'] });

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateMaterial = (index: number, field: keyof Material, value: any) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index] = { ...updatedMaterials[index], [field]: value };
    onChange(updatedMaterials);
  };

  const addCustomMaterial = () => {
    if (newMaterial.name && !materials.find(m => m.name === newMaterial.name)) {
      const material: Material = {
        ...newMaterial,
        minPercent: 0,
        maxPercent: 100,
        selected: false
      };
      onChange([...materials, material]);
      setNewMaterial({ name: '', type: 'Furnace' });
    }
  };

  const groupedMaterials = filteredMaterials.reduce((groups, material) => {
    const type = material.type;
    if (!groups[type]) groups[type] = [];
    groups[type].push(material);
    return groups;
  }, {} as Record<string, Material[]>);

  return (
    <div className="material-selection">
      <div className="material-header">
        <h4>⚡ Addition/Dilution Settings</h4>
        <p>Configure suggestion generation parameters and raw material constraints.</p>
      </div>

      <div className="search-section">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="material-search"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      <div className="materials-grid">
        {Object.entries(groupedMaterials).map(([type, typeMaterials]) => (
          <div key={type} className="material-type-group">
            <h5 className="type-header">
              <span className="type-icon">{materialIcons[type as Material['type']]}</span>
              {type}
            </h5>
            
            {typeMaterials.map((material) => {
              const globalIndex = materials.indexOf(material);
              return (
                <div key={material.name} className={`material-item ${material.selected ? 'selected' : ''}`}>
                  <div className="material-info">
                    <label className="material-checkbox-wrapper">
                      <input
                        type="checkbox"
                        checked={material.selected}
                        onChange={(e) => updateMaterial(globalIndex, 'selected', e.target.checked)}
                        className="material-checkbox"
                      />
                      <span className="material-name">{material.name}</span>
                      <span className="material-type-badge">{material.type}</span>
                    </label>
                  </div>

                  {material.selected && (
                    <div className="material-constraints">
                      <div className="constraint-inputs">
                        <div className="input-group">
                          <label>Min %:</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={material.minPercent}
                            onChange={(e) => updateMaterial(globalIndex, 'minPercent', parseInt(e.target.value) || 0)}
                            className="constraint-input"
                          />
                        </div>
                        
                        <div className="input-group">
                          <label>Max %:</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={material.maxPercent}
                            onChange={(e) => updateMaterial(globalIndex, 'maxPercent', parseInt(e.target.value) || 0)}
                            className="constraint-input"
                          />
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => {
                            const updated = materials.filter((_, i) => i !== globalIndex);
                            onChange(updated);
                          }}
                          className="remove-material-button"
                          title="Remove material"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="add-material-section">
        <h5>Add Custom Material</h5>
        <div className="add-material-form">
          <select
            value={newMaterial.type}
            onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value as Material['type'] })}
            className="material-type-select"
          >
            <option value="Furnace">Furnace</option>
            <option value="Additives">Additives</option>
            <option value="Nodularizer">Nodularizer</option>
          </select>
          
          <input
            type="text"
            placeholder="Material name..."
            value={newMaterial.name}
            onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
            className="material-name-input"
          />
          
          <button
            type="button"
            onClick={addCustomMaterial}
            disabled={!newMaterial.name || !!materials.find(m => m.name === newMaterial.name)}
            className="add-material-button"
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
};
