import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'zappy_theme';
  private isDarkThemeSubject = new BehaviorSubject<boolean>(false);
  
  isDarkTheme$ = this.isDarkThemeSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const themeData = localStorage.getItem(this.STORAGE_KEY);
    if (themeData) {
      try {
        const isDark = JSON.parse(themeData);
        this.isDarkThemeSubject.next(isDark);
        this.applyTheme(isDark);
      } catch (e) {
        console.error('Error parsing theme data', e);
      }
    }
  }

  toggleTheme() {
    const newTheme = !this.isDarkThemeSubject.value;
    this.isDarkThemeSubject.next(newTheme);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newTheme));
    this.applyTheme(newTheme);
  }

  private applyTheme(isDark: boolean) {
    if (isDark) {
      document.documentElement.classList.add('dark-theme');
      this.setMetaThemeColor('#121212');
    } else {
      document.documentElement.classList.remove('dark-theme');
      this.setMetaThemeColor('#ffffff');
    }
  }

  private setMetaThemeColor(color: string) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', color);
  }
}