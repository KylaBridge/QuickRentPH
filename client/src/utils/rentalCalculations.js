/**
 * Centralized Rental Calculations Utility
 * This file handles all rental-related calculations for consistency across the app
 */

// Business Logic Constants
export const BUSINESS_RATES = {
  TAX_RATE: 0.12, // 12% tax
  SERVICE_FEE_RATE: 0.05, // 5% platform service fee
  DEFAULT_DEPOSIT_PERCENT: 50, // 50% default deposit percentage
};

/**
 * Calculate final daily rate with tax included
 * @param {number} baseRate - The base rate before tax
 * @returns {object} - Object containing baseRate, taxAmount, and finalRate
 */
export const calculateDailyRateWithTax = (baseRate) => {
  const numericBaseRate = parseFloat(baseRate) || 0;
  const taxAmount = numericBaseRate * BUSINESS_RATES.TAX_RATE;
  const finalRate = numericBaseRate + taxAmount;

  return {
    baseRate: numericBaseRate,
    taxAmount: Math.round(taxAmount * 100) / 100, // Round to 2 decimal places
    finalRate: Math.round(finalRate * 100) / 100,
    taxPercentage: BUSINESS_RATES.TAX_RATE * 100, // For display (12%)
  };
};

/**
 * Calculate rental payment breakdown (for final rates that already include tax)
 *
 * IMPORTANT: This function expects the final daily rate that already includes tax.
 * Since the app now displays final prices (base + 12% tax) everywhere, we avoid
 * double taxation by using the displayed final rate for rental calculations.
 *
 * @param {number} finalRate - Final daily rate (already includes tax)
 * @param {number} duration - Number of rental days
 * @param {number} depositPercent - Deposit percentage (default 50%)
 * @returns {object} - Complete payment breakdown
 */
export const calculateRentalBreakdown = (
  finalRate,
  duration,
  depositPercent = BUSINESS_RATES.DEFAULT_DEPOSIT_PERCENT
) => {
  const numericFinalRate = parseFloat(finalRate) || 0;
  const numericDuration = parseInt(duration) || 1;
  const numericDepositPercent =
    parseFloat(depositPercent) || BUSINESS_RATES.DEFAULT_DEPOSIT_PERCENT;

  // Step 1: Calculate total rental cost (using final rate that already includes tax)
  const totalRentalCost = numericFinalRate * numericDuration;

  // Step 2: Calculate deposit (based on total rental cost)
  const depositAmount = totalRentalCost * (numericDepositPercent / 100);

  // Step 3: Calculate service fee (platform earnings)
  const serviceFee = totalRentalCost * BUSINESS_RATES.SERVICE_FEE_RATE;

  // Step 4: Calculate total amount due (what renter pays)
  const totalAmountDue = totalRentalCost + depositAmount + serviceFee;

  // Step 5: Calculate owner receivable (rental cost - service fee)
  const ownerReceivable = totalRentalCost - serviceFee;

  return {
    // Input values
    finalRate: numericFinalRate,
    duration: numericDuration,
    depositPercent: numericDepositPercent,

    // Daily rate breakdown (since rate already includes tax)
    dailyRate: {
      final: numericFinalRate,
      taxIncluded: true, // Indicate that tax is already included
    },

    // Payment components
    totalRentalCost: Math.round(totalRentalCost * 100) / 100,
    depositAmount: Math.round(depositAmount * 100) / 100,
    serviceFee: Math.round(serviceFee * 100) / 100,
    totalAmountDue: Math.round(totalAmountDue * 100) / 100,

    // Earnings breakdown
    platformEarnings: Math.round(serviceFee * 100) / 100,
    ownerReceivable: Math.round(ownerReceivable * 100) / 100,
    refundableDeposit: Math.round(depositAmount * 100) / 100,

    // Display helpers
    rates: BUSINESS_RATES,
  };
};

