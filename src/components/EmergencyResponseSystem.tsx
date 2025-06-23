import React, { useState } from 'react';
import type { VitalSigns, TriageResult } from '../services/emergency/types';
import { useEmergencyService } from '../hooks/useEmergencyService';

export function EmergencyResponseSystem() {
  const [vitals, setVitals] = useState<VitalSigns>({});
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [symptomInput, setSymptomInput] = useState('');
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVitalChange = (field: keyof VitalSigns, value: number | string) => {
    if (field === 'bloodPressure') {
      // Handle blood pressure specially since it's an object
      const [systolic, diastolic] = (value as string).split('/').map(Number);
      setVitals(prev => ({
        ...prev,
        bloodPressure: { systolic, diastolic }
      }));
    } else {
      setVitals(prev => ({
        ...prev,
        [field]: Number(value)
      }));
    }
  };

  const addSymptom = () => {
    if (symptomInput.trim()) {
      setSymptoms(prev => [...prev, symptomInput.trim()]);
      setSymptomInput('');
    }
  };

  const removeSymptom = (index: number) => {
    setSymptoms(prev => prev.filter((_, i) => i !== index));
  };

  const emergencyService = useEmergencyService();

  const handleTriage = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await emergencyService.triageEmergency(vitals, symptoms);
      setTriageResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <h1 className="text-2xl font-bold text-red-700 mb-2">Emergency Response System</h1>
        <p className="text-red-600">
          ⚠️ This system is designed to assist medical professionals in emergencies.
          It is not a replacement for professional medical judgment.
        </p>
      </div>

      {/* Vital Signs Input */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Vital Signs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Heart Rate (bpm)</label>
            <input
              type="number"
              className="w-full border rounded p-2"
              value={vitals.heartRate || ''}
              onChange={e => handleVitalChange('heartRate', e.target.value)}
              placeholder="60-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Blood Pressure (systolic/diastolic)</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              placeholder="120/80"
              onChange={e => handleVitalChange('bloodPressure', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Temperature (°C)</label>
            <input
              type="number"
              step="0.1"
              className="w-full border rounded p-2"
              value={vitals.temperature || ''}
              onChange={e => handleVitalChange('temperature', e.target.value)}
              placeholder="37.0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Oxygen Saturation (%)</label>
            <input
              type="number"
              className="w-full border rounded p-2"
              value={vitals.oxygenSaturation || ''}
              onChange={e => handleVitalChange('oxygenSaturation', e.target.value)}
              placeholder="95-100"
            />
          </div>
        </div>
      </div>

      {/* Symptoms Input */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Symptoms</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="flex-1 border rounded p-2"
            value={symptomInput}
            onChange={e => setSymptomInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && addSymptom()}
            placeholder="Enter symptom"
          />
          <button
            onClick={addSymptom}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {symptoms.map((symptom, index) => (
            <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
              <span>{symptom}</span>
              <button
                onClick={() => removeSymptom(index)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Triage Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleTriage}
          disabled={loading}
          className="bg-red-600 text-white px-8 py-3 rounded-lg text-lg font-semibold
                     hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Begin Emergency Triage'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Triage Results */}
      {triageResult && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">
            Emergency Level: {' '}
            <span className={
              triageResult.level === 'IMMEDIATE' ? 'text-red-600' :
              triageResult.level === 'URGENT' ? 'text-orange-500' :
              'text-yellow-500'
            }>
              {triageResult.level}
            </span>
          </h2>

          {/* Required Actions */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Required Actions:</h3>
            <ul className="list-disc pl-5 space-y-2">
              {triageResult.requiredActions.map((action, index) => (
                <li key={index} className="text-red-700">{action}</li>
              ))}
            </ul>
          </div>

          {/* Warnings */}
          {triageResult.warnings.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Critical Warnings:</h3>
              <ul className="list-disc pl-5 space-y-2">
                {triageResult.warnings
                  .filter(w => w.severity === 'CRITICAL')
                  .map((warning, index) => (
                    <li key={index} className="text-red-600">
                      {warning.vitalSign}: {warning.value} - {warning.recommendation}
                    </li>
                  ))
                }
              </ul>
            </div>
          )}

          {/* Protocols */}
          {triageResult.recommendedProtocols.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Recommended Protocols:</h3>
              <div className="space-y-4">
                {triageResult.recommendedProtocols.map((protocol, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded">
                    <h4 className="font-medium">{protocol.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{protocol.description}</p>
                    <div className="space-y-1">
                      {protocol.immediateActions.map((action, i) => (
                        <div key={i} className="flex items-center text-sm">
                          <span className="mr-2">•</span>
                          {action}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimers */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <h3 className="font-semibold mb-2">Important Disclaimers:</h3>
            {triageResult.disclaimers.map((disclaimer, index) => (
              <div key={index} className="text-sm text-gray-800 mb-2">
                {disclaimer.content.en}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
