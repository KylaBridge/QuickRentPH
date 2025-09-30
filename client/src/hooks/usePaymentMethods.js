/**
 * PAYMENT METHODS HOOK - Manages Payment Method Selection and Change Detection
 *
 * This custom hook handles payment method state management and tracks changes
 * for edit mode. It manages the GCash and PayMaya checkbox selections and
 * provides utilities for working with payment method data.
 */

import { useState, useEffect } from "react";

export const usePaymentMethods = (editingItem = null) => {
  const [paymentMethods, setPaymentMethods] = useState({
    gcash: false,
    paymaya: false,
  });

  const [originalPaymentMethods, setOriginalPaymentMethods] = useState({
    gcash: false,
    paymaya: false,
  });

  const [hasPaymentChanges, setHasPaymentChanges] = useState(false);

  // Initialize payment methods when editing
  useEffect(() => {
    if (editingItem) {
      let paymentMethodsObj = { gcash: false, paymaya: false };
      if (editingItem.paymentMethod) {
        const paymentMethodStr = editingItem.paymentMethod.toLowerCase();
        paymentMethodsObj = {
          gcash: paymentMethodStr.includes("gcash"),
          paymaya: paymentMethodStr.includes("paymaya"),
        };
      }
      setPaymentMethods(paymentMethodsObj);
      setOriginalPaymentMethods(paymentMethodsObj);
      setHasPaymentChanges(false);
    } else {
      const resetPayments = { gcash: false, paymaya: false };
      setPaymentMethods(resetPayments);
      setOriginalPaymentMethods(resetPayments);
      setHasPaymentChanges(false);
    }
  }, [editingItem]);

  // Detect payment method changes
  useEffect(() => {
    if (!editingItem) {
      setHasPaymentChanges(paymentMethods.gcash || paymentMethods.paymaya);
      return;
    }

    const paymentMethodsChanged =
      originalPaymentMethods.gcash !== paymentMethods.gcash ||
      originalPaymentMethods.paymaya !== paymentMethods.paymaya;

    setHasPaymentChanges(paymentMethodsChanged);
  }, [paymentMethods, originalPaymentMethods, editingItem]);

  const togglePaymentMethod = (method) => {
    setPaymentMethods((prev) => ({
      ...prev,
      [method]: !prev[method],
    }));
  };

  const getSelectedPaymentMethods = () => {
    return Object.entries(paymentMethods)
      .filter(([, value]) => value)
      .map(([key]) => key)
      .join(",");
  };

  return {
    paymentMethods,
    originalPaymentMethods,
    hasPaymentChanges,
    togglePaymentMethod,
    getSelectedPaymentMethods,
  };
};
