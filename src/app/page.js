"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Send, Loader2, CheckCircle, AlertCircle, QrCode } from 'lucide-react';

const QuestionnaireForm = () => {
  const [formData, setFormData] = useState({});
  const [openSections, setOpenSections] = useState({ basic: true });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [completedSections, setCompletedSections] = useState(new Set());

  const sections = [
    {
      id: 'basic',
      title: 'Alapinformációk és projektkörnyezet',
      icon: '🏗️',
      color: 'from-blue-500 to-blue-600',
      questions: [
        { id: 'qr_code_type', text: 'Az egyedi digitális kód QR-kódot jelent - bármilyen okos eszközzel le lehessen olvasni?', type: 'radio', options: ['Igen', 'Nem', 'Részben'] },
        { id: 'furniture_user_count', text: 'Körülbelül mennyi bútort és felhasználót kell kezelni a rendszerben?', type: 'textarea' },
        { id: 'deadline', text: 'A megvalósítás határideje milyen sürgős?', type: 'select', options: ['1-3 hónap', '3-6 hónap', '6+ hónap'] },
        { id: 'existing_systems', text: 'Van-e már meglévő készletgazdálkodási vagy ERP rendszer, amivel integrálni kell?', type: 'textarea' }
      ]
    },
    {
      id: 'functional',
      title: 'Funkcionális követelmények',
      icon: '⚙️',
      color: 'from-emerald-500 to-emerald-600',
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
      icon: '👥',
      color: 'from-purple-500 to-purple-600',
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
      icon: '💻',
      color: 'from-orange-500 to-orange-600',
      questions: [
        { id: 'office_requirement', text: 'Mit jelent pontosan, hogy "Microsoft Office csomaggal ellátott eszközök"? Miért kitétel az Office?', type: 'textarea' },
        { id: 'offline_access', text: 'Az adatbázis offline elérhetőségére is szükség van?', type: 'radio', options: ['Igen', 'Nem', 'Részlegesen'] },
        { id: 'security_requirements', text: 'Milyen biztonsági követelmények vannak? (GDPR megfelelőség, adattitkosítás, stb.)', type: 'textarea' },
        { id: 'external_integrations', text: 'Szükséges-e külső rendszerekkel való integráció? (HR, pénzügy, facility management)', type: 'textarea' }
      ]
    },
    {
      id: 'data',
      title: 'Adatkezelés és import/export',
      icon: '📊',
      color: 'from-teal-500 to-teal-600',
      questions: [
        { id: 'data_editing', text: 'Hogyan történik az adatbázis szerkesztése? Közvetlen szerkesztés vagy importálás?', type: 'textarea' },
        { id: 'export_options', text: 'Igény-e az adatok exportálási lehetősége? Milyen formátumokban?', type: 'text' },
        { id: 'existing_database', text: 'Van-e meglévő adatbázis, amit migrálni kell?', type: 'textarea' },
        { id: 'backup_frequency', text: 'Milyen gyakran kell biztonsági mentést készíteni?', type: 'select', options: ['Naponta', 'Hetente', 'Havonta', 'Egyéb'] },
      ]
    },
     {
      id: 'architecture',
      title: 'Rendszerarchitektúra és fejlesztési igények',
      icon: '🏛️',
      color: 'from-indigo-500 to-indigo-600',
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
    },
    {
      id: 'localization',
      title: 'Lokalizáció és testreszabhatóság',
      icon: '🌍',
      color: 'from-pink-500 to-pink-600',
      questions: [
        { id: 'multilingual', text: 'Van-e többnyelvűség vagy lokalizáció igény?', type: 'text' },
        { id: 'customization', text: 'Szükséges-e a rendszer testreszabhatósága céges arculattal?', type: 'radio', options: ['Igen', 'Nem', 'Alapszinten'] },
        { id: 'reporting_needs', text: 'Milyen jelentési igények vannak? (dashboard, export, automatikus jelentések)', type: 'textarea' }
      ]
    },
    {
      id: 'support',
      title: 'Támogatás és karbantartás',
      icon: '🛠️',
      color: 'from-cyan-500 to-cyan-600',
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
      icon: '💰',
      color: 'from-yellow-500 to-yellow-600',
      questions: [
        { id: 'budget_frame', text: 'Van-e előzetes költségvetési keret a projektre?', type: 'text' },
        { id: 'payment_method', text: 'Egyösszegű kifizetés vagy ütemezett fizetés preferált?', type: 'select', options: ['Egyösszegű', 'Ütemezett', 'Rugalmas'] },
        { id: 'license_model', text: 'Szükséges-e folyamatos licencdíj vagy egyszeri költség preferált?', type: 'select', options: ['Egyszeri', 'Licencdíj', 'Hibrid'] }
      ]
    },
  ];

  // Check section completion
  useEffect(() => {
    const newCompletedSections = new Set();
    sections.forEach(section => {
      const sectionQuestions = section.questions.map(q => q.id);
      const answeredQuestions = sectionQuestions.filter(qId => formData[qId] && formData[qId].trim() !== '');
      if (answeredQuestions.length >= Math.ceil(sectionQuestions.length * 0.5)) {
        newCompletedSections.add(section.id);
      }
    });
    setCompletedSections(newCompletedSections);
  }, [formData]);

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

  const handleSubmit = async () => {
    console.log('🚀 Submit button clicked');
    console.log('📝 Form data:', formData);
    
    setIsSubmitting(true);
    setSubmitStatus(null);

    const payload = {
      responses: formData,
      timestamp: new Date().toISOString(),
    };

    try {
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('✅ Success!');
      setSubmitStatus('success');
      setFormData({});
    } catch (error) {
      console.error('💥 Submit error:', error);
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
            className="mt-3 block w-full rounded-lg border border-gray-200 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50"
            placeholder="Írja be a választ..."
          />
        );
      
      case 'textarea':
        return (
          <textarea
            id={question.id}
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            rows={4}
            className="mt-3 block w-full rounded-lg border border-gray-200 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-y bg-white/50"
            placeholder="Részletes válasz..."
          />
        );
      
      case 'select':
        return (
          <select
            id={question.id}
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="mt-3 block w-full rounded-lg border border-gray-200 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50"
          >
            <option value="">Válasszon opciót...</option>
            {question.options.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'radio':
        return (
          <div className="mt-3 space-y-3">
            {question.options.map((option, index) => (
              <label key={index} className="flex items-center group cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{option}</span>
              </label>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  const totalQuestions = sections.reduce((total, section) => total + section.questions.length, 0);
  const answeredQuestions = Object.keys(formData).length;
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                <QrCode className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              QR Kódos Készletgazdálkodási Rendszer
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Intelligens megoldás bútorok és eszközök nyomon követésére modern QR technológiával
            </p>
            
            {/* Progress Bar */}
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between text-sm text-blue-100 mb-2">
                <span>Haladás</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-blue-100 mt-2">
                {answeredQuestions} / {totalQuestions} kérdés megválaszolva
              </p>
            </div>
          </div>
        </div>
        
    
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {sections.map((section, sectionIndex) => {
            const isCompleted = completedSections.has(section.id);
            const isOpen = openSections[section.id];
            
            return (
              <div 
                key={section.id} 
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                {/* Section Header */}
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className={`w-full px-8 py-6 text-left bg-gradient-to-r ${section.color} hover:opacity-90 transition-all duration-300 flex items-center justify-between`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{section.icon}</div>
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-1">
                        {section.title}
                      </h2>
                      <div className="flex items-center space-x-2">
                        <span className="text-white/80 text-sm">
                          {section.questions.length} kérdés
                        </span>
                        {isCompleted && (
                          <div className="flex items-center space-x-1 bg-white/20 px-2 py-1 rounded-full">
                            <CheckCircle className="w-4 h-4 text-white" />
                            <span className="text-white text-xs font-medium">Kitöltött</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-white/60 text-sm">
                      {sectionIndex + 1}/{sections.length}
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-6 h-6 text-white transition-transform duration-200" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-white transition-transform duration-200" />
                    )}
                  </div>
                </button>
                
                {/* Section Content */}
                {isOpen && (
                  <div className="px-8 py-8 bg-gradient-to-br from-gray-50/50 to-white">
                    <div className="space-y-8">
                      {section.questions.map((question, index) => {
                        const isAnswered = formData[question.id] && formData[question.id].trim() !== '';
                        
                        return (
                          <div 
                            key={question.id} 
                            className={`relative p-6 rounded-xl border transition-all duration-300 ${
                              isAnswered 
                                ? 'bg-green-50/50 border-green-200 shadow-sm' 
                                : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                            }`}
                          >
                            <div className="flex items-start space-x-4">
                              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                isAnswered 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-gray-200 text-gray-600'
                              }`}>
                                {isAnswered ? '✓' : index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <label htmlFor={question.id} className="block text-gray-900 font-medium mb-2 leading-relaxed">
                                  {question.text}
                                </label>
                                {renderQuestion(question)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Submit Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Kész a kérdőív elküldésére?
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${answeredQuestions > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span>{answeredQuestions} válasz</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${completedSections.size > 0 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <span>{completedSections.size} befejezett szekció</span>
                  </div>
                </div>
              </div>
              
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || answeredQuestions === 0}
                className="flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Küldés folyamatban...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-3" />
                    Kérdőív elküldése
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div>
                  <h4 className="text-green-900 font-semibold mb-1">Sikeresen elküldve!</h4>
                  <p className="text-green-700">Köszönjük válaszait! Kollégáink hamarosan felveszük Önnel a kapcsolatot a részletekkel kapcsolatban.</p>
                </div>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <h4 className="text-red-900 font-semibold mb-1">Hiba történt</h4>
                  <p className="text-red-700">Sajnos nem sikerült elküldeni a kérdőívet. Kérjük, próbálja újra, vagy vegye fel velünk a kapcsolatot.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireForm;