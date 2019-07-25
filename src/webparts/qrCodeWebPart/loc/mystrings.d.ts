declare interface IQrCodeWebPartWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  TextInputFieldLabel: string;
  AppearanceGroupName: string;
  WidthInputFieldLabel: string;
  // HeightInputFieldLabel: string;
  ErrorCorrectionLevelFieldLabel: string
}

declare module 'QrCodeWebPartWebPartStrings' {
  const strings: IQrCodeWebPartWebPartStrings;
  export = strings;
}
