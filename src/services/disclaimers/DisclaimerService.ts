import { 
  DisclaimerConfig,
  DisclaimerContent,
  DisclaimerAcknowledgment,
  ComplianceRecord,
  Language,
  RiskLevel,
  MedicalSpecialty,
  Jurisdiction
} from "./types";
import { MedicalAuditLogger, LogCategory } from "../utils/MedicalAuditLogger";

export class DisclaimerService {
  private readonly auditLogger: MedicalAuditLogger;
  private disclaimerTemplates: Map<string, DisclaimerContent>;
  private complianceRecords: Map<string, ComplianceRecord>;
  private userAcknowledgments: Map<string, DisclaimerAcknowledgment[]>;
  private readonly versionHistory: Map<string, string[]>;

  constructor(auditLogger: MedicalAuditLogger) {
    this.auditLogger = auditLogger;
    this.disclaimerTemplates = new Map();
    this.complianceRecords = new Map();
    this.userAcknowledgments = new Map();
    this.versionHistory = new Map();
  }

  async generateDisclaimer(
    config: DisclaimerConfig,
    language: Language,
    context: {
      queryType?: string;
      specialty?: MedicalSpecialty;
      isEmergency?: boolean;
      riskLevel?: RiskLevel;
    }
  ): Promise<string> {
    try {
      const template = this.disclaimerTemplates.get(config.id);
      if (!template) {
        throw new Error(`Disclaimer template not found: ${config.id}`);
      }

      // Check compliance before generating
      const isCompliant = await this.validateCompliance(config.id, config.jurisdiction);
      if (!isCompliant) {
        throw new Error(`Disclaimer ${config.id} is not compliant with current regulations`);
      }

      let disclaimer = template.content[language] || template.content.en;

      // Add scope limitations
      disclaimer = this.addScopeLimitations(disclaimer, language);

      // Add context-specific warnings
      if (context.riskLevel === "High" || context.riskLevel === "Critical") {
        disclaimer = this.addHighRiskWarning(disclaimer, language);
      }

      if (context.isEmergency) {
        disclaimer = this.addEmergencyWarning(disclaimer, language);
      }

      if (context.specialty) {
        disclaimer = this.addSpecialtyDisclaimer(disclaimer, context.specialty, language);
      }

      // Add professional consultation recommendation
      disclaimer = this.addConsultationRecommendation(disclaimer, language);

      // Log generation event
      await this.auditLogger.logAiInteraction(
        "DISCLAIMER_SYSTEM",
        "Generate Disclaimer",
        { prompt: 0, completion: 0, total: 0 },
        0,
        {
          disclaimerId: config.id,
          version: config.version,
          language,
          context
        }
      );

      return disclaimer;
    } catch (error) {
      await this.auditLogger.logError(
        'Failed to generate disclaimer',
        error
      );
      throw error;
    }
  }

  async registerTemplate(
    id: string,
    content: DisclaimerContent,
    config: DisclaimerConfig
  ): Promise<void> {
    this.disclaimerTemplates.set(id, content);
    
    // Track version history
    const versions = this.versionHistory.get(id) || [];
    versions.push(config.version);
    this.versionHistory.set(id, versions);

      await this.auditLogger.logAiInteraction(
        "DISCLAIMER_SYSTEM",
        "Register Template",
        { prompt: 0, completion: 0, total: 0 },
        0,
        { id, version: config.version }
      );
  }

  async recordAcknowledgment(
    userId: string,
    disclaimerId: string,
    version: string
  ): Promise<void> {
    try {
      const acknowledgment: DisclaimerAcknowledgment = {
        userId,
        disclaimerId,
        version,
        timestamp: new Date(),
        acknowledged: true
      };

      const userAcks = this.userAcknowledgments.get(userId) || [];
      userAcks.push(acknowledgment);
      this.userAcknowledgments.set(userId, userAcks);

      await this.auditLogger.logAiInteraction(
        "DISCLAIMER_SYSTEM",
        "Acknowledge Disclaimer",
        { prompt: 0, completion: 0, total: 0 },
        0,
        acknowledgment as unknown as Record<string, unknown>
      );
    } catch (error) {
      await this.auditLogger.logError(
        'Failed to record acknowledgment',
        error
      );
      throw error;
    }
  }

  async validateCompliance(
    disclaimerId: string,
    jurisdictions: Jurisdiction[]
  ): Promise<boolean> {
    const record = this.complianceRecords.get(disclaimerId);
    if (!record) {
      await this.auditLogger.logAiInteraction(
        "DISCLAIMER_SYSTEM",
        "Compliance Check Failed - Missing Record",
        { prompt: 0, completion: 0, total: 0 },
        0,
        { disclaimerId, jurisdictions }
      );
      return false;
    }

    const now = new Date();
    if (now > record.nextReviewDate) {
      await this.auditLogger.logAiInteraction(
        "DISCLAIMER_SYSTEM",
        "Compliance Check Failed - Review Overdue",
        { prompt: 0, completion: 0, total: 0 },
        0,
        { disclaimerId, lastReview: record.lastReviewDate }
      );
      return false;
    }

    const hasAllJurisdictions = jurisdictions.every(j => 
      record.jurisdiction.includes(j)
    );

    if (!hasAllJurisdictions) {
      await this.auditLogger.logAiInteraction(
        "DISCLAIMER_SYSTEM",
        "Compliance Check Failed - Missing Jurisdiction",
        { prompt: 0, completion: 0, total: 0 },
        0,
        { 
          disclaimerId,
          requested: jurisdictions,
          available: record.jurisdiction
        }
      );
      return false;
    }

    return true;
  }

