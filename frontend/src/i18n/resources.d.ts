interface Resources {
  translation: {
    common: {
      logOutButton: "Log out";
      backButton: "Back";
      navigation: {
        waitingRoom: "Waiting room";
        approvalRoom: "For approval";
        recentVisits: "Recent visits";
        createNewPhantomForm: "Create new phantom measurement";
        openNewProbandForm: "Open new proband form";
      };
      errors: {
        missingOidcClaims: "Missing some required OIDC claims!";
        missingMFA: "Authentication failed due to missing multifactor authentication (MFA)!";
        contactAdmin: "An error occurred! Please contact the system administrator.";
        tryAgainLater: "An error occurred! Please try again later or contact the system administrator.";
        serverValidationError: "An error occurred while validating the input! The following fields are incorrect";
        serverCommunicationError: "An internal server error has occurred! Please contact your system administrator.";
        cannotDuplicateVisitDueToDifferentSafetyQuestions: "Visit safety questions differs from the current safety questions! Visit cannot be duplicated.";
      };
    };
    form: {
      common: {
        optional: "optional";
        loading: "Loading";
        noOptions: "No options";
        buttons: {
          agree: "Agree";
          complete: "Complete";
          finalize: "Finalize";
          approve: "Approve";
          disapprove: "Disapprove";
          confirmDisapproval: "Confirm disapproval";
          edit: "Edit";
          cancel: "Cancel";
          saveChanges: "Save changes";
        };
      };
      options: {
        visualCorrection: {
          yes: "Yes";
          no: "No";
        };
      };
      disapprovalReason: {
        title: "Disapproval";
        reason: "Reason";
      };
      finalizeDialog: {
        title: "Approval of the visit form";
        text: "The visit form will be sent for approval by the MR operator with a higher authority.";
        buttons: {
          continue: "Continue";
          cancel: "Cancel";
        };
      };
      probandContact: {
        title: "Contact information";
        email: "E-mail";
        phone: "Phone number";
      };
      probandContactCheckbox: {
        title: "Measured data transfer";
        label: "I request the transfer of my measured data electronically.";
      };
      probandContactRequest: {
        email: "E-mail";
        phone: "Phone number";
        emailNote: "A link to download the data will be sent to the email.";
        phoneNote: "A login security code will be sent to the phone number.";
      };
      probandInfo: {
        title: "Personal data";
        name: "Name";
        surname: "Surname";
        personalId: "Personal ID";
        personalIdHint: "If you do not have a Czech or Slovak personal ID, please enter your insurance number.";
        birthdate: "Birthdate";
        gender: "Gender";
        nativeLanguage: "Native language";
        height: "Height";
        weight: "Weight";
        visualCorrection: "Visual correction";
        visualCorrectionDioptre: "Visual correction value";
        visualCorrectionDioptreHint: "Positive diopters indicate farsightedness, which means that you see worse up close. On the contrary, negative diopters indicate myopia, i.e. you see worse at a distance.";
        handedness: "Handedness";
      };
      projectInfo: {
        title: "Project information";
        project: "Project";
        device: "Device";
        measuredAt: "Measurement date";
        phantomInfoStripe: "Phantom";
      };
      safetyQuestions: {
        title: "Safety questions";
        titlePart1: "Safety questions - part 1";
        titlePart2: "Safety questions - part 2";
        yes: "Yes";
        no: "No";
        comment: "Comment";
      };
      validation: {
        required: "Required field.";
        notValid: "The value is not valid.";
        integer: "The value must be an integer.";
        positive: "The value must be a positive number.";
        birthdateMaxDate: "The maximum allowed date of birth is today.";
        birthdateNotCorrespondToPersonalId: "The birthdate does not match the value obtained from the provided Czech or Slovak personal ID.";
        genderNotCorrespondToPersonalId: "The gender does not match the value obtained from the provided Czech or Slovak personal ID.";
        visualCorrectionDioptreNotZero: "The value must not be equal to zero.";
        safetyQuestionsRequired: "All security questions must be answered.";
        probandContacts: "If you chose to fill in contact information, please fill in all possible ones.";
      };
    };
    homePage: {
      title: "Your form has been successfully submitted. Please wait for further instructions from the operator.";
      openNewFormButton: "Open new form";
    };
    loginPage: {
      title: "Proband safety questionnaire";
      loginText: "Log in via:";
      alert: "Login failed!";
    };
    oidcAuthCallbackPage: {
      processing: "Processing log in...";
    };
    visitDetailPage: {
      title: "Detail of visit";
      buttons: {
        downloadPDFAndPhysicallySign: "Download PDF and physically sign";
        signElectronically: "Sign electronically";
        confirmSignature: "Confirm signature";
        downloadPDF: "Download PDF";
      };
      infoStripes: {
        signatureChoice: "Choosing the method of signing the visit";
        disapproved: "Disapproved";
        waitingForSignatureConfirmation: "Waiting for signature confirmation";
        completed: "Completed";
        signed: "Signed";
      };
    };
    waitingRoomTablePage: {
      title: "Waiting room";
      actions: {
        processButton: "Process";
        clearIconDialogTitle: "Deleting the form from the Waiting Room";
        clearIconDialogContent: "Do you really want to delete this form from the Waiting Room?";
        clearIconDialogDelete: "Delete";
        clearIconDialogCancel: "Cancel";
      };
      header: {
        registrationDate: "Registration date";
        proband: "Proband";
        personalId: "Personal ID";
        birthdate: "Birthdate";
        gender: "Gender";
        nativeLanguage: "Native language";
        actions: "Actions";
      };
    };
    approvalRoomTablePage: {
      title: "For approval";
      actions: {
        showButton: "Show";
      };
      header: {
        registrationDate: "Registration date";
        project: "Project";
        proband: "Proband";
        personalId: "Personal ID";
        birthdate: "Birthdate";
        gender: "Gender";
        nativeLanguage: "Native language";
        actions: "Actions";
      };
    };
    recentVisitsTablePage: {
      title: "Recent visits";
      visitState: {
        phantomDone: "Completed";
        disapproved: "Disapproved";
        approved: "Approved";
        forSignaturePhysically: "For physical signature";
        forSignatureElectronically: "For electronic signature";
        signedPhysically: "Signed physically";
        signedElectronically: "Signed electronically";
      };
      actions: {
        showDetailButton: "Show detail";
        duplicateButton: "Duplicate";
        incompleteVisit: "Incomplete data";
      };
      header: {
        proband: "Proband";
        project: "Project";
        device: "Device";
        created: "Created";
        visitDate: "Visit date";
        processedBy: "Processed by";
        state: "State";
        actions: "Actions";
      };
    };
    notFoundPage: {
      text: "Page not found.";
    };
  };
}

export default Resources;
