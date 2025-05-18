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
import { NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [MatIconModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule, NavbarComponent, MatSidenavModule, MatCardModule, FriendsComponent, NgIf],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  userService: UserService = inject(UserService);

  constructor(private route: ActivatedRoute) {
    this.userService.setUser(this.route.snapshot.data['data'].user);
  }
}
