import { validateProtocol, validateMedications, validateRescueAgents } from '@/schemas/protocol';

describe('Protocol Validation', () => {
  describe('validateProtocol', () => {
    it('should validate a valid protocol', () => {
      const validProtocol = {
        id: '1',
        code: 'TEST-01',
        tumour_group: 'BREAST',
        treatment: {
          drugs: [{
            name: 'Drug A',
            dose: '100mg'
          }]
        },
        precautions: [{
          note: 'Test precaution'
        }]
      };

      const result = validateProtocol(validProtocol);
      expect(result.success).toBe(true);
    });

    it('should reject invalid protocol missing required fields', () => {
      const invalidProtocol = {
        id: '1',
        code: 'TEST-01'
        // Missing tumour_group and treatment
      };

      const result = validateProtocol(invalidProtocol);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: expect.arrayContaining(['tumour_group'])
            }),
            expect.objectContaining({
              path: expect.arrayContaining(['treatment'])
            })
          ])
        );
      }
    });

    it('should handle nested validation of drug arrays', () => {
      const protocolWithInvalidDrug = {
        id: '1',
        code: 'TEST-01',
        tumour_group: 'BREAST',
        treatment: {
          drugs: [{
            // Missing required 'name' field
            dose: '100mg'
          }]
        },
        precautions: [{
          note: 'Test precaution'
        }]
      };

      const result = validateProtocol(protocolWithInvalidDrug);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: expect.arrayContaining(['treatment', 'drugs', 0, 'name'])
            })
          ])
        );
      }
    });
  });

  describe('validateMedications', () => {
    it('should validate valid medications', () => {
      const validMedications = {
        required: [{
          name: 'Med A',
          dose: '10mg'
        }],
        optional: [{
          name: 'Med B',
          dose: '20mg'
        }]
      };

      const result = validateMedications(validMedications);
      expect(result.success).toBe(true);
    });

    it('should reject invalid medications', () => {
      const invalidMedications = {
        required: [{
          // Missing name
          dose: '10mg'
        }],
        optional: []
      };

      const result = validateMedications(invalidMedications);
      expect(result.success).toBe(false);
    });
  });

  describe('validateRescueAgents', () => {
    it('should validate valid rescue agents', () => {
      const validRescueAgents = [{
        name: 'Agent A',
        indication: 'For condition X',
        dosing: '10mg daily'
      }];

      const result = validateRescueAgents(validRescueAgents);
      expect(result.success).toBe(true);
    });

    it('should reject invalid rescue agents', () => {
      const invalidRescueAgents = [{
        name: 'Agent A',
        // Missing indication and dosing
      }];

      const result = validateRescueAgents(invalidRescueAgents);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: expect.arrayContaining([0, 'indication'])
            }),
            expect.objectContaining({
              path: expect.arrayContaining([0, 'dosing'])
            })
          ])
        );
      }
    });
  });
});
