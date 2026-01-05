import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import {ExpenseTrackerComponent} from './app/app'

bootstrapApplication(ExpenseTrackerComponent, appConfig)
  .catch((err) => console.error(err));
