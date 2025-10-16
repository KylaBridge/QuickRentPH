/**
 * Example usage of centralized rental calculations
 * This file demonstrates how to use the rental calculation utilities
 */

import {
  calculateRentalBreakdown,
  quickRateCalculation,
  formatCurrency,
  validateRentalInputs,
  BUSINESS_RATES,
} from "../utils/rentalCalculations";

// Example 1: Quick rate calculation for AddItem component
export const useRateDisplay = (baseRate) => {
  const calculation = quickRateCalculation(baseRate);

  return {
    showCalculation: calculation.baseRate > 0,
    baseRateFormatted: calculation.formattedBase,
    taxAmountFormatted: calculation.formattedTax,
    finalRateFormatted: calculation.formattedFinal,
    taxPercentage: BUSINESS_RATES.TAX_RATE * 100, // 12%
  };
};

// Example 2: Full rental breakdown for modals and payment pages
export const useRentalBreakdown = (baseRate, duration, depositPercent) => {
  // First calculate final rate with tax
  const finalRate = quickRateCalculation(baseRate).finalRate;

  // Then calculate breakdown using final rate (avoids double taxation)
  const breakdown = calculateRentalBreakdown(
    finalRate,
    duration,
    depositPercent
  );

  return {
    isValid: finalRate > 0 && breakdown.duration > 0,

    // Daily rate info
    dailyRate: {
      final: formatCurrency(breakdown.dailyRate.final),
      tax: formatCurrency(breakdown.dailyRate.tax),
      final: formatCurrency(breakdown.dailyRate.final),
    },

    // Payment breakdown
    rentalCost: formatCurrency(breakdown.totalRentalCost),
    deposit: formatCurrency(breakdown.depositAmount),
    serviceFee: formatCurrency(breakdown.serviceFee),
    totalDue: formatCurrency(breakdown.totalAmountDue),

    // Earnings breakdown
    platformEarnings: formatCurrency(breakdown.platformEarnings),
    ownerEarnings: formatCurrency(breakdown.ownerReceivable),

    // Raw values for calculations
    raw: breakdown,
  };
};

// Example 3: Validation helper
export const validateRentalForm = (formData) => {
  const validation = validateRentalInputs({
    baseRate: formData.price,
    duration: formData.duration,
    depositPercent: formData.depositPercent,
  });

  return validation;
};

// Example usage in components:
/*
// In AddItem.jsx:
const rateDisplay = useRateDisplay(formData.price);

// In RentalRequestReviewModal.jsx:
const breakdown = useRentalBreakdown(baseRate, duration, depositPercent);

// In any form validation:
const validation = validateRentalForm(formData);
if (!validation.isValid) {
  setErrors(validation.errors);
}
*/
