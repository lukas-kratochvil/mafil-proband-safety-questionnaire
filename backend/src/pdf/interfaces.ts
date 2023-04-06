export interface IPdfCommonItemsFile {
  probandContact: {
    consent: {
      mafilEmail: string;
      uoouSite: string;
      uoouEmail: string;
      poverenecEmail: string;
      personalInfoProtectionSite: string;
      applicationOfDataSubjectRightsSite: string;
    };
  };
}

export interface IPdfTextsFile {
  inputTitles: {
    project: string;
    measurementDate: string;
    phantom: string;
    name: string;
    surname: string;
    personalId: string;
    birthdate: string;
    gender: string;
    nativeLanguage: string;
    height: string;
    weight: string;
    visualCorrection: string;
    handedness: string;
  };
  probandContact: {
    consent: {
      title: string;
      text1: string;
      text2: string;
      text3: string;
      text4: string;
      list: string;
      listItem1: string;
      listItem2: string;
      listItem3: string;
      listItem4: string;
      listItem5Part1: string;
      listItem5Part2: string;
      text5Part1: string;
      text5Part2: string;
      text5Part3: string;
    };
  };
}
