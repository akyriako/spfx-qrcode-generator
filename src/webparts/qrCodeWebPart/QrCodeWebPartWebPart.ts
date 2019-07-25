import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  PropertyPaneSlider
} from '@microsoft/sp-property-pane';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './QrCodeWebPartWebPart.module.scss';
import * as strings from 'QrCodeWebPartWebPartStrings';

import { QRCode ,ErrorCorrectLevel, QRNumber, QRAlphaNum, QR8BitByte, QRKanji } from "qrcode-generator-ts/js";

export interface IQrCodeWebPartWebPartProps {
  textInput: string;
  widthInput: number;
  errorCorrectionLevelInput: string;
  typeNumberInput: number;
}

export default class QrCodeWebPartWebPart extends BaseClientSideWebPart<IQrCodeWebPartWebPartProps> {

  public render(): void 
  {
    var input: string;
    var errorCorrectionLevel: ErrorCorrectLevel;
    var typeNumber: number;

    if (this.properties.errorCorrectionLevelInput === undefined || this.properties.errorCorrectionLevelInput.length === 0)
    {
      errorCorrectionLevel = ErrorCorrectLevel.M;
    }
    else 
    {
      errorCorrectionLevel = <ErrorCorrectLevel>ErrorCorrectLevel[this.properties.errorCorrectionLevelInput];
    }

    if (this.properties.typeNumberInput === undefined || this.properties.typeNumberInput === 0)
    {
      typeNumber = 4;
    }
    else 
    {
      typeNumber = Number(this.properties.typeNumberInput);
    }

    if (this.properties.textInput === undefined || this.properties.textInput.length === 0)
    {
      input = this.domElement.baseURI;
    }
    else
    {
      input = this.properties.textInput;
    }

    var qrCode = new QRCode();
    qrCode.setErrorCorrectLevel(errorCorrectionLevel);
    qrCode.setTypeNumber(typeNumber);
    qrCode.addData(escape(input));
    qrCode.make();
    let base64ImageString = qrCode.toDataURL();

    var imageStyleString: string = `width:${this.properties.widthInput}px;height:${this.properties.widthInput}px`;

    this.domElement.innerHTML = `
      <div class="${ styles.qrCodeWebPart }">

      <img src="${ base64ImageString }" style="${ imageStyleString }" />
      <!--
        <div class="${ styles.container }">
          <div class="${ styles.row }">
            <div class="${ styles.column }">
                <span class="${ styles.title }">Welcome to SharePoint!</span>
                <p class="${ styles.subTitle }">Customize SharePoint experiences using Web Parts.</p>
                <p class="${ styles.description }">${ escape(input) }</p>
                <a href="https://aka.ms/spfx" class="${ styles.button }">
                  <span class="${ styles.label }">Learn more</span>
                </a> 
              </div> 
            </div>  
          </div>
        --!>
      </div>`;
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneSlider('typeNumberInput',{  
                  label: strings.TypeNumberFieldLabel,  
                  min:1,  
                  max:40,  
                  value:4,  
                  showValue:true,  
                  step:1                
                }),
                PropertyPaneDropdown('errorCorrectionLevelInput', { 
                  label: strings.ErrorCorrectionLevelFieldLabel,
                  options: [ 
                    { key: 'L', text: 'L(7%)' }, 
                    { key: 'M', text: 'M(15%)' }, 
                    { key: 'Q', text: 'Q(25%)' },
                    { key: 'H', text: 'H(30%)' } 
                  ],
                  selectedKey: 'M',
                }),
                PropertyPaneTextField('textInput', {
                  label: strings.TextInputFieldLabel
                }),
              ]
            },
            {
              groupName: strings.AppearanceGroupName,
              groupFields: [
                PropertyPaneTextField('widthInput', {
                  label: strings.WidthInputFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
