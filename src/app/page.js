import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Send, Loader2 } from 'lucide-react';

const QuestionnaireForm = () => {
  const [formData, setFormData] = useState({});
  const [openSections, setOpenSections] = useState({ basic: true });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const sections = [
    {
      id: 'basic',
      title: 'Alapinformációk és projektkörnyezet',
      questions: [
        { id: 'qr_code_type', text: 'Az egyedi digitális kód QR-kódot jelent - bármilyen okos eszközzel le lehessen olvasni?', type: 'radio', options: ['Igen', 'Nem', 'Részben'] },
        { id: 'furniture_user_count', text: 'Körülbelül mennyi bútort és felhasználót kell kezelni a rendszerben?', type: 'textarea' },
        { id: 'furniture_types', text: 'Milyen típusú bútorok kerülnek a rendszerbe? (irodai, lakberendezési, speciális)', type: 'text' },
        { id: 'deadline', text: 'A megvalósítás határideje milyen sürgős?', type: 'select', options: ['1-3 hónap', '3-6 hónap', '6+ hónap'] },
        { id: 'existing_systems', text: 'Van-e már meglévő készletgazdálkodási vagy ERP rendszer, amivel integrálni kell?', type: 'textarea' }
      ]
    },
    {
      id: 'functional',
      title: 'Funkcionális követelmények',
      questions: [
        { id: 'location_coordinates', text: 'Mit jelent pontosan a "bútordarab ingatlanon belüli elhelyezkedési koordinátái"? Ez hogyan néz ki a gyakorlatban?', type: 'textarea' },
        { id: 'additional_info', text: 'Milyen egyéb megrendelő által kért információk lehetnek? Ezek hol kerülnek rögzítésre?', type: 'textarea' },
        { id: 'search_criteria', text: 'Az adatbázisnak csak a digitális kód, vagy egyéb információk alapján is kereshetőnek, szűrhetőnek kell lennie? Ha egyéb is, mik ezek?', type: 'textarea' },
        { id: 'service_data', text: 'Milyen információk/adattípusok jelennek meg egy szervizeléssel kapcsolatban?', type: 'textarea' },
        { id: 'automatic_alerts', text: 'Igény-e automatikus riasztások küldése? (pl. lejáró garancia, esedékes karbantartás)', type: 'radio', options: ['Igen', 'Nem', 'Később eldöntjük'] },
        { id: 'photo_documents', text: 'Szükséges-e fotók/dokumentumok csatolása a bútorokhoz?', type: 'radio', options: ['Igen', 'Nem', 'Opcionális'] },
        { id: 'cost_tracking', text: 'Kell-e költségkövetés funkcionalitás a szervizekhez/karbantartáshoz?', type: 'radio', options: ['Igen', 'Nem', 'Alapszinten'] }
      ]
    },
    {
      id: 'permissions',
      title: 'Felhasználói jogosultságok és hozzáférés',
      questions: [
        { id: 'access_levels', text: 'Várhatóan mennyi hozzáférési szint/szerepkör lesz, és mik lesznek ezek?', type: 'textarea' },
        { id: 'editable_data', text: 'A szerviz információkon kívül milyen adatok kerülhetnek szerkesztésre?', type: 'textarea' },
        { id: 'approval_workflow', text: 'Szükséges-e jóváhagyási workflow egyes műveletekhez?', type: 'radio', options: ['Igen', 'Nem', 'Csak kritikus műveleteknél'] },
        { id: 'audit_trail', text: 'Kell-e audit trail (ki, mit, mikor módosított) funkció?', type: 'radio', options: ['Igen', 'Nem', 'Alapszinten'] }
      ]
    },
    {
      id: 'technical',
      title: 'Technikai környezet',
      questions: [
        { id: 'office_requirement', text: 'Mit jelent pontosan, hogy "Microsoft Office csomaggal ellátott eszközök"? Miért kitétel az Office?', type: 'textarea' },
        { id: 'offline_access', text: 'Az adatbázis offline elérhetőségére is szükség van?', type: 'radio', options: ['Igen', 'Nem', 'Részlegesen'] },
        { id: 'browser_support', text: 'Milyen böngészőket kell támogatni? (Chrome, Safari, Edge, stb.)', type: 'text' },
        { id: 'tech_platform', text: 'Van-e előnyben részesített technológiai platform? (Windows, web-based, cloud, on-premise)', type: 'text' },
        { id: 'security_requirements', text: 'Milyen biztonsági követelmények vannak? (GDPR megfelelőség, adattitkosítás, stb.)', type: 'textarea' },
        { id: 'external_integrations', text: 'Szükséges-e külső rendszerekkel való integráció? (HR, pénzügy, facility management)', type: 'textarea' }
      ]
    },
    {
      id: 'data',
      title: 'Adatkezelés és import/export',
      questions: [
        { id: 'data_editing', text: 'Hogyan történik az adatbázis szerkesztése? Közvetlen szerkesztés vagy importálás?', type: 'textarea' },
        { id: 'export_options', text: 'Igény-e az adatok exportálási lehetősége? Milyen formátumokban?', type: 'text' },
        { id: 'existing_database', text: 'Van-e meglévő adatbázis, amit migrálni kell?', type: 'textarea' },
        { id: 'backup_frequency', text: 'Milyen gyakran kell biztonsági mentést készíteni?', type: 'select', options: ['Naponta', 'Hetente', 'Havonta', 'Egyéb'] },
        { id: 'data_storage', text: 'Hol tárolódjanak az adatok? (helyi szerver, cloud, hibrid megoldás)', type: 'select', options: ['Helyi szerver', 'Cloud', 'Hibrid', 'Közömbös'] }
      ]
    },
    {
      id: 'localization',
      title: 'Lokalizáció és testreszabhatóság',
      questions: [
        { id: 'multilingual', text: 'Van-e többnyelvűség vagy lokalizáció igény?', type: 'text' },
        { id: 'customization', text: 'Szükséges-e a rendszer testreszabhatósága céges arculattal?', type: 'radio', options: ['Igen', 'Nem', 'Alapszinten'] },
        { id: 'reporting_needs', text: 'Milyen jelentési igények vannak? (dashboard, export, automatikus jelentések)', type: 'textarea' }
      ]
    },
    {
      id: 'support',
      title: 'Támogatás és karbantartás',
      questions: [
        { id: 'tech_support', text: 'Milyen szintű technikai támogatásra van szükség?', type: 'textarea' },
        { id: 'user_training', text: 'Szükséges-e felhasználói képzés?', type: 'radio', options: ['Igen', 'Nem', 'Online anyagok elegendők'] },
        { id: 'documentation', text: 'Kell-e dokumentáció magyar nyelven?', type: 'radio', options: ['Igen', 'Nem', 'Kétnyelvű'] },
        { id: 'maintenance', text: 'Milyen karbantartási és frissítési igények vannak hosszú távon?', type: 'textarea' }
      ]
    },
    {
      id: 'budget',
      title: 'Költségvetési keretek',
      questions: [
        { id: 'budget_frame', text: 'Van-e előzetes költségvetési keret a projektre?', type: 'text' },
        { id: 'payment_method', text: 'Egyösszegű kifizetés vagy ütemezett fizetés preferált?', type: 'select', options: ['Egyösszegű', 'Ütemezett', 'Rugalmas'] },
        { id: 'license_model', text: 'Szükséges-e folyamatos licencdíj vagy egyszeri költség preferált?', type: 'select', options: ['Egyszeri', 'Licencdíj', 'Hibrid'] }
      ]
    },
    {
      id: 'business',
      title: 'Üzleti célok',
      questions: [
        { id: 'motivation', text: 'Mi a fő motiváció a rendszer bevezetésére? (hatékonyság, compliance, cost-saving)', type: 'textarea' },
        { id: 'roi_expectations', text: 'Milyen megtérülést várnak a beruházástól?', type: 'textarea' },
        { id: 'expansion_plans', text: 'Van-e tervezett bővítés más telephelyekre/részlegekre?', type: 'textarea' }
      ]
    },
    {
      id: 'architecture',
      title: 'Rendszerarchitektúra és fejlesztési igények',
      questions: [
        { id: 'custom_development', text: 'Teljes egyedi fejlesztésre van szükség? Kell-e teljes web API fejlesztése a semmiből?', type: 'textarea' },
        { id: 'preferred_tech', text: 'Van-e előnyben részesített programozási nyelv/keretrendszer?', type: 'text' },
        { id: 'cms_needed', text: 'CMS (tartalomkezelő) rendszer szükséges? Ki fogja feltölteni/szerkeszteni az alapadatokat?', type: 'textarea' },
        { id: 'editor_complexity', text: 'Milyen szintű szerkesztői felület kell? (egyszerű form-ok vagy fejlett editor)', type: 'select', options: ['Egyszerű form-ok', 'Fejlett editor', 'Mindkettő'] },
        { id: 'qr_access_level', text: 'QR kód által elérhető oldal hozzáférési szintje (publikus/jogosultsághoz kötött/hibrid)?', type: 'select', options: ['Teljesen publikus', 'Bejelentkezéshez kötött', 'Hibrid (alap publikus, részletek védettek)'] },
        { id: 'public_data_examples', text: 'Milyen adatok lehetnek nyilvánosak a QR kód beolvasásakor?', type: 'textarea' },
        { id: 'api_access', text: 'Kik férhetnek hozzá az API-hoz? (csak saját rendszer, külső partnerek, mobilalkalmazás)', type: 'textarea' },
        { id: 'api_security', text: 'Szükséges-e API kulcsok/token alapú authentikáció? Rate limiting?', type: 'textarea' },
        { id: 'data_privacy', text: 'GDPR megfelelőség a publikus adatoknál - milyen személyes adatok kezelése szükséges?', type: 'textarea' }
      ]
    }
  ];

  const handleInputChange = (questionId, value) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/send-questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          responses: formData,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({});
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question) => {
    const value = formData[question.id] || '';

    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            id={question.id}
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        );
      
      case 'textarea':
        return (
          <textarea
            id={question.id}
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            rows={3}
            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
          />
        );
      
      case 'select':
        return (
          <select
            id={question.id}
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Válasszon...</option>
            {question.options.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'radio':
        return (
          <div className="mt-2 space-y-2">
            {question.options.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          QR Kódos Készletgazdálkodási Rendszer
        </h1>
        <p className="text-lg text-gray-600">
          Kérdőív árajánlat előkészítéséhez
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.id} className="border border-gray-200 rounded-lg">
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 rounded-t-lg flex items-center justify-between"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                {section.title}
              </h2>
              {openSections[section.id] ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            {openSections[section.id] && (
              <div className="px-6 py-4 space-y-6">
                {section.questions.map((question, index) => (
                  <div key={question.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                    <label htmlFor={question.id} className="block text-sm font-medium text-gray-900 mb-1">
                      {index + 1}. {question.text}
                    </label>
                    {renderQuestion(question)}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {Object.keys(formData).length} / {sections.reduce((total, section) => total + section.questions.length, 0)} kérdés megválaszolva
          </div>
          
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Küldés...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Kérdőív elküldése
              </>
            )}
          </button>
        </div>

        {submitStatus === 'success' && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
            Köszönjük! A kérdőív sikeresen elküldve. Hamarosan felvesszük Önnel a kapcsolatot.
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            Hiba történt a küldés során. Kérjük, próbálja újra vagy vegye fel velünk a kapcsolatot.
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionnaireForm;