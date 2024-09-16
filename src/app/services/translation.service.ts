import { Injectable } from '@angular/core';
import {SendReceiveRequestsService} from "../providers/send-receive-requests.service";
import {ProfileService} from "./profile.service";
import {language} from "ionicons/icons";

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  private language: string|null = null
  private translations: any = {}

  constructor(private sendReceiveRequestsService: SendReceiveRequestsService,
              private profileService: ProfileService
                    ) {
    const userLanguage = this.sendReceiveRequestsService.GetUserLanguage();
    this.init(userLanguage);

    this.profileService.observableOnProfileDataChanged().subscribe(() =>
    {
      const userLanguage = this.sendReceiveRequestsService.GetUserLanguage();
      if (this.language != userLanguage) {
        this.init(userLanguage);
      }
    });
  }

  async init(language: string) {
    try {
      this.language = language;
      const translations : any = await this.sendReceiveRequestsService.Translation();
      this.translations = translations[language];
      localStorage.setItem('translations', JSON.stringify(this.translations));
    } catch (error) {
      console.error('Error loading translations:', error);
      this.loadTranslationsFromLocalStorage();
    }
  }

  loadTranslationsFromLocalStorage() {
    const storedTranslations = localStorage.getItem('translations');
    if (storedTranslations) {
      this.translations = JSON.parse(storedTranslations);
      console.log('Translations loaded from LocalStorage');
    } else {
      console.warn('No translations available in LocalStorage');
      this.translations = {};
    }
  }

  trans(context: string, key: string, additionalContext: string | null = null){
    if (additionalContext && this.translations && this.translations[context] && this.translations[context][additionalContext] && this.translations[context][additionalContext][key]) {
      return this.translations[context][additionalContext][key];
    } else if (this.translations && this.translations[context] && this.translations[context][key]) {
      return this.translations[context][key];
    } else {
      console.warn(`Translation not found for [${context}][${key}]`);
      return key;
    }
  }

  replacePlaceholders(templateString: string, values: { [key: string]: any } ) {
    return templateString.replace(/:\w+/g, (match) => {
      const key = match.substring(1);
      return values[key] !== undefined ? values[key] : match;
    });
  }
}