  private addScopeLimitations(disclaimer: string, language: Language): string {
    const limitations = {
      en: "SCOPE LIMITATIONS: This tool is designed to support, not replace, clinical decision-making. It should be used in conjunction with professional medical judgment.",
      es: "LIMITACIONES DE ALCANCE: Esta herramienta está diseñada para apoyar, no reemplazar, la toma de decisiones clínicas. Debe usarse junto con el juicio médico profesional.",
      fr: "LIMITES DE PORTÉE: Cet outil est conçu pour soutenir, non remplacer, la prise de décision clinique. Il doit être utilisé en conjonction avec le jugement médical professionnel.",
      ar: "حدود النطاق: هذه الأداة مصممة لدعم، وليس استبدال، صنع القرار السريري. يجب استخدامها جنبًا إلى جنب مع الحكم الطبي المهني."
    };
    return `${limitations[language]}\n\n${disclaimer}`;
  }

  private addHighRiskWarning(disclaimer: string, language: Language): string {
    const warnings = {
      en: "⚠️ HIGH RISK MEDICAL DECISION - Professional medical consultation is required. This information is for support purposes only.",
      es: "⚠️ DECISIÓN MÉDICA DE ALTO RIESGO - Se requiere consulta médica profesional. Esta información es solo para fines de apoyo.",
      fr: "⚠️ DÉCISION MÉDICALE À HAUT RISQUE - Une consultation médicale professionnelle est requise. Ces informations sont uniquement à titre de support.",
      ar: "⚠️ قرار طبي عالي الخطورة - مطلوب استشارة طبية متخصصة. هذه المعلومات لأغراض الدعم فقط."
    };
    return `${warnings[language]}\n\n${disclaimer}`;
  }

  private addEmergencyWarning(disclaimer: string, language: Language): string {
    const warnings = {
      en: "🚨 EMERGENCY SCENARIO - Immediate professional medical attention may be required. Follow your institution's emergency protocols.",
      es: "🚨 ESCENARIO DE EMERGENCIA - Se puede requerir atención médica profesional inmediata. Siga los protocolos de emergencia de su institución.",
      fr: "🚨 SCÉNARIO D'URGENCE - Une attention médicale professionnelle immédiate peut être nécessaire. Suivez les protocoles d'urgence de votre établissement.",
      ar: "🚨 حالة طوارئ - قد تكون هناك حاجة إلى عناية طبية فورية. اتبع بروتوكولات الطوارئ الخاصة بمؤسستك."
    };
    return `${warnings[language]}\n\n${disclaimer}`;
  }

  private addSpecialtyDisclaimer(disclaimer: string, specialty: MedicalSpecialty, language: Language): string {
    const specialtyWarnings = {
      en: {
        Oncology: "ONCOLOGY NOTICE: This tool provides decision support for oncology care but does not replace clinical judgment.",
        Radiation: "RADIATION NOTICE: Radiation therapy planning requires professional medical physics consultation.",
        Palliative: "PALLIATIVE CARE NOTICE: Palliative care decisions should be made in consultation with the full care team.",
        Emergency: "EMERGENCY NOTICE: Follow established emergency protocols and seek immediate professional assistance."
      },
      es: {
        Oncology: "AVISO DE ONCOLOGÍA: Esta herramienta proporciona apoyo para decisiones en oncología pero no reemplaza el juicio clínico.",
        Radiation: "AVISO DE RADIACIÓN: La planificación de radioterapia requiere consulta profesional de física médica.",
        Palliative: "AVISO DE CUIDADOS PALIATIVOS: Las decisiones deben tomarse en consulta con todo el equipo de atención.",
        Emergency: "AVISO DE EMERGENCIA: Siga los protocolos establecidos y busque asistencia profesional inmediata."
      },
      fr: {
        Oncology: "AVIS D'ONCOLOGIE: Cet outil fournit une aide à la décision en oncologie mais ne remplace pas le jugement clinique.",
        Radiation: "AVIS DE RADIOTHÉRAPIE: La planification nécessite une consultation professionnelle en physique médicale.",
        Palliative: "AVIS DE SOINS PALLIATIFS: Les décisions doivent être prises en consultation avec l'équipe complète.",
        Emergency: "AVIS D'URGENCE: Suivez les protocoles établis et cherchez une assistance professionnelle immédiate."
      },
      ar: {
        Oncology: "إشعار الأورام: توفر هذه الأداة دعمًا للقرارات في مجال الأورام ولكنها لا تحل محل الحكم السريري.",
        Radiation: "إشعار العلاج الإشعاعي: يتطلب تخطيط العلاج الإشعاعي استشارة متخصصة في الفيزياء الطبية.",
        Palliative: "إشعار الرعاية التلطيفية: يجب اتخاذ القرارات بالتشاور مع فريق الرعاية الكامل.",
        Emergency: "إشعار الطوارئ: اتبع البروتوكولات المعمول بها واطلب المساعدة المهنية الفورية."
      }
    };
    return `${specialtyWarnings[language][specialty]}\n\n${disclaimer}`;
  }

  private addConsultationRecommendation(disclaimer: string, language: Language): string {
    const recommendations = {
      en: "\n\nPROFESSIONAL CONSULTATION: Always consult with qualified healthcare professionals for medical decisions.",
      es: "\n\nCONSULTA PROFESIONAL: Siempre consulte con profesionales de la salud calificados para decisiones médicas.",
      fr: "\n\nCONSULTATION PROFESSIONNELLE: Consultez toujours des professionnels de santé qualifiés pour les décisions médicales.",
      ar: "\n\nاستشارة متخصصة: استشر دائمًا متخصصي الرعاية الصحية المؤهلين للقرارات الطبية."
    };
    return `${disclaimer}${recommendations[language]}`;
  }
}
