import React from 'react';
import { Check, Package, Phone, Mail, Lock, MessageCircle, AlertCircle, Plus, File, Folder } from 'lucide-react';
import { convertNumberToBangla } from '../../utils/englishToBangla';

const RightCheckout = ({
 userdata,
  selectedTab,
  handleSubmit,
  isSubmitting,
  packageInfo,
  prices,
  selectedFiles,
  fileCount,
  selectedAdditionals,
  extraFeatures,
  selectedExtraFeatures, // Add this
  deliveryAddress, // Add this
  isDeliveryAddressRequired, // Add this function
  isFreeOrder, // Add this
  isCheckingLimits, // Add this
  orderValidationResult // Add this
}) => {
  console.log(userdata,
  selectedTab)
  // Calculate selected additional features for display
const getSelectedAdditionalFeatures = () => {
  const additionalFeatures = [];
  
  // Add null check here
  Object.keys(selectedAdditionals || {}).forEach(featureId => {
    const additionalSelections = selectedAdditionals[featureId];
    const feature = extraFeatures?.data?.find(f => f.id.toString() === featureId.toString());
    
    if (feature && feature.additionals) {
      Object.keys(additionalSelections || {}).forEach(additionalId => {
        if (additionalSelections[additionalId]) {
          const additional = feature.additionals.find(a => a.id.toString() === additionalId.toString());
          if (additional) {
            additionalFeatures.push({
              name: additional.name,
              price: parseFloat(additional.offer_price || additional.price || 0),
              originalPrice: parseFloat(additional.price || 0),
              featureName: feature.name
            });
          }
        }
      });
    }
  });
  
  return additionalFeatures;
};

  const selectedAdditionalFeatures = getSelectedAdditionalFeatures();
const scrollToElement = (id) => {
  const element = document.getElementById(id);
  if (element) {
    const yOffset = -180; // 👉 আপনার header / top gap এর height অনুযায়ী (-100 বা -120px)
    const y = element.getBoundingClientRect().top + window.scrollY+ yOffset ;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
};
  return (
    <>
      <div className="bg-white rounded-xl px-3 py-6 lg:p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <Package className="w-6 h-6 mr-2 text-green-600" />
          Order Summary
        </h2>
        
        <div className="bg-gradient-to-br from-green-50 to-indigo-100 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            {/* Icon and Title */}
            <div className="flex items-center gap-4">
              {packageInfo?.icon && (
                <img
                  src={packageInfo.icon}
                  alt={packageInfo?.field_name || 'Package'}
                  className="w-12 h-12 rounded-full border-2"
                  style={{ borderColor: packageInfo.color || '#3561FF' }}
                />
              )}
              <h3 className="text-xl font-bold text-gray-800">
                {packageInfo?.field_name || 'Selected Package'}
              </h3>
            </div>

            {/* Duration Pill */}
            {packageInfo?.duration && (
              <span className="text-xs font-medium text-gray-700 bg-white px-3 py-1 rounded-full border border-gray-200">
                {packageInfo.duration}
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            {isFreeOrder ? (
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-green-600">বিনামূল্যে</span>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  দৈনিক সীমার মধ্যে
                </span>
              </div>
            ) : isCheckingLimits ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                <span className="text-lg text-gray-600">মূল্য যাচাই করা হচ্ছে...</span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-green-600">
                ৳{convertNumberToBangla((prices.subtotal || 0).toFixed(2))}
              </span>
            )}
            
            <div className="text-right">
              <div className="text-base text-gray-600">
                ৳{convertNumberToBangla(packageInfo?.price_per_file || packageInfo?.price || '0')} per file
              </div>
              <div className="text-base text-gray-500">
                Limit: {convertNumberToBangla(packageInfo?.file_limit || packageInfo?.file_range || 'N/A')} files
              </div>
            </div>
          </div>

          {/* File Count */}
          {fileCount > 0 && (
            <div className="text-base text-gray-600">
              {convertNumberToBangla(fileCount)} file{fileCount > 1 ? 's' : ''} selected
            </div>
          )}
        </div>

        {/* Selected Files Summary */}
        {selectedFiles && selectedFiles.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 ">
            <div className="flex items-center gap-2 mb-3">
              <Folder className="w-5 h-5 text-gray-600" />
              <h4 className="font-semibold text-gray-700">Selected Files</h4>
              <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="max-h-32 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-3 p-2 hover:bg-white rounded-md transition-colors duration-150">
                  <File className="w-4 h-4 text-gray-500" />
                  <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-700 truncate">
                        {(file.name ? file.name.replace(/\.[^/.]+$/, '') : `File ${index + 1}`)}
                      </div>
                    
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Additional Features Summary */}
        {selectedAdditionalFeatures.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Plus className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-700">Additional Services</h4>
              <span className="text-sm text-blue-600 bg-blue-200 px-2 py-1 rounded-full">
                {selectedAdditionalFeatures.length} selected
              </span>
            </div>
            
            <div className="space-y-2">
              {selectedAdditionalFeatures.map((additional, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white rounded-md">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700">
                      {additional.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      from {additional.featureName}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-blue-600">
                      ৳{convertNumberToBangla((additional.price * fileCount).toFixed(2))}
                    </div>
                    {additional.price < additional.originalPrice && (
                      <div className="text-xs text-gray-400 line-through">
                        ৳{convertNumberToBangla((additional.originalPrice * fileCount).toFixed(2))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="pt-6 border-t border-gray-200">
          {isFreeOrder ? (
            <div className="text-center py-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center text-green-700 mb-2">
                  <Check className="w-5 h-5 mr-2" />
                  <span className="font-semibold">বিনামূল্যে অর্ডার</span>
                </div>
                <p className="text-sm text-green-600">
                  আপনার প্যাকেজের দৈনিক সীমার মধ্যে এই অর্ডারটি বিনামূল্যে প্রক্রিয়া করা হবে।
                </p>
                {orderValidationResult?.daily_order_status && (
                  <div className="text-xs text-green-500 mt-2">
                    আজকে অবশিষ্ট: {orderValidationResult.daily_order_status.remaining_orders} অর্ডার
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold text-green-600">মোট: বিনামূল্যে</div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Base Package:</span>
                <span className="font-semibold">৳{convertNumberToBangla((prices.baseAmount || 0).toFixed(2))}</span>
              </div>
              
              {(prices.extraFeaturesTotal || 0) > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Extra Features:</span>
                  <span className="font-semibold text-green-600">+ ৳{convertNumberToBangla((prices.extraFeaturesTotal || 0).toFixed(2))}</span>
                </div>
              )}
              
              {(prices.additionalFeaturesTotal || 0) > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Additional Services:</span>
                  <span className="font-semibold text-blue-600">+ ৳{convertNumberToBangla((prices.additionalFeaturesTotal || 0).toFixed(2))}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">৳{convertNumberToBangla((prices.subtotal || 0).toFixed(2))}</span>
              </div>
              
              <div className="border-t pt-2 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total:</span>
                  <span className="text-xl font-bold text-green-600">৳{convertNumberToBangla((prices.finalTotal || 0).toFixed(2))}</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className='mt-10'>
          <div className="fixed bottom-0 left-0 right-0 animate-bounce px-2 md:relative md:border-t-0 md:p-0 md:bg-transparent z-30">
<button
  type="button"
  onClick={() => {
    if (isSubmitting) {
      console.log("⏳ Submit হচ্ছে, scroll করানো হলো না");
      return;
    }

    // ✅ Priority 1 → Check base package selection for paid orders
    if (!isFreeOrder && prices.finalTotal === 0) {
      console.log("⚠️ কোনো সেবা নির্বাচন করা হয়নি → Package section এ scroll হবে");
      scrollToElement("packageSelection");
      return;
    }

    // ✅ Priority 2 → Delivery Address
    if (
      isDeliveryAddressRequired &&
      isDeliveryAddressRequired() &&
      !deliveryAddress?.trim()
    ) {
      console.log("⚠️ ডেলিভারি address খালি → globalDeliveryAddress এ scroll হবে");
      scrollToElement("globalDeliveryAddress");
      return;
    }

    // ✅ Priority 3 → User Sign In check
    if (selectedTab !== "register" && !userdata) {
      console.log("⚠️ User লগইন করা নেই → email section এ scroll হবে");
      scrollToElement("rah");
      return;
    }

    // ✅ সব কিছু ঠিক থাকলে submit
    console.log("✅ সব condition ঠিক আছে → handleSubmit কল হচ্ছে");
    handleSubmit();
  }}
  className={`w-full py-4 px-6 rounded-lg font-semibold focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all transform text-lg
    ${
      isSubmitting ||
      (!isFreeOrder && prices.finalTotal === 0) ||
      (isDeliveryAddressRequired &&
        isDeliveryAddressRequired() &&
        !deliveryAddress?.trim()) ||
      (selectedTab !== "register" && !userdata)
        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
        : isFreeOrder
        ? "bg-green-600 text-white hover:bg-green-700 hover:scale-105"
        : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
    }`}
  title={
    isSubmitting
      ? "Processing..."
      : (!isFreeOrder && prices.finalTotal === 0)
      ? "কমপক্ষে একটি সেবা নির্বাচন করুন"
      : (isDeliveryAddressRequired &&
          isDeliveryAddressRequired() &&
          !deliveryAddress?.trim())
      ? "ডেলিভারি ঠিকানা প্রয়োজন"
      : (selectedTab !== "register" && !userdata)
      ? "সাইন ইন করতে হবে"
      : ""
  }
>
  {isSubmitting ? (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
      Processing...
    </div>
  ) : (!isFreeOrder && prices.finalTotal === 0) ? (
    "কমপক্ষে একটি সেবা নির্বাচন করুন"
  ) : (isDeliveryAddressRequired &&
      isDeliveryAddressRequired() &&
      !deliveryAddress?.trim()) ? (
    "ডেলিভারি ঠিকানা প্রয়োজন"
  ) : (selectedTab !== "register" && !userdata) ? (
    "সাইন ইন করতে হবে"
  ) : isFreeOrder ? (
    "বিনামূল্যে অর্ডার করুন"
  ) : (
    `Complete Purchase - ৳${convertNumberToBangla(
      prices.finalTotal.toFixed(2)
    )}`
  )}
</button>







          </div>
        </div>
      </div>
    </>
  );
}

export default RightCheckout;