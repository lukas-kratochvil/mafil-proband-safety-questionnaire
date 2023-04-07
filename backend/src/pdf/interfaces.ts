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
  probandContact: {
    request: {
      title: string;
      text1: string;
      text2: string;
      text3: string;
      emailAddress: string;
      emailAddressInfo: string;
      phoneNumber: string;
      phoneNumberInfo: string;
    };
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
