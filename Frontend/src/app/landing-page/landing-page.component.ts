import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FriendsComponent } from "../friends/friends.component";
import { NgIf, NgFor } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { ExerciseService } from '../exercise.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [MatIconModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule, NavbarComponent, MatSidenavModule, MatCardModule, FriendsComponent, NgIf, NgFor],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  userService: UserService = inject(UserService);
  exerciseService: ExerciseService = inject(ExerciseService);
  exercises: any[] = [];

  constructor(private route: ActivatedRoute) {
    this.userService.setUser(this.route.snapshot.data['data'].user);
    this.loadExercises();
  }

  private async loadExercises() {
    try {
      this.exercises = await this.exerciseService.getExercises();
    } catch (error) {
      console.error('Failed to load exercises:', error);
    }
  }

  formatDescription(description: string): string {
    return description.replace(/\n/g, '<br>');
  }
}
