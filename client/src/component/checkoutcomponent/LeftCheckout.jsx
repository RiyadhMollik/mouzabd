import React, { useState, useEffect, useContext } from 'react';
import { Check, Package, Phone, Mail, Lock, MessageCircle, AlertCircle, Plus, X } from 'lucide-react';
import { convertNumberToBangla } from '../../utils/englishToBangla';
import { GoogleLogin } from "@react-oauth/google";
import { AuthContext } from '../../provider/AuthProvider';

const AdditionalFeaturesModal = ({ 
  isOpen, 
  onClose, 
  feature, 
  selectedAdditionals, 
  onAdditionalToggle, 
  deliveryAddress, 
  onAddressChange, 
  onProceed,
  selectedExtraFeatures,
  onFeatureDeselection,
  // phone required (value + updater from parent)
  phoneNumber,
  onPhoneChange,
}) => {
  if (!isOpen || !feature) return null;

  const hasSelectedAdditionals =
    selectedAdditionals[feature.id] &&
    Object.values(selectedAdditionals[feature.id]).some(Boolean);

  // Identify delivery charge
  const isDeliveryCharge = (item) => {
    const n = (item?.name || '').toLowerCase();
    return (
      item?.is_delivery_charge === true ||
      n.includes('delivery charge') ||
      n.includes('ডেলিভারি চার্জ') ||
      (n.includes('ডেলিভারি') && n.includes('চার্জ'))
    );
  };

  // Auto-select Delivery Charge when modal opens / feature changes
  useEffect(() => {
    if (!feature || !feature.additionals || !feature.additionals.length) return;
    const dc = feature.additionals.find(isDeliveryCharge);
    if (!dc) return;
    const already = selectedAdditionals[feature.id]?.[dc.id];
    if (!already) onAdditionalToggle(feature.id, dc.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feature]);

  // Totals
  let additionalTotal = 0;
  if (selectedAdditionals[feature.id] && feature.additionals) {
    additionalTotal = feature.additionals.reduce((total, additional) => {
      if (selectedAdditionals[feature.id][additional.id]) {
        return total + parseFloat(additional.offer_price || additional.price || 0);
      }
      return total;
    }, 0);
  }

  const mainFeaturePrice = parseFloat(feature.offer_price || feature.price || 0);
  const totalPrice = mainFeaturePrice + additionalTotal;
  const phoneOk = !!(phoneNumber && String(phoneNumber).trim());
  const addressOk = !!(deliveryAddress && deliveryAddress.trim());

  // ✅ Safe close: info না দিলে feature deselect + modal close
  const handleSafeClose = () => {
    if (hasSelectedAdditionals && (!addressOk || !phoneOk)) {
      onFeatureDeselection?.(); // parent-এ feature unselect + additionals clear করুন
    }
    onClose?.();
  };

  return (
    // overlay click => safe close
    <div
      className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-90 backdrop-blur-sm"
      onClick={handleSafeClose}
    >
      {/* modal body click => stop bubbling */}
      <div
        className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">{feature.name}</h3>
            <button 
              onClick={handleSafeClose} // ❗ X বাটনে safe close
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Feature */}
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800">{feature.name}</h4>
                <p className="text-sm text-gray-600">মূল সেবা</p>
              </div>
              <div className="text-lg font-bold text-green-600">
                ৳{convertNumberToBangla(mainFeaturePrice.toFixed(2))}
              </div>
            </div>
            <div className="mt-2 text-xs text-green-700">
              ✓ এই সেবা ইতিমধ্যে নির্বাচিত
            </div>
          </div>

          {/* Additionals */}
          {feature.additionals && feature.additionals.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                অতিরিক্ত সেবা:
                <span className="ml-2 text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  {feature.additionals.length} available
                </span>
              </h4>
              <div className="space-y-3">
                {feature.additionals.map((additional) => {
                  const isSelected = selectedAdditionals[feature.id]?.[additional.id] || false;
                  const displayPrice = parseFloat(additional.offer_price || additional.price || 0);
                  const hasOffer = additional.offer_price && parseFloat(additional.offer_price) < parseFloat(additional.price);
                  const lockedDC = isDeliveryCharge(additional);

                  return (
                    <div 
                      key={additional.id} 
                      className={`border rounded-lg p-4 transition-all cursor-pointer ${
                        isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        if (lockedDC) return; // delivery charge cannot be toggled off
                        onAdditionalToggle(feature.id, additional.id);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              if (lockedDC) return;
                              onAdditionalToggle(feature.id, additional.id);
                            }}
                            disabled={lockedDC}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <div>
                            <div className="font-medium text-gray-800">
                              {additional.name}
                              {lockedDC && (
                                <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 align-middle">
                                  Auto
                                </span>
                              )}
                            </div>
                            {additional.status && (
                              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full mt-1 inline-block">
                                Available
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">
                            ৳{convertNumberToBangla(displayPrice.toFixed(2))}
                          </div>
                          {hasOffer && (
                            <div className="text-xs text-gray-500 line-through">
                              ৳{convertNumberToBangla(parseFloat(additional.price).toFixed(2))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected summary */}
              {hasSelectedAdditionals && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm text-blue-800 mb-1">
                    <strong>{Object.values(selectedAdditionals[feature.id]).filter(Boolean).length}</strong> অতিরিক্ত সেবা নির্বাচিত
                  </div>
                  <div className="font-semibold text-blue-600">
                    অতিরিক্ত খরচ: ৳{convertNumberToBangla(additionalTotal.toFixed(2))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Address + Mobile required if any additional is selected */}
          {hasSelectedAdditionals && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg" id='globalDeliveryAddress'>
              <div className="flex items-center space-x-2 mb-3">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <h4 className="font-semibold text-orange-800">ডেলিভারি তথ্য প্রয়োজন</h4>
              </div>
              
              <div className="mb-3 text-sm text-orange-700">
                আপনি {Object.values(selectedAdditionals[feature.id]).filter(Boolean).length}টি অতিরিক্ত সেবা নির্বাচন করেছেন যার জন্য ডেলিভারি ঠিকানা প্রয়োজন।
              </div>
              
              {/* Address */}
              <div className="mb-4">
                <label htmlFor="deliveryAddress" className="block text-base font-medium text-gray-700 mb-2">
                  ডেলিভারি ঠিকানা *
                </label>
                <textarea
                  id="deliveryAddress"
                  value={deliveryAddress}
                  onChange={onAddressChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                  placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন... (বাড়ি/ফ্ল্যাট নং, রোড, এলাকা, জেলা)"
                  required
                />
              </div>

              {/* Mobile number */}
              <div>
                <label htmlFor="modal_mobile_number" className="block text-base font-medium text-gray-700 mb-2">
                  মোবাইল নম্বর *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    id="modal_mobile_number"
  name="mobile_number"
  value={phoneNumber || ''}
  onChange={onPhoneChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="আপনার মোবাইল নম্বর লিখুন"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * “Delivery Charge” স্বয়ংক্রিয়ভাবে যুক্ত করা হয়েছে। মোবাইল নম্বর ও ডেলিভারি ঠিকানা বাধ্যতামূলক।
                </p>
              </div>
            </div>
          )}

          {/* Totals */}
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">মূল সেবা:</span>
                <span className="font-medium">৳{convertNumberToBangla(mainFeaturePrice.toFixed(2))}</span>
              </div>
              {additionalTotal > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">অতিরিক্ত সেবা:</span>
                  <span className="font-medium text-blue-600">৳{convertNumberToBangla(additionalTotal.toFixed(2))}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between">
                <span className="font-bold text-gray-800">মোট:</span>
                <span className="font-bold text-green-600 text-lg">৳{convertNumberToBangla(totalPrice.toFixed(2))}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onFeatureDeselection}
              className="flex-1 py-3 px-4 border border-red-300 rounded-lg text-red-700 hover:bg-red-50 transition-colors"
            >
              সেবা বাতিল করুন
            </button>
            <button
              onClick={onProceed}
              disabled={(hasSelectedAdditionals && !addressOk) || (hasSelectedAdditionals && !phoneOk)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                (!hasSelectedAdditionals || (addressOk && phoneOk))
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              {hasSelectedAdditionals && (!addressOk || !phoneOk) 
                ? (!addressOk ? 'ঠিকানা প্রয়োজন':'মোবাইল নম্বর দিন')
                : 'নিশ্চিত করুন'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const LeftCheckout = ({
  handleGoogleError,
  handleGoogleSuccess,
  featuresLoading,
  handleCheckboxChange,
  featuresError,
  packageInfo,
  handleInputChange,
  sameAsPhone,
  formData,
  setselectedTab,
  extraFeatures,
  userdata,
  getSortedExtraFeatures,
  selectedExtraFeatures,
  prices,
  handleExtraFeatureToggle,
  // Modal props
  showAdditionalModal,
  selectedFeatureForModal,
  selectedAdditionals,
  deliveryAddress,
  closeAdditionalModal,
  handleAdditionalToggle,
  handleAddressChange,
  handleModalProceed,
  handleFeatureDeselectionFromModal,
  // Validation props
  isDeliveryAddressRequired,
  getDeliveryAddressMessage
}) => {
  const [activeTab, setActiveTab] = useState('signin');
  const { register } = useContext(AuthContext); // ✅ for google signup

  useEffect(() => {
    setselectedTab(activeTab);
  }, [activeTab, setselectedTab]);

  // ✅ Google Register handlers (for Register tab)
  const onGoogleRegisterSuccess = async ({ credential }) => {
    try {
      if (!credential) throw new Error('No token received from Google');
      // AuthProvider.register('google') → calls /google-signup/
      await register?.('google', { token: credential });
      // optional: page refresh or soft success notice
      window.location.reload();
    } catch (e) {
      console.error('Google signup failed:', e);
      alert('Google signup failed. Please try again.');
    }
  };

  const onGoogleRegisterError = (err) => {
    console.error('Google Signup Failed:', err);
    alert('Google signup failed. Please try again.');
  };

  return (
    <>
      <div className="space-y-6">
        {!featuresLoading && !featuresError && extraFeatures?.data && extraFeatures.data.length > 0 && (
          <div className="bg-white rounded-xl px-2 py-6 lg:p-8"  id="extraFeaturesSection"> 
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <Plus className="w-6 h-6 mr-2 text-green-600" />
              আপনার পছন্দ বেছে নিন
              <span className="ml-2 text-center text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                2 available
              </span>
            </h2>

            <div className="space-y-4">
              {getSortedExtraFeatures().slice(0, 2).map((feature, index) => {
                // First feature (JPG/PDF) is always selected and disabled
                const isFirstFeature = index === 0;
                const isSelected = isFirstFeature || selectedExtraFeatures.includes(feature.id);
                const displayPrice = parseFloat(feature.offer_price || feature.price || 0);
                const hasOffer = feature.offer_price && parseFloat(feature.offer_price) < parseFloat(feature.price);
                const hasAdditionals = feature.additionals && feature.additionals.length > 0;
                const hasSelectedAdditionals =
                  selectedAdditionals[feature.id] &&
                  Object.values(selectedAdditionals[feature.id]).some(Boolean);

                // Additional price
                let additionalTotal = 0;
                if (selectedAdditionals[feature.id] && feature.additionals) {
                  additionalTotal = feature.additionals.reduce((total, additional) => {
                    if (selectedAdditionals[feature.id][additional.id]) {
                      return total + parseFloat(additional.offer_price || additional.price || 0);
                    }
                    return total;
                  }, 0);
                }

                return (
                  <div 
                    key={feature.id}
                    className={`border rounded-lg p-4 ${isFirstFeature ? '' : 'cursor-pointer hover:border-gray-300'} transition-all duration-200 ${
                      isSelected 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => {
                      if (!isFirstFeature) {
                        handleExtraFeatureToggle(feature.id);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            if (!isFirstFeature) {
                              handleExtraFeatureToggle(feature.id);
                            }
                          }}
                          disabled={isFirstFeature}
                          className={`w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 ${isFirstFeature ? 'cursor-not-allowed opacity-60' : ''}`}
                        />
                        <div>
                          <h4 className="font-medium text-gray-800 flex items-center">
                            {feature.name}
                            {hasAdditionals && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                +{feature.additionals.length} extra
                              </span>
                            )}
                          </h4>
                          {feature.description && (
                            <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                          )}
                          {feature.status && (
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full mt-1 inline-block">
                              Available
                            </span>
                          )}
                          {hasSelectedAdditionals && (
                            <div className="text-xs text-blue-600 mt-1">
                              {Object.values(selectedAdditionals[feature.id]).filter(Boolean).length} additional selected
                            </div>
                          )}
                          {/* Address requirement reminder */}
                          {isSelected && hasAdditionals && (
                            <div className="text-xs text-orange-600 mt-1 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              ডেলিভারি ঠিকানা প্রয়োজন
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-green-600">
                          {displayPrice === 0
                            ? ""
                            : `৳${convertNumberToBangla((displayPrice + additionalTotal).toFixed(2))}`}
                        </div>
                        {hasOffer && (
                          <div className="text-sm text-gray-500 line-through">
                            ৳{convertNumberToBangla(parseFloat(feature.price).toFixed(2))}
                          </div>
                        )}
                        {additionalTotal > 0 && (
                          <div className="text-xs text-blue-600">
                            +৳{convertNumberToBangla(additionalTotal.toFixed(2))} additional
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {!packageInfo?.is_static && selectedExtraFeatures.length > 0 && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm text-green-800 mb-2">
                  <strong>{selectedExtraFeatures.length}</strong> extra feature{selectedExtraFeatures.length > 1 ? 's' : ''} selected
                </div>
                <div className="text-lg font-bold text-green-600">
                  Additional Cost: ৳{convertNumberToBangla((prices.extraFeaturesTotal + prices.additionalFeaturesTotal).toFixed(2))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Global Delivery Address Section - only when required */}
        {isDeliveryAddressRequired && isDeliveryAddressRequired() && (
          <div className="bg-white rounded-xl p-4 lg:p-8" id='globalDeliveryAddress'>
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <h4 className="font-semibold text-orange-800">ডেলিভারি তথ্য প্রয়োজন</h4>
              </div>
              
              <div className="mb-3 text-sm text-orange-700">
                {getDeliveryAddressMessage && getDeliveryAddressMessage()}
              </div>
              
              <div>
                <label htmlFor="globalDeliveryAddress" className="block text-base font-medium text-gray-700 mb-2">
                  ডেলিভারি ঠিকানা *
                </label>
                <textarea
                  id="globalDeliveryAddress"
                  value={deliveryAddress}
                  onChange={handleAddressChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                  placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন... (বাড়ি/ফ্ল্যাট নং, রোড, এলাকা, জেলা)"
                  required
                />
                {!((formData?.mobile_number)|| (userdata?.phone) || (userdata?.phone_number)) && (
                  <div className="mt-3 text-sm text-orange-700">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    অতিরিক্ত সেবা ডেলিভারির জন্য মোবাইল নম্বর আবশ্যক—উপরের “আপনার তথ্য প্রদান করুন” অংশে নম্বর দিন।
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="bg-white rounded-xl p-4 lg:p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <Mail className="w-6 h-6 mr-2 text-green-600" />
            আপনার তথ্য প্রদান করুন
          </h2>
          
          {!userdata && (
            <div className="mb-6" id="rah">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('signin')}
                  className={`px-6 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${
                    activeTab === 'signin'
                      ? 'text-green-600 border-green-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  সাইন ইন
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className={`px-6 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${
                    activeTab === 'register'
                      ? 'text-green-600 border-green-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  রেজিস্টার
                </button>
              </div>
            </div>
          )}
          
          <div className="space-y-6">
            {userdata && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-800">
                    Logged in as: <strong>{userdata.email || userdata.name || 'User'}</strong>
                  </span>
                </div>
              </div>
            )}

            {/* REGISTER TAB */}
            {!userdata && activeTab === 'register' && (
              <>
                {/* Google Register */}
                <div className="mb-2">
                  <GoogleLogin
                    onSuccess={onGoogleRegisterSuccess}
                    onError={onGoogleRegisterError}
                    theme="outline"
                    size="large"
                    text="signup_with"
                    shape="rectangular"
                    useOneTap={false}
                    auto_select={false}
                  />
                </div>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-white text-gray-400 text-xs">
                      অথবা ইমেইলে রেজিস্টার করুন
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-2">
                    ইমেইল *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="আপনার ইমেইল লিখুন"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-base font-medium text-gray-700 mb-2">
                    পাসওয়ার্ড *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-200 transition-all"
                      placeholder="আপনার পাসওয়ার্ড লিখুন"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="mobile_number" className="block text-base font-medium text-gray-700 mb-2">
                    মোবাইল নম্বর *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      id="mobile_number"
                      name="mobile_number"
                      value={formData.mobile_number || ''}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="আপনার মোবাইল নম্বর লিখুন"
                      required
                    />
                  </div>
                </div>

                {/* WhatsApp (optional) */}
                {!sameAsPhone && (
                  <div>
                    <label htmlFor="whatsapp" className="block text-base font-medium text-gray-700 mb-2">
                      হোয়াটসঅ্যাপ নম্বর
                    </label>
                    <div className="relative">
                      <MessageCircle className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        id="whatsapp"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="আপনার হোয়াটসঅ্যাপ নম্বর লিখুন"
                      />
                    </div>
                  </div>
                )}

                {/* same as phone */}
                <div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsPhone}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="ml-2 text-base text-gray-600">
                      হোয়াটসঅ্যাপ নম্বর ফোন নম্বরের মতোই।
                    </span>
                  </label>
                  
                  {sameAsPhone && formData.mobile_number && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-800">
                          WhatsApp: <strong>{formData.mobile_number}</strong>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* SIGN IN TAB */}
            {!userdata && activeTab === 'signin' && (
              <>
                <div className="mt-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">অ্যাকাউন্ট আছে?</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div style={{ width: '100%' }}>
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        theme="outline"
                        size="large"
                        text="continue_with"
                        shape="rectangular"
                        useOneTap={false}
                        auto_select={false}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Additional Features Modal */}
      <AdditionalFeaturesModal
        isOpen={showAdditionalModal}
        onClose={closeAdditionalModal}
        feature={selectedFeatureForModal}
        selectedAdditionals={selectedAdditionals}
        onAdditionalToggle={handleAdditionalToggle}
        deliveryAddress={deliveryAddress}
        onAddressChange={handleAddressChange}
        onProceed={handleModalProceed}
        selectedExtraFeatures={selectedExtraFeatures}
        onFeatureDeselection={handleFeatureDeselectionFromModal}
        // pass phone for validation & editing from modal
        phoneNumber={formData?.mobile_number}
        onPhoneChange={handleInputChange} // persists  to parent formData so it won't disappear on close
      />
    </>
  );
}

export default LeftCheckout;
