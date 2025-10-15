import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within ModalProvider");
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    verificationRequired: {
      isOpen: false,
      onGoToProfile: null,
    },
    accountVerification: {
      isOpen: false,
      onComplete: null,
      user: null,
    },
    addressEditor: {
      isOpen: false,
      addressForm: null,
      setAddressForm: null,
      onSave: null,
    },
  });

  const openVerificationRequiredModal = (onGoToProfile) => {
    setModalState((prev) => ({
      ...prev,
      verificationRequired: {
        isOpen: true,
        onGoToProfile,
      },
    }));
  };

  const closeVerificationRequiredModal = () => {
    setModalState((prev) => ({
      ...prev,
      verificationRequired: {
        isOpen: false,
        onGoToProfile: null,
      },
    }));
  };

  const openAccountVerificationModal = (onComplete, user = null) => {
    setModalState((prev) => ({
      ...prev,
      accountVerification: {
        isOpen: true,
        onComplete,
        user,
      },
    }));
  };

  const closeAccountVerificationModal = () => {
    setModalState((prev) => ({
      ...prev,
      accountVerification: {
        isOpen: false,
        onComplete: null,
        user: null,
      },
    }));
  };

  const openAddressEditorModal = (addressForm, setAddressForm, onSave) => {
    setModalState((prev) => ({
      ...prev,
      addressEditor: {
        isOpen: true,
        addressForm,
        setAddressForm,
        onSave,
      },
    }));
  };

  const closeAddressEditorModal = () => {
    setModalState((prev) => ({
      ...prev,
      addressEditor: {
        isOpen: false,
        addressForm: null,
        setAddressForm: null,
        onSave: null,
      },
    }));
  };

  const value = {
    modalState,
    openVerificationRequiredModal,
    closeVerificationRequiredModal,
    openAccountVerificationModal,
    closeAccountVerificationModal,
    openAddressEditorModal,
    closeAddressEditorModal,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};
