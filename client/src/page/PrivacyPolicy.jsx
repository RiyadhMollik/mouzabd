import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, FileText, User, Lock, Globe, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  const [activeTab, setActiveTab] = useState('privacy');
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const privacySections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: <User className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Personal Information</h4>
            <p className="text-gray-600 mb-2">We collect information you provide directly to us, such as:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Name, email address, and contact information</li>
              <li>Account credentials and profile information</li>
              <li>Payment and billing information</li>
              <li>Communications you send to us</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Automatically Collected Information</h4>
            <p className="text-gray-600 mb-2">We automatically collect certain information when you use our services:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Device information and identifiers</li>
              <li>Usage data and analytics</li>
              <li>Location information (with your consent)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'information-use',
      title: 'How We Use Your Information',
      icon: <Globe className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-gray-600">We use the information we collect to:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices, updates, and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Communicate with you about products, services, and events</li>
            <li>Monitor and analyze trends and usage patterns</li>
            <li>Detect, investigate, and prevent fraudulent activities</li>
            <li>Comply with legal obligations</li>
          </ul>
        </div>
      )
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing',
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">We may share your information in the following circumstances:</p>
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">With Your Consent</h4>
              <p className="text-gray-600">We share information when you give us explicit consent to do so.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Service Providers</h4>
              <p className="text-gray-600">We work with third-party service providers who perform services on our behalf.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Legal Requirements</h4>
              <p className="text-gray-600">We may disclose information if required by law or to protect our rights and safety.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Business Transfers</h4>
              <p className="text-gray-600">Information may be transferred in connection with mergers, acquisitions, or asset sales.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: <Lock className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-gray-600">We implement appropriate technical and organizational measures to protect your personal information, including:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security assessments and updates</li>
            <li>Access controls and authentication measures</li>
            <li>Employee training on data protection</li>
            <li>Incident response procedures</li>
          </ul>
          <p className="text-gray-600 text-sm bg-amber-50 p-3 rounded-lg border-l-4 border-amber-400">
            <strong>Note:</strong> While we strive to protect your information, no method of transmission over the internet is 100% secure.
          </p>
        </div>
      )
    },
    {
      id: 'your-rights',
      title: 'Your Rights and Choices',
      icon: <User className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-gray-600">You have the following rights regarding your personal information:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
            <li><strong>Access:</strong> Request copies of your personal information</li>
            <li><strong>Rectification:</strong> Request correction of inaccurate information</li>
            <li><strong>Erasure:</strong> Request deletion of your personal information</li>
            <li><strong>Portability:</strong> Request transfer of your data to another service</li>
            <li><strong>Restriction:</strong> Request limitation of processing activities</li>
            <li><strong>Objection:</strong> Object to certain types of processing</li>
            <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
          </ul>
          <p className="text-gray-600 text-sm">To exercise these rights, please contact us using the information provided at the end of this policy.</p>
        </div>
      )
    }
  ];

  const termsSections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: <FileText className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-gray-600">
            By accessing and using our services, you accept and agree to be bound by the terms and provision of this agreement. 
            If you do not agree to abide by the above, please do not use this service.
          </p>
          <p className="text-gray-600">
            These terms apply to all visitors, users, and others who access or use our services.
          </p>
        </div>
      )
    },
    {
      id: 'use-license',
      title: 'Use License',
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Permission is granted to temporarily use our services for:</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Personal, non-commercial transitory viewing only</li>
              <li>Commercial use as explicitly permitted by our service plans</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">This license does NOT include:</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Modifying or copying the materials</li>
              <li>Using materials for commercial purposes without permission</li>
              <li>Attempting to reverse engineer our software</li>
              <li>Removing copyright or proprietary notations</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'user-accounts',
      title: 'User Accounts',
      icon: <User className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-gray-600">When you create an account with us, you must provide accurate and complete information. You are responsible for:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
            <li>Safeguarding your password and account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized use</li>
            <li>Maintaining accurate and up-to-date account information</li>
          </ul>
          <p className="text-gray-600">
            We reserve the right to refuse service, terminate accounts, or cancel orders at our sole discretion.
          </p>
        </div>
      )
    },
    {
      id: 'prohibited-uses',
      title: 'Prohibited Uses',
      icon: <Lock className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-gray-600">You may not use our services:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
            <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
            <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
            <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
            <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
            <li>To submit false or misleading information</li>
            <li>To upload or transmit viruses or any other type of malicious code</li>
            <li>To collect or track personal information of others</li>
            <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
            <li>For any obscene or immoral purpose</li>
            <li>To interfere with or circumvent security features</li>
          </ul>
        </div>
      )
    },
    {
      id: 'disclaimers',
      title: 'Disclaimers',
      icon: <Globe className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-gray-600">
            The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, 
            this Company excludes all representations, warranties, conditions and terms.
          </p>
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <p className="text-gray-700 font-semibold mb-2">Important Disclaimer:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Services are provided "as is" without warranties</li>
              <li>We do not guarantee uninterrupted or error-free service</li>
              <li>We are not liable for any indirect, incidental, or consequential damages</li>
              <li>Your use of our services is at your own risk</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'limitations',
      title: 'Limitations',
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-gray-600">
            In no event shall our company or its suppliers be liable for any damages (including, without limitation, 
            damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
            to use our services.
          </p>
          <p className="text-gray-600">
            Our total liability to you for all damages, losses, and causes of action shall not exceed the amount 
            paid by you, if any, for accessing our services.
          </p>
        </div>
      )
    }
  ];

  const SectionAccordion = ({ sections, prefix }) => (
    <div className="space-y-4">
      {sections.map((section) => (
        <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection(`${prefix}-${section.id}`)}
            className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="text-blue-600">{section.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
            </div>
            {expandedSections[`${prefix}-${section.id}`] ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {expandedSections[`${prefix}-${section.id}`] && (
            <div className="px-6 py-4 border-t border-gray-200 bg-white">
              {section.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Legal Center</h1>
                <p className="text-sm text-gray-500">Privacy Policy & Terms of Service</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
              <span>Last updated:</span>
              <span className="font-medium">May 27, 2025</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors duration-200 ${
                activeTab === 'privacy'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Privacy Policy</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors duration-200 ${
                activeTab === 'terms'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Terms of Service</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 sm:p-8">
            {activeTab === 'privacy' ? (
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    This Privacy Policy describes how we collect, use, and protect your personal information when you use our services. 
                    We are committed to protecting your privacy and ensuring the security of your personal data.
                  </p>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <p className="text-blue-800">
                      <strong>Effective Date:</strong> May 27, 2025 | 
                      <strong className="ml-2">Last Updated:</strong> May 27, 2025
                    </p>
                  </div>
                </div>
                <SectionAccordion sections={privacySections} prefix="privacy" />
              </div>
            ) : (
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    These Terms of Service govern your use of our website and services. By using our services, 
                    you agree to comply with these terms and conditions.
                  </p>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <p className="text-blue-800">
                      <strong>Effective Date:</strong> May 27, 2025 | 
                      <strong className="ml-2">Last Updated:</strong> May 27, 2025
                    </p>
                  </div>
                </div>
                <SectionAccordion sections={termsSections} prefix="terms" />
              </div>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm">
          <div className="p-6 sm:p-8">
            <div className="flex items-center space-x-3 mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Contact Us</h3>
            </div>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy or Terms of Service, please contact us:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-gray-600"><strong>Email:</strong> legal@company.com</p>
                <p className="text-gray-600"><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p className="text-gray-600"><strong>Response Time:</strong> Within 48 hours</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600"><strong>Address:</strong></p>
                <p className="text-gray-600">
                  123 Business Street<br />
                  Suite 100<br />
                  City, State 12345<br />
                  United States
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            This document was last updated on May 27, 2025. We may update these terms from time to time, 
            and we will notify you of any material changes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;