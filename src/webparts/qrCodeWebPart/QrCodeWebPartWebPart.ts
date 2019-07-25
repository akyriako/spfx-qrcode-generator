import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './QrCodeWebPartWebPart.module.scss';
import * as strings from 'QrCodeWebPartWebPartStrings';

import { QRCode ,ErrorCorrectLevel, QRNumber, QRAlphaNum, QR8BitByte, QRKanji } from "qrcode-generator-ts/js";

export interface IQrCodeWebPartWebPartProps {
  textInput: string;
  widthInput: number;
  // heightInput: number;
}

export default class QrCodeWebPartWebPart extends BaseClientSideWebPart<IQrCodeWebPartWebPartProps> {

  public render(): void 
  {
    var input: string;

    if (this.properties.textInput === undefined || this.properties.textInput.length === 0)
    {
      input = this.domElement.baseURI;
    }
    else
    {
      input = this.properties.textInput;
    }

    var qrCode = new QRCode();
    qrCode.setErrorCorrectLevel(ErrorCorrectLevel.M);
    qrCode.setTypeNumber(4);
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
                PropertyPaneTextField('textInput', {
                  label: strings.TextInputFieldLabel
                })
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