/**
 * Calculate rental payment breakdown from base rate (adds tax)
 * @param {number} baseRate - Base daily rate before tax
 * @param {number} duration - Number of rental days
 * @param {number} depositPercent - Deposit percentage (default 50%)
 * @returns {object} - Complete payment breakdown
 */
export const calculateRentalBreakdownFromBaseRate = (
  baseRate,
  duration,
  depositPercent = BUSINESS_RATES.DEFAULT_DEPOSIT_PERCENT
) => {
  const numericBaseRate = parseFloat(baseRate) || 0;

  // First calculate the final rate with tax
  const dailyRateInfo = calculateDailyRateWithTax(numericBaseRate);

  // Then use the updated function with the final rate
  const breakdown = calculateRentalBreakdown(
    dailyRateInfo.finalRate,
    duration,
    depositPercent
  );

  // Add base rate info to the response
  return {
    ...breakdown,
    baseRate: numericBaseRate,
    dailyRate: {
      base: dailyRateInfo.baseRate,
      tax: dailyRateInfo.taxAmount,
      final: dailyRateInfo.finalRate,
      taxPercentage: dailyRateInfo.taxPercentage,
    },
  };
};

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @param {boolean|string} compactOrCurrency - If boolean: compact format flag. If string: currency code
 * @param {string} currency - Currency code (when first param is boolean)
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (
  amount,
  compactOrCurrency = "PHP",
  currency = "PHP"
) => {
  const numericAmount = parseFloat(amount) || 0;

  // Handle both old and new parameter patterns
  let isCompact = false;
  let currencyCode = "PHP";

  if (typeof compactOrCurrency === "boolean") {
    isCompact = compactOrCurrency;
    currencyCode = currency;
  } else if (typeof compactOrCurrency === "string") {
    currencyCode = compactOrCurrency;
  }

  try {
    const formatter = new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: isCompact ? 0 : 2,
      maximumFractionDigits: isCompact ? 0 : 2,
    });
    return formatter.format(numericAmount);
  } catch (error) {
    const formatted = isCompact
      ? numericAmount.toFixed(0)
      : numericAmount.toFixed(2);
    return `₱${formatted}`;
  }
};

/**
 * Calculate downpayment percentage
 * @param {number} downpayment - Downpayment amount
 * @param {number} totalAmount - Total amount
 * @returns {number} - Percentage
 */
export const calculateDownpaymentPercentage = (downpayment, totalAmount) => {
  const numericDownpayment = parseFloat(downpayment) || 0;
  const numericTotal = parseFloat(totalAmount) || 0;

  if (numericTotal === 0) return 0;

  return Math.round((numericDownpayment / numericTotal) * 100 * 100) / 100;
};

/**
 * Validate rental calculation inputs
 * @param {object} inputs - Input values to validate
 * @returns {object} - Validation result with errors array
 */
export const validateRentalInputs = (inputs) => {
  const errors = [];
  const { baseRate, duration, depositPercent } = inputs;

  if (!baseRate || parseFloat(baseRate) <= 0) {
    errors.push("Base rate must be greater than 0");
  }

  if (!duration || parseInt(duration) <= 0) {
    errors.push("Duration must be at least 1 day");
  }

  if (
    depositPercent !== undefined &&
    (parseFloat(depositPercent) < 0 || parseFloat(depositPercent) > 100)
  ) {
    errors.push("Deposit percentage must be between 0 and 100");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Quick calculation for display purposes (used in components)
 * @param {number} baseRate - Base rate
 * @returns {object} - Quick calculation result for display
 */
export const quickRateCalculation = (baseRate) => {
  const calculation = calculateDailyRateWithTax(baseRate);
  return {
    baseRate: calculation.baseRate,
    taxAmount: calculation.taxAmount,
    finalRate: calculation.finalRate,
    formattedBase: formatCurrency(calculation.baseRate),
    formattedTax: formatCurrency(calculation.taxAmount),
    formattedFinal: formatCurrency(calculation.finalRate),
  };
};
