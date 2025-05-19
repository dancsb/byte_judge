import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { canActivateGuard } from './guards/auth.guard';
import { loggedInGuard } from './guards/logged-in.guard';
import { EmailConfirmationComponent } from './email-confirmation/email-confirmation.component';
import { DataResolver } from './guards/data-resolve.quard';
import { ExerciseDetailsComponent } from './exercise-details/exercise-details.component';
import { CreateExerciseComponent } from './create-exercise/create-exercise.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route
  { path: 'login', component: LoginComponent, canMatch: [loggedInGuard] },
  { path: 'register', component: RegisterComponent, canMatch: [loggedInGuard] },
  { path: 'landing', component: LandingPageComponent, canMatch: [canActivateGuard], resolve: { data: DataResolver } },
  { path: 'profile', component: UserProfileComponent, canMatch: [canActivateGuard], resolve: { data: DataResolver } },
  { path: 'change-password', component: ChangePasswordComponent, canMatch: [canActivateGuard], resolve: { data: DataResolver } },
  { path: 'activate-account', component: EmailConfirmationComponent},
  { path: 'exercise-details/:id', component: ExerciseDetailsComponent, canMatch: [canActivateGuard], resolve: { data: DataResolver } },
  { path: 'create-exercise', component: CreateExerciseComponent, canMatch: [canActivateGuard], resolve: { data: DataResolver }  }
];